import OpenAI from "openai";
import { storage } from "./storage";
import { localStorageService } from "./localStorage";
import { addWatermark } from "./watermark";

// Use OpenAI API directly
if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY not set - image generation will fail. Please add your OpenAI API key to .env");
  // Don't throw error, allow app to start for demo purposes
}

let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface GenerateImageOptions {
  prompt: string;
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  style: string;
  quality: number;
  templateId?: string;
  variantId?: string;
  customizations?: Record<string, any>;
}

function aspectRatioToSize(aspectRatio: string): "1024x1024" | "1792x1024" | "1024x1792" {
  switch (aspectRatio) {
    case "1:1":
    case "4:3":
    case "3:4":
      return "1024x1024";
    case "16:9":
      return "1792x1024";
    case "9:16":
      return "1024x1792";
    default:
      return "1024x1024";
  }
}

async function buildTemplateEnhancedPrompt(
  basePrompt: string,
  style: string,
  templateId?: string,
  variantId?: string,
  customizations?: Record<string, any>
): Promise<string> {
  // Start with base prompt and style
  let enhancedPrompt = `${basePrompt}. Style: ${style}`;
  
  // If template-based, fetch template metadata and incorporate it
  if (templateId) {
    const template = await storage.getTemplate(templateId);
    if (template) {
      // Add template's AI prompt seed if available
      if (template.aiPromptSeed) {
        enhancedPrompt += `. ${template.aiPromptSeed}`;
      }
      
      // Add use case context
      if (template.useCase) {
        enhancedPrompt += `. Use case: ${template.useCase}`;
      }
      
      // Add style tags
      if (template.styleTags) {
        try {
          const styleTags = JSON.parse(template.styleTags);
          if (Array.isArray(styleTags) && styleTags.length > 0) {
            enhancedPrompt += `. Style attributes: ${styleTags.join(", ")}`;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    
    // Incorporate variant-specific details
    if (variantId) {
      const variant = await storage.getTemplateVariant(variantId);
      if (variant) {
        enhancedPrompt += `. Format: ${variant.formatSlug}`;
      }
    }
    
    // Incorporate customizations
    if (customizations && Object.keys(customizations).length > 0) {
      const customizationDescriptions: string[] = [];
      
      for (const [key, value] of Object.entries(customizations)) {
        if (value !== undefined && value !== null) {
          // Format the customization based on its type
          if (key.includes("color")) {
            customizationDescriptions.push(`${key}: ${value}`);
          } else if (key.includes("font")) {
            customizationDescriptions.push(`using ${value} font`);
          } else if (typeof value === "string" && value.trim()) {
            customizationDescriptions.push(`${key}: "${value}"`);
          } else if (typeof value === "number") {
            customizationDescriptions.push(`${key}: ${value}`);
          } else if (typeof value === "boolean") {
            customizationDescriptions.push(`${key}: ${value ? "enabled" : "disabled"}`);
          }
        }
      }
      
      if (customizationDescriptions.length > 0) {
        enhancedPrompt += `. Customizations: ${customizationDescriptions.join(", ")}`;
      }
    }
  }
  
  // Add general quality directive
  enhancedPrompt += ". High quality, professional, detailed, polished design.";
  
  return enhancedPrompt;
}

export async function generateImage(options: GenerateImageOptions, userId: string): Promise<string> {
  // Check subscription and quota
  const subscription = await storage.getSubscription(userId);
  
  if (!subscription) {
    throw new Error("Subscription not found");
  }
  
  // Check if user has exceeded quota (free tier only)
  if (subscription.tier === "free") {
    if (subscription.generationsUsed >= subscription.generationsLimit) {
      throw new Error("Generation quota exceeded. Please upgrade to Pro for unlimited generations.");
    }
  }
  
  // Build enhanced prompt with template metadata
  const enhancedPrompt = await buildTemplateEnhancedPrompt(
    options.prompt,
    options.style,
    options.templateId,
    options.variantId,
    options.customizations
  );
  
  // Generate image using OpenAI
  if (!openai) {
    throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.");
  }

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: enhancedPrompt,
    n: 1,
    size: aspectRatioToSize(options.aspectRatio),
  });
  
  // Get base64 image data (gpt-image-1 always returns base64)
  if (!response.data || response.data.length === 0) {
    throw new Error("Failed to generate image");
  }
  
  let base64Image = response.data[0].b64_json;
  
  if (!base64Image) {
    throw new Error("Failed to generate image");
  }
  
  // Apply watermark for free tier users
  const hasWatermark = subscription.tier === "free";
  if (hasWatermark) {
    base64Image = addWatermark(base64Image);
  }
  
  // Save to local storage for now (can be upgraded to cloud storage later)
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  const imageUrl = await localStorageService.saveImageToStorage(
    base64Image,
    fileName,
    true // Always public for now
  );
  
  // Increment usage counter
  await storage.incrementGenerationsUsed(userId);
  
  return imageUrl;
}
