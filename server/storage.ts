import {
  users,
  subscriptions,
  brandKits,
  brandKitAssets,
  generations,
  templates,
  templatePurchases,
  templateVariants,
  templateControls,
  templateCustomizations,
  templateBundles,
  type User,
  type UpsertUser,
  type Subscription,
  type InsertSubscription,
  type BrandKit,
  type InsertBrandKit,
  type BrandKitAsset,
  type InsertBrandKitAsset,
  type Generation,
  type InsertGeneration,
  type Template,
  type InsertTemplate,
  type TemplatePurchase,
  type InsertTemplatePurchase,
  type TemplateVariant,
  type InsertTemplateVariant,
  type TemplateControl,
  type InsertTemplateControl,
  type TemplateCustomization,
  type InsertTemplateCustomization,
  type TemplateBundle,
  type InsertTemplateBundle,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, arrayContains } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Subscription operations
  getSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(userId: string, updates: Partial<Subscription>): Promise<Subscription>;
  incrementGenerationsUsed(userId: string): Promise<void>;
  resetMonthlyGenerations(userId: string): Promise<void>;
  
  // Brand kit operations
  getBrandKit(id: string): Promise<BrandKit | undefined>;
  getUserBrandKits(userId: string): Promise<BrandKit[]>;
  createBrandKit(brandKit: InsertBrandKit): Promise<BrandKit>;
  updateBrandKit(id: string, updates: Partial<BrandKit>): Promise<BrandKit>;
  deleteBrandKit(id: string): Promise<void>;
  
  // Brand kit asset operations
  getBrandKitAssets(brandKitId: string): Promise<BrandKitAsset[]>;
  createBrandKitAsset(asset: InsertBrandKitAsset): Promise<BrandKitAsset>;
  deleteBrandKitAsset(id: string): Promise<void>;
  
  // Generation operations
  getGeneration(id: string): Promise<Generation | undefined>;
  getUserGenerations(userId: string, limit?: number): Promise<Generation[]>;
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  toggleGenerationFavorite(id: string): Promise<void>;
  deleteGeneration(id: string): Promise<void>;
  
  // Template operations
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplates(filters?: { category?: string; creatorId?: string; isActive?: boolean; industries?: string[]; styleTags?: string[] }): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template>;
  deleteTemplate(id: string): Promise<void>;
  incrementTemplateSales(id: string): Promise<void>;
  
  // Template purchase operations
  getUserPurchases(userId: string): Promise<TemplatePurchase[]>;
  createTemplatePurchase(purchase: InsertTemplatePurchase): Promise<TemplatePurchase>;
  hasUserPurchasedTemplate(userId: string, templateId: string): Promise<boolean>;
  
  // Template variant operations
  getTemplateVariants(templateId: string): Promise<TemplateVariant[]>;
  createTemplateVariant(variant: InsertTemplateVariant): Promise<TemplateVariant>;
  deleteTemplateVariant(id: string): Promise<void>;
  
  // Template control operations
  getTemplateControls(templateId: string): Promise<TemplateControl[]>;
  createTemplateControl(control: InsertTemplateControl): Promise<TemplateControl>;
  deleteTemplateControl(id: string): Promise<void>;
  
  // Template customization operations
  getUserCustomizations(userId: string): Promise<TemplateCustomization[]>;
  getTemplateCustomizations(userId: string, templateId: string): Promise<TemplateCustomization[]>;
  createTemplateCustomization(customization: InsertTemplateCustomization): Promise<TemplateCustomization>;
  updateTemplateCustomization(id: string, updates: Partial<TemplateCustomization>): Promise<TemplateCustomization>;
  deleteTemplateCustomization(id: string): Promise<void>;
  
  // Template bundle operations
  getTemplateBundles(): Promise<TemplateBundle[]>;
  createTemplateBundle(bundle: InsertTemplateBundle): Promise<TemplateBundle>;
  updateTemplateBundle(id: string, updates: Partial<TemplateBundle>): Promise<TemplateBundle>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Create default free subscription if user is new
    const existingSubscription = await this.getSubscription(user.id);
    if (!existingSubscription) {
      await this.createSubscription({
        userId: user.id,
        tier: "free",
        status: "active",
        generationsUsed: 0,
        generationsLimit: 5,
      });
    }
    
    return user;
  }

  // Subscription operations
  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return subscription;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }

  async updateSubscription(userId: string, updates: Partial<Subscription>): Promise<Subscription> {
    const [updated] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.userId, userId))
      .returning();
    return updated;
  }

  async incrementGenerationsUsed(userId: string): Promise<void> {
    await db
      .update(subscriptions)
      .set({ generationsUsed: sql`${subscriptions.generationsUsed} + 1` })
      .where(eq(subscriptions.userId, userId));
  }

  async resetMonthlyGenerations(userId: string): Promise<void> {
    await db
      .update(subscriptions)
      .set({ generationsUsed: 0 })
      .where(eq(subscriptions.userId, userId));
  }

  // Brand kit operations
  async getBrandKit(id: string): Promise<BrandKit | undefined> {
    const [brandKit] = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.id, id));
    return brandKit;
  }

  async getUserBrandKits(userId: string): Promise<BrandKit[]> {
    return await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.userId, userId))
      .orderBy(desc(brandKits.updatedAt));
  }

  async createBrandKit(brandKit: InsertBrandKit): Promise<BrandKit> {
    const [newBrandKit] = await db
      .insert(brandKits)
      .values(brandKit)
      .returning();
    return newBrandKit;
  }

  async updateBrandKit(id: string, updates: Partial<BrandKit>): Promise<BrandKit> {
    const [updated] = await db
      .update(brandKits)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(brandKits.id, id))
      .returning();
    return updated;
  }

  async deleteBrandKit(id: string): Promise<void> {
    await db.delete(brandKits).where(eq(brandKits.id, id));
  }

  // Brand kit asset operations
  async getBrandKitAssets(brandKitId: string): Promise<BrandKitAsset[]> {
    return await db
      .select()
      .from(brandKitAssets)
      .where(eq(brandKitAssets.brandKitId, brandKitId))
      .orderBy(desc(brandKitAssets.createdAt));
  }

  async createBrandKitAsset(asset: InsertBrandKitAsset): Promise<BrandKitAsset> {
    const [newAsset] = await db
      .insert(brandKitAssets)
      .values(asset)
      .returning();
    return newAsset;
  }

  async deleteBrandKitAsset(id: string): Promise<void> {
    await db.delete(brandKitAssets).where(eq(brandKitAssets.id, id));
  }

  // Generation operations
  async getGeneration(id: string): Promise<Generation | undefined> {
    const [generation] = await db
      .select()
      .from(generations)
      .where(eq(generations.id, id));
    return generation;
  }

  async getUserGenerations(userId: string, limit: number = 100): Promise<Generation[]> {
    return await db
      .select()
      .from(generations)
      .where(eq(generations.userId, userId))
      .orderBy(desc(generations.createdAt))
      .limit(limit);
  }

  async createGeneration(generation: InsertGeneration): Promise<Generation> {
    const [newGeneration] = await db
      .insert(generations)
      .values(generation)
      .returning();
    return newGeneration;
  }

  async toggleGenerationFavorite(id: string): Promise<void> {
    const generation = await this.getGeneration(id);
    if (generation) {
      await db
        .update(generations)
        .set({ isFavorite: !generation.isFavorite })
        .where(eq(generations.id, id));
    }
  }

  async deleteGeneration(id: string): Promise<void> {
    await db.delete(generations).where(eq(generations.id, id));
  }

  // Template operations
  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id));
    return template;
  }

  async getTemplates(filters?: { category?: string; creatorId?: string; isActive?: boolean; industries?: string[]; styleTags?: string[] }): Promise<Template[]> {
    let query = db.select().from(templates);
    
    const conditions = [];
    if (filters?.category) {
      conditions.push(sql`${templates.category} = ${filters.category}`);
    }
    if (filters?.creatorId) {
      conditions.push(eq(templates.creatorId, filters.creatorId));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(templates.isActive, filters.isActive));
    }
    // Filter by industries (array contains check)
    if (filters?.industries && filters.industries.length > 0) {
      for (const industry of filters.industries) {
        conditions.push(sql`${industry} = ANY(${templates.industries})`);
      }
    }
    // Filter by style tags (array contains check)
    if (filters?.styleTags && filters.styleTags.length > 0) {
      for (const tag of filters.styleTags) {
        conditions.push(sql`${tag} = ANY(${templates.styleTags})`);
      }
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(templates.createdAt));
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db
      .insert(templates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template> {
    const [updated] = await db
      .update(templates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updated;
  }

  async deleteTemplate(id: string): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  async incrementTemplateSales(id: string): Promise<void> {
    await db
      .update(templates)
      .set({ salesCount: sql`${templates.salesCount} + 1` })
      .where(eq(templates.id, id));
  }

  // Template purchase operations
  async getUserPurchases(userId: string): Promise<TemplatePurchase[]> {
    return await db
      .select()
      .from(templatePurchases)
      .where(eq(templatePurchases.userId, userId))
      .orderBy(desc(templatePurchases.purchasedAt));
  }

  async createTemplatePurchase(purchase: InsertTemplatePurchase): Promise<TemplatePurchase> {
    const [newPurchase] = await db
      .insert(templatePurchases)
      .values(purchase)
      .returning();
    
    // Increment sales count
    await this.incrementTemplateSales(purchase.templateId);
    
    return newPurchase;
  }

  async hasUserPurchasedTemplate(userId: string, templateId: string): Promise<boolean> {
    const [purchase] = await db
      .select()
      .from(templatePurchases)
      .where(
        and(
          eq(templatePurchases.userId, userId),
          eq(templatePurchases.templateId, templateId)
        )
      );
    return !!purchase;
  }

  // Template variant operations
  async getTemplateVariants(templateId: string): Promise<TemplateVariant[]> {
    return await db
      .select()
      .from(templateVariants)
      .where(eq(templateVariants.templateId, templateId))
      .orderBy(templateVariants.formatSlug);
  }

  async createTemplateVariant(variant: InsertTemplateVariant): Promise<TemplateVariant> {
    const [newVariant] = await db
      .insert(templateVariants)
      .values(variant)
      .returning();
    return newVariant;
  }

  async deleteTemplateVariant(id: string): Promise<void> {
    await db.delete(templateVariants).where(eq(templateVariants.id, id));
  }

  // Template control operations
  async getTemplateControls(templateId: string): Promise<TemplateControl[]> {
    return await db
      .select()
      .from(templateControls)
      .where(eq(templateControls.templateId, templateId))
      .orderBy(templateControls.sortOrder);
  }

  async createTemplateControl(control: InsertTemplateControl): Promise<TemplateControl> {
    const [newControl] = await db
      .insert(templateControls)
      .values(control)
      .returning();
    return newControl;
  }

  async deleteTemplateControl(id: string): Promise<void> {
    await db.delete(templateControls).where(eq(templateControls.id, id));
  }

  // Template customization operations
  async getUserCustomizations(userId: string): Promise<TemplateCustomization[]> {
    return await db
      .select()
      .from(templateCustomizations)
      .where(eq(templateCustomizations.userId, userId))
      .orderBy(desc(templateCustomizations.updatedAt));
  }

  async getTemplateCustomizations(userId: string, templateId: string): Promise<TemplateCustomization[]> {
    return await db
      .select()
      .from(templateCustomizations)
      .where(
        and(
          eq(templateCustomizations.userId, userId),
          eq(templateCustomizations.templateId, templateId)
        )
      )
      .orderBy(desc(templateCustomizations.updatedAt));
  }

  async createTemplateCustomization(customization: InsertTemplateCustomization): Promise<TemplateCustomization> {
    const [newCustomization] = await db
      .insert(templateCustomizations)
      .values(customization)
      .returning();
    return newCustomization;
  }

  async updateTemplateCustomization(id: string, updates: Partial<TemplateCustomization>): Promise<TemplateCustomization> {
    const [updated] = await db
      .update(templateCustomizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(templateCustomizations.id, id))
      .returning();
    return updated;
  }

  async deleteTemplateCustomization(id: string): Promise<void> {
    await db.delete(templateCustomizations).where(eq(templateCustomizations.id, id));
  }

  // Template bundle operations
  async getTemplateBundles(): Promise<TemplateBundle[]> {
    return await db
      .select()
      .from(templateBundles)
      .where(eq(templateBundles.isActive, true))
      .orderBy(desc(templateBundles.createdAt));
  }

  async createTemplateBundle(bundle: InsertTemplateBundle): Promise<TemplateBundle> {
    const [newBundle] = await db
      .insert(templateBundles)
      .values(bundle)
      .returning();
    return newBundle;
  }

  async updateTemplateBundle(id: string, updates: Partial<TemplateBundle>): Promise<TemplateBundle> {
    const [updated] = await db
      .update(templateBundles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(templateBundles.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
