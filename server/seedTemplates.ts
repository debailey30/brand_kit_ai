import { storage } from "./storage";

// This script seeds the database with sample templates, variants, and controls
// Run with: tsx server/seedTemplates.ts

async function seedTemplates() {
  console.log("Starting template seeding...");
  
  // Get first user (or create a default seller account)
  const users = await storage.getTemplates({ isActive: true });
  
  // For demo purposes, we'll use a hardcoded user ID
  // In production, you'd want actual seller accounts
  const sellerId = "demo-seller-001";
  
  try {
    // 1. Modern Tech Logo Template
    const techLogo = await storage.createTemplate({
      creatorId: sellerId,
      name: "Modern Tech Startup Logo",
      description: "Clean, minimalist logo perfect for tech startups and SaaS companies. Includes multiple color schemes and layout variations.",
      previewUrl: "https://placeholder.com/tech-logo-preview.png",
      fileUrl: "https://placeholder.com/tech-logo-template.ai",
      price: "29.99",
      category: "logo",
      useCase: "Brand identity for technology companies",
      industries: ["technology", "software", "saas", "fintech"],
      styleTags: ["modern", "minimalist", "clean", "professional"],
      aiPromptSeed: "modern minimalist tech company logo with geometric shapes, clean lines, professional",
      defaultPalette: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#ec4899",
        neutral: "#64748b"
      },
      fontStack: {
        heading: "Inter",
        body: "Inter",
        accent: "Space Grotesk"
      },
      canvasWidth: 1000,
      canvasHeight: 1000,
      isPremium: false,
      isActive: true
    });
    
    // Add variants for tech logo
    await storage.createTemplateVariant({
      templateId: techLogo.id,
      formatSlug: "square",
      name: "Square (Social Media)",
      width: 1080,
      height: 1080,
      orientation: "square",
      exportFormats: ["png", "svg", "jpg"],
      recommendedUsage: "Instagram, Facebook profile, app icons",
      previewUrl: "https://placeholder.com/tech-logo-square.png"
    });
    
    await storage.createTemplateVariant({
      templateId: techLogo.id,
      formatSlug: "horizontal",
      name: "Horizontal (Website)",
      width: 1920,
      height: 600,
      orientation: "landscape",
      exportFormats: ["png", "svg"],
      recommendedUsage: "Website headers, email signatures",
      previewUrl: "https://placeholder.com/tech-logo-horizontal.png"
    });
    
    // Add customization controls
    await storage.createTemplateControl({
      templateId: techLogo.id,
      controlType: "color",
      key: "primaryColor",
      label: "Primary Brand Color",
      defaultValue: "#6366f1",
      required: true,
      sortOrder: 1
    });
    
    await storage.createTemplateControl({
      templateId: techLogo.id,
      controlType: "font",
      key: "logoFont",
      label: "Logo Font",
      defaultValue: "Inter",
      options: { fonts: ["Inter", "Poppins", "Space Grotesk", "Outfit", "Manrope"] },
      required: true,
      sortOrder: 2
    });
    
    await storage.createTemplateControl({
      templateId: techLogo.id,
      controlType: "select",
      key: "style",
      label: "Logo Style",
      defaultValue: "minimal",
      options: { choices: ["minimal", "bold", "gradient", "outlined"] },
      required: true,
      sortOrder: 3
    });
    
    console.log("✓ Created Tech Logo template with variants and controls");
    
    // 2. Social Media Pack Template
    const socialPack = await storage.createTemplate({
      creatorId: sellerId,
      name: "Instagram Story & Post Pack",
      description: "Complete social media template pack with Instagram stories, posts, and carousel designs. Perfect for consistent brand presence.",
      previewUrl: "https://placeholder.com/social-pack-preview.png",
      fileUrl: "https://placeholder.com/social-pack-template.psd",
      price: "49.99",
      category: "social-media",
      useCase: "Social media content creation",
      industries: ["marketing", "ecommerce", "lifestyle", "fashion"],
      styleTags: ["trendy", "colorful", "engaging", "modern"],
      aiPromptSeed: "vibrant social media post design with bold typography, modern layout, eye-catching",
      defaultPalette: {
        primary: "#ec4899",
        secondary: "#f59e0b",
        accent: "#8b5cf6",
        neutral: "#f3f4f6"
      },
      fontStack: {
        heading: "Poppins",
        body: "Inter",
        accent: "Bebas Neue"
      },
      canvasWidth: 1080,
      canvasHeight: 1920,
      isPremium: true,
      isActive: true
    });
    
    // Add variants
    await storage.createTemplateVariant({
      templateId: socialPack.id,
      formatSlug: "story",
      name: "Instagram Story",
      width: 1080,
      height: 1920,
      orientation: "portrait",
      exportFormats: ["png", "jpg"],
      recommendedUsage: "Instagram Stories, Facebook Stories",
      previewUrl: "https://placeholder.com/social-story.png"
    });
    
    await storage.createTemplateVariant({
      templateId: socialPack.id,
      formatSlug: "post",
      name: "Instagram Post",
      width: 1080,
      height: 1080,
      orientation: "square",
      exportFormats: ["png", "jpg"],
      recommendedUsage: "Instagram Feed, Facebook Feed",
      previewUrl: "https://placeholder.com/social-post.png"
    });
    
    await storage.createTemplateVariant({
      templateId: socialPack.id,
      formatSlug: "carousel",
      name: "Carousel Slide",
      width: 1080,
      height: 1350,
      orientation: "portrait",
      exportFormats: ["png", "jpg"],
      recommendedUsage: "Instagram Carousel Posts",
      previewUrl: "https://placeholder.com/social-carousel.png"
    });
    
    // Controls
    await storage.createTemplateControl({
      templateId: socialPack.id,
      controlType: "color",
      key: "accentColor",
      label: "Accent Color",
      defaultValue: "#ec4899",
      required: true,
      sortOrder: 1
    });
    
    await storage.createTemplateControl({
      templateId: socialPack.id,
      controlType: "text",
      key: "headline",
      label: "Headline Text",
      defaultValue: "Your Headline Here",
      required: true,
      sortOrder: 2
    });
    
    await storage.createTemplateControl({
      templateId: socialPack.id,
      controlType: "toggle",
      key: "showLogo",
      label: "Show Logo",
      defaultValue: "true",
      required: false,
      sortOrder: 3
    });
    
    console.log("✓ Created Social Media Pack template");
    
    // 3. Business Card Template
    const businessCard = await storage.createTemplate({
      creatorId: sellerId,
      name: "Executive Business Card",
      description: "Professional business card design with front and back layouts. Includes QR code placement and minimalist styling.",
      previewUrl: "https://placeholder.com/business-card-preview.png",
      fileUrl: "https://placeholder.com/business-card-template.ai",
      price: "19.99",
      category: "business-card",
      useCase: "Professional networking and brand identity",
      industries: ["corporate", "consulting", "finance", "real-estate"],
      styleTags: ["professional", "minimal", "elegant", "corporate"],
      aiPromptSeed: "elegant minimalist business card design, professional layout, clean typography",
      defaultPalette: {
        primary: "#1e293b",
        secondary: "#64748b",
        accent: "#3b82f6",
        neutral: "#ffffff"
      },
      fontStack: {
        heading: "Playfair Display",
        body: "Inter",
        accent: "Inter"
      },
      canvasWidth: 3.5 * 300,
      canvasHeight: 2 * 300,
      isPremium: false,
      isActive: true
    });
    
    await storage.createTemplateVariant({
      templateId: businessCard.id,
      formatSlug: "standard",
      name: "Standard (3.5\" x 2\")",
      width: 1050,
      height: 600,
      orientation: "landscape",
      exportFormats: ["pdf", "png"],
      recommendedUsage: "Standard US business card size",
      previewUrl: "https://placeholder.com/card-standard.png"
    });
    
    await storage.createTemplateControl({
      templateId: businessCard.id,
      controlType: "text",
      key: "name",
      label: "Name",
      defaultValue: "John Doe",
      required: true,
      sortOrder: 1
    });
    
    await storage.createTemplateControl({
      templateId: businessCard.id,
      controlType: "text",
      key: "title",
      label: "Job Title",
      defaultValue: "CEO & Founder",
      required: true,
      sortOrder: 2
    });
    
    await storage.createTemplateControl({
      templateId: businessCard.id,
      controlType: "color",
      key: "brandColor",
      label: "Brand Color",
      defaultValue: "#3b82f6",
      required: true,
      sortOrder: 3
    });
    
    console.log("✓ Created Business Card template");
    
    // 4. Ad Banner Template
    const adBanner = await storage.createTemplate({
      creatorId: sellerId,
      name: "Digital Ad Banner Set",
      description: "Complete set of web ad banners in all standard sizes. Optimized for Google Ads and display advertising.",
      previewUrl: "https://placeholder.com/ad-banner-preview.png",
      fileUrl: "https://placeholder.com/ad-banner-template.psd",
      price: "39.99",
      category: "ad-banner",
      useCase: "Digital advertising campaigns",
      industries: ["ecommerce", "saas", "retail", "marketing"],
      styleTags: ["bold", "promotional", "attention-grabbing", "conversion-focused"],
      aiPromptSeed: "eye-catching digital ad banner design, bold call-to-action, professional marketing",
      defaultPalette: {
        primary: "#ef4444",
        secondary: "#fbbf24",
        accent: "#10b981",
        neutral: "#ffffff"
      },
      fontStack: {
        heading: "Montserrat",
        body: "Inter",
        accent: "Montserrat"
      },
      canvasWidth: 728,
      canvasHeight: 90,
      isPremium: true,
      isActive: true
    });
    
    await storage.createTemplateVariant({
      templateId: adBanner.id,
      formatSlug: "leaderboard",
      name: "Leaderboard (728x90)",
      width: 728,
      height: 90,
      orientation: "landscape",
      exportFormats: ["png", "jpg", "gif"],
      recommendedUsage: "Top of webpage, header ads",
      previewUrl: "https://placeholder.com/banner-leaderboard.png"
    });
    
    await storage.createTemplateVariant({
      templateId: adBanner.id,
      formatSlug: "medium-rectangle",
      name: "Medium Rectangle (300x250)",
      width: 300,
      height: 250,
      orientation: "landscape",
      exportFormats: ["png", "jpg", "gif"],
      recommendedUsage: "Sidebar ads, content ads",
      previewUrl: "https://placeholder.com/banner-rectangle.png"
    });
    
    await storage.createTemplateVariant({
      templateId: adBanner.id,
      formatSlug: "skyscraper",
      name: "Wide Skyscraper (160x600)",
      width: 160,
      height: 600,
      orientation: "portrait",
      exportFormats: ["png", "jpg", "gif"],
      recommendedUsage: "Sidebar, vertical ads",
      previewUrl: "https://placeholder.com/banner-skyscraper.png"
    });
    
    await storage.createTemplateControl({
      templateId: adBanner.id,
      controlType: "text",
      key: "ctaText",
      label: "Call to Action",
      defaultValue: "Shop Now",
      required: true,
      sortOrder: 1
    });
    
    await storage.createTemplateControl({
      templateId: adBanner.id,
      controlType: "color",
      key: "ctaColor",
      label: "CTA Button Color",
      defaultValue: "#ef4444",
      required: true,
      sortOrder: 2
    });
    
    console.log("✓ Created Ad Banner template");
    
    // 5. Presentation Template
    const presentation = await storage.createTemplate({
      creatorId: sellerId,
      name: "Pitch Deck Presentation",
      description: "Professional pitch deck template with 15+ slide layouts. Perfect for startups and business presentations.",
      previewUrl: "https://placeholder.com/presentation-preview.png",
      fileUrl: "https://placeholder.com/presentation-template.pptx",
      price: "59.99",
      category: "presentation",
      useCase: "Business presentations and pitch decks",
      industries: ["startup", "business", "consulting", "technology"],
      styleTags: ["professional", "modern", "corporate", "clean"],
      aiPromptSeed: "professional presentation slide design, modern corporate aesthetic, clean data visualization",
      defaultPalette: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#f59e0b",
        neutral: "#f8fafc"
      },
      fontStack: {
        heading: "Outfit",
        body: "Inter",
        accent: "Outfit"
      },
      canvasWidth: 1920,
      canvasHeight: 1080,
      isPremium: true,
      isActive: true
    });
    
    await storage.createTemplateVariant({
      templateId: presentation.id,
      formatSlug: "widescreen",
      name: "Widescreen 16:9",
      width: 1920,
      height: 1080,
      orientation: "landscape",
      exportFormats: ["pptx", "pdf", "png"],
      recommendedUsage: "Modern displays, online presentations",
      previewUrl: "https://placeholder.com/presentation-16-9.png"
    });
    
    await storage.createTemplateControl({
      templateId: presentation.id,
      controlType: "color",
      key: "themeColor",
      label: "Theme Color",
      defaultValue: "#2563eb",
      required: true,
      sortOrder: 1
    });
    
    await storage.createTemplateControl({
      templateId: presentation.id,
      controlType: "font",
      key: "headingFont",
      label: "Heading Font",
      defaultValue: "Outfit",
      options: { fonts: ["Outfit", "Montserrat", "Raleway", "Playfair Display"] },
      required: true,
      sortOrder: 2
    });
    
    console.log("✓ Created Presentation template");
    
    // Create a bundle with multiple templates
    const starterBundle = await storage.createTemplateBundle({
      creatorId: sellerId,
      name: "Startup Brand Essentials",
      description: "Complete branding package for startups: logo, business cards, social media templates, and pitch deck. Save 30% vs individual purchase!",
      previewUrl: "https://placeholder.com/starter-bundle-preview.png",
      price: "129.99",
      discount: "30.00",
      templateIds: [techLogo.id, businessCard.id, socialPack.id, presentation.id],
      isPremium: true,
      isActive: true
    });
    
    console.log("✓ Created Startup Bundle");
    
    console.log("\n✅ Template seeding completed successfully!");
    console.log(`Created 5 templates with multiple variants and customization controls`);
    console.log(`Created 1 bundle with 4 templates`);
    
  } catch (error) {
    console.error("Error seeding templates:", error);
    throw error;
  }
}

// Run the seed function
seedTemplates()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
