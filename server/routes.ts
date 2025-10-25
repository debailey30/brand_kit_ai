import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  insertBrandKitSchema, 
  insertBrandKitAssetSchema, 
  insertGenerationSchema, 
  insertTemplateSchema,
  insertTemplateVariantSchema,
  insertTemplateControlSchema,
  insertTemplateCustomizationSchema,
  insertTemplateBundleSchema
} from "@shared/schema";
import Stripe from "stripe";
import { generateImage } from "./imageGeneration";
import { addWatermark } from "./watermark";
import { ObjectStorageService } from "./objectStorage";
import { randomUUID } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // ============================================================================
  // Auth routes
  // ============================================================================
  
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Local auth stores the user ID directly
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============================================================================
  // Subscription routes
  // ============================================================================
  
  app.get('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscription(userId);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  app.post('/api/subscription/checkout', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tier } = req.body;
      
      if (!['pro', 'enterprise'].includes(tier)) {
        return res.status(400).json({ message: "Invalid tier" });
      }
      
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email required" });
      }
      
      const subscription = await storage.getSubscription(userId);
      
      // Create or get Stripe customer
      let customerId = subscription?.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId },
        });
        customerId = customer.id;
      }
      
      // Create checkout session
      const priceId = tier === 'pro' 
        ? process.env.STRIPE_PRICE_ID_PRO 
        : process.env.STRIPE_PRICE_ID_ENTERPRISE;
      
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.protocol}://${req.hostname}/dashboard?success=true`,
        cancel_url: `${req.protocol}://${req.hostname}/dashboard?canceled=true`,
        metadata: {
          userId,
          tier,
        },
      });
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.post('/api/subscription/portal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscription(userId);
      
      if (!subscription?.stripeCustomerId) {
        return res.status(400).json({ message: "No active subscription" });
      }
      
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${req.protocol}://${req.hostname}/dashboard`,
      });
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ message: "Failed to create portal session" });
    }
  });

  app.post('/api/webhooks/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).send('Missing stripe signature');
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const userId = session.metadata.userId;
          const tier = session.metadata.tier;
          
          await storage.updateSubscription(userId, {
            tier,
            status: 'active',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            generationsLimit: tier === 'pro' || tier === 'enterprise' ? -1 : 5,
          });
          break;
        }
        
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          const userId = subscription.metadata.userId;
          
          if (event.type === 'customer.subscription.deleted') {
            await storage.updateSubscription(userId, {
              tier: 'free',
              status: 'canceled',
              stripeSubscriptionId: null,
              generationsLimit: 5,
            });
          } else {
            const status = subscription.status === 'active' ? 'active' : 
                          subscription.status === 'past_due' ? 'past_due' : 'incomplete';
            
            await storage.updateSubscription(userId, {
              status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            });
          }
          break;
        }
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  });

  // ============================================================================
  // Brand kit routes
  // ============================================================================
  
  app.get('/api/brand-kits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const brandKits = await storage.getUserBrandKits(userId);
      
      // Get asset counts for each brand kit
      const brandKitsWithCounts = await Promise.all(
        brandKits.map(async (kit) => {
          const assets = await storage.getBrandKitAssets(kit.id);
          return {
            ...kit,
            assetCount: assets.length,
          };
        })
      );
      
      res.json(brandKitsWithCounts);
    } catch (error) {
      console.error("Error fetching brand kits:", error);
      res.status(500).json({ message: "Failed to fetch brand kits" });
    }
  });

  app.get('/api/brand-kits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const brandKit = await storage.getBrandKit(req.params.id);
      
      if (!brandKit) {
        return res.status(404).json({ message: "Brand kit not found" });
      }
      
      if (brandKit.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const assets = await storage.getBrandKitAssets(brandKit.id);
      
      res.json({ ...brandKit, assets });
    } catch (error) {
      console.error("Error fetching brand kit:", error);
      res.status(500).json({ message: "Failed to fetch brand kit" });
    }
  });

  app.post('/api/brand-kits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscription(userId);
      
      // Check limits for free tier
      if (subscription?.tier === 'free') {
        const existingKits = await storage.getUserBrandKits(userId);
        if (existingKits.length >= 1) {
          return res.status(403).json({ message: "Free tier limited to 1 brand kit. Upgrade to create more." });
        }
      }
      
      const validatedData = insertBrandKitSchema.parse({
        ...req.body,
        userId,
      });
      
      const brandKit = await storage.createBrandKit(validatedData);
      res.json(brandKit);
    } catch (error: any) {
      console.error("Error creating brand kit:", error);
      res.status(400).json({ message: error.message || "Failed to create brand kit" });
    }
  });

  app.patch('/api/brand-kits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const brandKit = await storage.getBrandKit(req.params.id);
      
      if (!brandKit) {
        return res.status(404).json({ message: "Brand kit not found" });
      }
      
      if (brandKit.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updated = await storage.updateBrandKit(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating brand kit:", error);
      res.status(500).json({ message: "Failed to update brand kit" });
    }
  });

  app.delete('/api/brand-kits/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const brandKit = await storage.getBrandKit(req.params.id);
      
      if (!brandKit) {
        return res.status(404).json({ message: "Brand kit not found" });
      }
      
      if (brandKit.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteBrandKit(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting brand kit:", error);
      res.status(500).json({ message: "Failed to delete brand kit" });
    }
  });

  app.post('/api/brand-kits/:id/assets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const brandKit = await storage.getBrandKit(req.params.id);
      
      if (!brandKit) {
        return res.status(404).json({ message: "Brand kit not found" });
      }
      
      if (brandKit.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertBrandKitAssetSchema.parse({
        ...req.body,
        brandKitId: req.params.id,
      });
      
      const asset = await storage.createBrandKitAsset(validatedData);
      res.json(asset);
    } catch (error: any) {
      console.error("Error creating brand kit asset:", error);
      res.status(400).json({ message: error.message || "Failed to create asset" });
    }
  });

  app.delete('/api/brand-kit-assets/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteBrandKitAsset(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting asset:", error);
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });

  // ============================================================================
  // Generation routes
  // ============================================================================
  
  app.post('/api/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { 
        prompt, 
        aspectRatio, 
        style, 
        quality, 
        brandKitId,
        templateId,
        variantId,
        customizations
      } = req.body;
      
      if (!prompt || !aspectRatio || !style || quality === undefined) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Get subscription to check tier
      const subscription = await storage.getSubscription(userId);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Check quota for free tier
      if (subscription.tier === "free") {
        if (subscription.generationsUsed >= subscription.generationsLimit) {
          return res.status(403).json({ 
            message: "Generation quota exceeded. Please upgrade to Pro for unlimited generations.",
            quotaExceeded: true,
          });
        }
      }
      
      try {
        // Generate image using AI with template support
        const imageUrl = await generateImage(
          { 
            prompt, 
            aspectRatio, 
            style, 
            quality,
            templateId,
            variantId,
            customizations
          },
          userId
        );
        
        // Save generation record
        const generation = await storage.createGeneration({
          userId,
          brandKitId: brandKitId || null,
          templateId: templateId || null,
          variantId: variantId || null,
          customizations: customizations || null,
          prompt,
          imageUrl,
          aspectRatio,
          style,
          quality,
          hasWatermark: subscription.tier === "free",
          isFavorite: false,
        });
        
        res.json(generation);
      } catch (genError: any) {
        console.error("Error generating image:", genError);
        
        // If quota exceeded, return specific error
        if (genError.message.includes("quota exceeded")) {
          return res.status(403).json({ 
            message: genError.message,
            quotaExceeded: true,
          });
        }
        
        throw genError;
      }
    } catch (error: any) {
      console.error("Error in generation endpoint:", error);
      res.status(500).json({ message: error.message || "Failed to generate image" });
    }
  });
  
  app.get('/api/generations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const generations = await storage.getUserGenerations(userId, limit);
      res.json(generations);
    } catch (error) {
      console.error("Error fetching generations:", error);
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });

  app.get('/api/generations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const generation = await storage.getGeneration(req.params.id);
      
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }
      
      if (generation.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.json(generation);
    } catch (error) {
      console.error("Error fetching generation:", error);
      res.status(500).json({ message: "Failed to fetch generation" });
    }
  });

  app.post('/api/generations/:id/favorite', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const generation = await storage.getGeneration(req.params.id);
      
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }
      
      if (generation.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.toggleGenerationFavorite(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });

  app.delete('/api/generations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const generation = await storage.getGeneration(req.params.id);
      
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }
      
      if (generation.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteGeneration(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting generation:", error);
      res.status(500).json({ message: "Failed to delete generation" });
    }
  });

  // ============================================================================
  // Template marketplace routes
  // ============================================================================
  
  app.get('/api/templates', async (req, res) => {
    try {
      const { category, creatorId } = req.query;
      const templates = await storage.getTemplates({
        category: category as any,
        creatorId: creatorId as string,
        isActive: true,
      });
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post('/api/templates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscription(userId);
      
      // Only Pro and Enterprise users can sell templates
      if (subscription?.tier === 'free') {
        return res.status(403).json({ message: "Upgrade to Pro or Enterprise to sell templates" });
      }
      
      const validatedData = insertTemplateSchema.parse({
        ...req.body,
        creatorId: userId,
      });
      
      const template = await storage.createTemplate(validatedData);
      res.json(template);
    } catch (error: any) {
      console.error("Error creating template:", error);
      res.status(400).json({ message: error.message || "Failed to create template" });
    }
  });

  app.patch('/api/templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const template = await storage.getTemplate(req.params.id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.creatorId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updated = await storage.updateTemplate(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete('/api/templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const template = await storage.getTemplate(req.params.id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.creatorId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteTemplate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  app.post('/api/templates/:id/purchase', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const template = await storage.getTemplate(req.params.id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Check if already purchased
      const alreadyPurchased = await storage.hasUserPurchasedTemplate(userId, req.params.id);
      if (alreadyPurchased) {
        return res.status(400).json({ message: "Template already purchased" });
      }
      
      // Calculate fees (20% platform, 80% creator)
      const price = parseFloat(template.price);
      const platformFee = price * 0.2;
      const creatorEarnings = price * 0.8;
      
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId,
          templateId: template.id,
          creatorId: template.creatorId,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error initiating purchase:", error);
      res.status(500).json({ message: "Failed to initiate purchase" });
    }
  });

  app.post('/api/templates/:id/confirm-purchase', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { paymentIntentId } = req.body;
      const template = await storage.getTemplate(req.params.id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not completed" });
      }
      
      // Calculate fees
      const price = parseFloat(template.price);
      const platformFee = price * 0.2;
      const creatorEarnings = price * 0.8;
      
      // Record purchase
      const purchase = await storage.createTemplatePurchase({
        userId,
        templateId: template.id,
        purchasePrice: price.toString(),
        creatorEarnings: creatorEarnings.toString(),
        platformFee: platformFee.toString(),
        stripePaymentIntentId: paymentIntentId,
      });
      
      res.json(purchase);
    } catch (error) {
      console.error("Error confirming purchase:", error);
      res.status(500).json({ message: "Failed to confirm purchase" });
    }
  });

  app.get('/api/my-purchases', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const purchases = await storage.getUserPurchases(userId);
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  // ============================================================================
  // Template variant routes
  // ============================================================================
  
  app.get('/api/templates/:templateId/variants', async (req, res) => {
    try {
      const variants = await storage.getTemplateVariants(req.params.templateId);
      res.json(variants);
    } catch (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ message: "Failed to fetch variants" });
    }
  });
  
  app.post('/api/templates/:templateId/variants', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const template = await storage.getTemplate(req.params.templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.creatorId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Validate request body (excluding templateId from body)
      const validatedData = insertTemplateVariantSchema.omit({ templateId: true }).parse(req.body);
      
      const variant = await storage.createTemplateVariant({
        ...validatedData,
        templateId: req.params.templateId
      });
      
      res.json(variant);
    } catch (error) {
      console.error("Error creating variant:", error);
      res.status(500).json({ message: "Failed to create variant" });
    }
  });
  
  app.delete('/api/templates/:templateId/variants/:variantId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const template = await storage.getTemplate(req.params.templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.creatorId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Verify variant belongs to this template
      const variants = await storage.getTemplateVariants(req.params.templateId);
      const variant = variants.find(v => v.id === req.params.variantId);
      
      if (!variant) {
        return res.status(404).json({ message: "Variant not found or does not belong to this template" });
      }
      
      await storage.deleteTemplateVariant(req.params.variantId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting variant:", error);
      res.status(500).json({ message: "Failed to delete variant" });
    }
  });
  
  // ============================================================================
  // Template control routes
  // ============================================================================
  
  app.get('/api/templates/:templateId/controls', async (req, res) => {
    try {
      const controls = await storage.getTemplateControls(req.params.templateId);
      res.json(controls);
    } catch (error) {
      console.error("Error fetching controls:", error);
      res.status(500).json({ message: "Failed to fetch controls" });
    }
  });
  
  app.post('/api/templates/:templateId/controls', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const template = await storage.getTemplate(req.params.templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.creatorId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Validate request body (excluding templateId from body)
      const validatedData = insertTemplateControlSchema.omit({ templateId: true }).parse(req.body);
      
      const control = await storage.createTemplateControl({
        ...validatedData,
        templateId: req.params.templateId
      });
      
      res.json(control);
    } catch (error) {
      console.error("Error creating control:", error);
      res.status(500).json({ message: "Failed to create control" });
    }
  });
  
  app.delete('/api/templates/:templateId/controls/:controlId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const template = await storage.getTemplate(req.params.templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      if (template.creatorId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Verify control belongs to this template
      const controls = await storage.getTemplateControls(req.params.templateId);
      const control = controls.find(c => c.id === req.params.controlId);
      
      if (!control) {
        return res.status(404).json({ message: "Control not found or does not belong to this template" });
      }
      
      await storage.deleteTemplateControl(req.params.controlId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting control:", error);
      res.status(500).json({ message: "Failed to delete control" });
    }
  });
  
  // ============================================================================
  // Template customization routes
  // ============================================================================
  
  app.get('/api/customizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const customizations = await storage.getUserCustomizations(userId);
      res.json(customizations);
    } catch (error) {
      console.error("Error fetching customizations:", error);
      res.status(500).json({ message: "Failed to fetch customizations" });
    }
  });
  
  app.get('/api/templates/:templateId/customizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const customizations = await storage.getTemplateCustomizations(userId, req.params.templateId);
      res.json(customizations);
    } catch (error) {
      console.error("Error fetching template customizations:", error);
      res.status(500).json({ message: "Failed to fetch customizations" });
    }
  });
  
  app.post('/api/customizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body (excluding userId from body)
      const validatedData = insertTemplateCustomizationSchema.omit({ userId: true }).parse(req.body);
      
      const customization = await storage.createTemplateCustomization({
        ...validatedData,
        userId
      });
      res.json(customization);
    } catch (error) {
      console.error("Error creating customization:", error);
      res.status(500).json({ message: "Failed to create customization" });
    }
  });
  
  app.patch('/api/customizations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // First, get the customization to check ownership
      const customizations = await storage.getUserCustomizations(userId);
      const existing = customizations.find(c => c.id === req.params.id);
      
      if (!existing) {
        return res.status(404).json({ message: "Customization not found or not authorized" });
      }
      
      const customization = await storage.updateTemplateCustomization(req.params.id, req.body);
      res.json(customization);
    } catch (error) {
      console.error("Error updating customization:", error);
      res.status(500).json({ message: "Failed to update customization" });
    }
  });
  
  app.delete('/api/customizations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Verify ownership before deletion
      const customizations = await storage.getUserCustomizations(userId);
      const existing = customizations.find(c => c.id === req.params.id);
      
      if (!existing) {
        return res.status(404).json({ message: "Customization not found or not authorized" });
      }
      
      await storage.deleteTemplateCustomization(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting customization:", error);
      res.status(500).json({ message: "Failed to delete customization" });
    }
  });
  
  // ============================================================================
  // Template bundle routes
  // ============================================================================
  
  app.get('/api/bundles', async (req, res) => {
    try {
      const bundles = await storage.getTemplateBundles();
      res.json(bundles);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      res.status(500).json({ message: "Failed to fetch bundles" });
    }
  });
  
  app.post('/api/bundles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getSubscription(userId);
      
      if (!subscription || subscription.tier === 'free') {
        return res.status(403).json({ message: "Pro or Enterprise subscription required to create bundles" });
      }
      
      // Validate request body (excluding creatorId from body)
      const validatedData = insertTemplateBundleSchema.omit({ creatorId: true }).parse(req.body);
      
      const bundle = await storage.createTemplateBundle({
        ...validatedData,
        creatorId: userId
      });
      
      res.json(bundle);
    } catch (error) {
      console.error("Error creating bundle:", error);
      res.status(500).json({ message: "Failed to create bundle" });
    }
  });
  
  app.patch('/api/bundles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const bundle = await storage.updateTemplateBundle(req.params.id, req.body);
      res.json(bundle);
    } catch (error) {
      console.error("Error updating bundle:", error);
      res.status(500).json({ message: "Failed to update bundle" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
