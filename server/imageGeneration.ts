import OpenAI from "openai";
import { storage } from "./storage";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export interface GenerateImageOptions {
  prompt: string;
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  style: string;
  quality: number;
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
  
  // Build enhanced prompt with style
  const enhancedPrompt = `${options.prompt}. Style: ${options.style}. High quality, professional, detailed.`;
  
  // Generate image using OpenAI
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
  
  const base64Image = response.data[0].b64_json;
  
  if (!base64Image) {
    throw new Error("Failed to generate image");
  }
  
  // Increment usage counter
  await storage.incrementGenerationsUsed(userId);
  
  return base64Image;
}
