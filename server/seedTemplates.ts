import { storage } from "./storage";

// This script seeds the database with sample templates, variants, and controls
// Run with: tsx server/seedTemplates.ts

async function seedTemplates() {
  console.log("Starting template seeding...");
  
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
      thumbnail: "https://placeholder.com/tech-logo-thumb.png",
      price: 29.99,
      category: "logo",
      tags: JSON.stringify(["logo", "branding", "startup", "tech"]),
      useCase: "Brand identity for technology companies",
      industries: JSON.stringify(["technology", "software", "saas", "fintech"]),
      styleTags: JSON.stringify(["modern", "minimalist", "clean", "professional"]),
      aiPromptSeed: "modern minimalist tech company logo with geometric shapes, clean lines, professional",
      defaultPalette: JSON.stringify({
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#ec4899",
        neutral: "#64748b"
      }),
      fontStack: JSON.stringify({
        heading: "Inter",
        body: "Inter",
        accent: "Space Grotesk"
      }),
      canvasWidth: 1000,
      canvasHeight: 1000,
      isPremium: 0,
      isActive: 1
    });
    
    // Add variants for tech logo
    await storage.createTemplateVariant({
      templateId: techLogo.id,
      formatSlug: "square",
      formatName: "Square (Social Media)",
      width: 1080,
      height: 1080,
      fileUrl: "https://placeholder.com/tech-logo-square-file.ai",
      previewUrl: "https://placeholder.com/tech-logo-square.png"
    });
    
    await storage.createTemplateVariant({
      templateId: techLogo.id,
      formatSlug: "horizontal",
      formatName: "Horizontal (Website)",
      width: 1920,
      height: 600,
      fileUrl: "https://placeholder.com/tech-logo-horizontal-file.ai",
      previewUrl: "https://placeholder.com/tech-logo-horizontal.png"
    });
    
    // Add customization controls
    await storage.createTemplateControl({
      templateId: techLogo.id,
      controlType: "color",
      label: "Primary Brand Color",
      defaultValue: "#6366f1",
      required: 1,
      orderIndex: 1
    });
    
    await storage.createTemplateControl({
      templateId: techLogo.id,
      controlType: "font",
      label: "Logo Font",
      defaultValue: "Inter",
      options: JSON.stringify({ fonts: ["Inter", "Poppins", "Space Grotesk", "Outfit", "Manrope"] }),
      required: 1,
      orderIndex: 2
    });
    
    await storage.createTemplateControl({
      templateId: techLogo.id,
      controlType: "text",
      label: "Logo Style",
      defaultValue: "minimal",
      options: JSON.stringify({ choices: ["minimal", "bold", "gradient", "outlined"] }),
      required: 1,
      orderIndex: 3
    });
    
    console.log("✓ Created Tech Logo template with variants and controls");
    
    // 2. Social Media Pack Template
    const socialPack = await storage.createTemplate({
      creatorId: sellerId,
      name: "Instagram Story & Post Pack",
      description: "Complete social media template pack with Instagram stories, posts, and carousel designs. Perfect for consistent brand presence.",
      thumbnail: "https://placeholder.com/template-thumb.png",
      previewUrl: "https://placeholder.com/social-pack-preview.png",
      fileUrl: "https://placeholder.com/social-pack-template.psd",
      price: 49.99,
      tags: JSON.stringify(["template", "design"]),
      category: "social-media",
      useCase: "Social media content creation",
      industries: JSON.stringify(["marketing", "ecommerce", "lifestyle", "fashion"]),
      styleTags: JSON.stringify(["trendy", "colorful", "engaging", "modern"]),
      aiPromptSeed: "vibrant social media post design with bold typography, modern layout, eye-catching",
      defaultPalette: JSON.stringify({
        primary: "#ec4899",
        secondary: "#f59e0b",
        accent: "#8b5cf6",
        neutral: "#f3f4f6"
      }),
      fontStack: JSON.stringify({
        heading: "Poppins",
        body: "Inter",
        accent: "Bebas Neue"
      }),
      canvasWidth: 1080,
      canvasHeight: 1920,
      isPremium: 1,
      isActive: 1
    });
    
    // Add variants
    await storage.createTemplateVariant({
      templateId: socialPack.id,
      formatSlug: "story",
      formatName: "Story",      width: 1080,
      height: 1920,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/social-story.png"
    });
    
    await storage.createTemplateVariant({
      templateId: socialPack.id,
      formatSlug: "post",
      formatName: "Post",      width: 1080,
      height: 1080,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/social-post.png"
    });
    
    await storage.createTemplateVariant({
      templateId: socialPack.id,
      formatSlug: "carousel",
      formatName: "Carousel",      width: 1080,
      height: 1350,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/social-carousel.png"
    });
    
    // Controls
    await storage.createTemplateControl({
      templateId: socialPack.id,
      controlType: "color",
      label: "Accent Color",
      defaultValue: "#ec4899",
      required: 1,
      orderIndex: 1
    });
    
    await storage.createTemplateControl({
      templateId: socialPack.id,
      controlType: "text",
      label: "Headline Text",
      defaultValue: "Your Headline Here",
      required: 1,
      orderIndex: 2
    });
    
    await storage.createTemplateControl({
      templateId: socialPack.id,
      controlType: "text",
      label: "Show Logo",
      defaultValue: "true",
      required: 0,
      orderIndex: 3
    });
    
    console.log("✓ Created Social Media Pack template");
    
    // 3. Business Card Template
    const businessCard = await storage.createTemplate({
      creatorId: sellerId,
      name: "Executive Business Card",
      description: "Professional business card design with front and back layouts. Includes QR code placement and minimalist styling.",
      thumbnail: "https://placeholder.com/template-thumb.png",
      previewUrl: "https://placeholder.com/business-card-preview.png",
      fileUrl: "https://placeholder.com/business-card-template.ai",
      price: 19.99,
      tags: JSON.stringify(["template", "design"]),
      category: "business-card",
      useCase: "Professional networking and brand identity",
      industries: JSON.stringify(["corporate", "consulting", "finance", "real-estate"]),
      styleTags: JSON.stringify(["professional", "minimal", "elegant", "corporate"]),
      aiPromptSeed: "elegant minimalist business card design, professional layout, clean typography",
      defaultPalette: JSON.stringify({
        primary: "#1e293b",
        secondary: "#64748b",
        accent: "#3b82f6",
        neutral: "#ffffff"
      }),
      fontStack: JSON.stringify({
        heading: "Playfair Display",
        body: "Inter",
        accent: "Inter"
      }),
      canvasWidth: 3.5 * 300,
      canvasHeight: 2 * 300,
      isPremium: 0,
      isActive: 1
    });
    
    await storage.createTemplateVariant({
      templateId: businessCard.id,
      formatSlug: "standard",
      formatName: "Standard",      width: 1050,
      height: 600,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/card-standard.png"
    });
    
    await storage.createTemplateControl({
      templateId: businessCard.id,
      controlType: "text",
      label: "Name",
      defaultValue: "John Doe",
      required: 1,
      orderIndex: 1
    });
    
    await storage.createTemplateControl({
      templateId: businessCard.id,
      controlType: "text",
      label: "Job Title",
      defaultValue: "CEO & Founder",
      required: 1,
      orderIndex: 2
    });
    
    await storage.createTemplateControl({
      templateId: businessCard.id,
      controlType: "color",
      label: "Brand Color",
      defaultValue: "#3b82f6",
      required: 1,
      orderIndex: 3
    });
    
    console.log("✓ Created Business Card template");
    
    // 4. Ad Banner Template
    const adBanner = await storage.createTemplate({
      creatorId: sellerId,
      name: "Digital Ad Banner Set",
      description: "Complete set of web ad banners in all standard sizes. Optimized for Google Ads and display advertising.",
      thumbnail: "https://placeholder.com/template-thumb.png",
      previewUrl: "https://placeholder.com/ad-banner-preview.png",
      fileUrl: "https://placeholder.com/ad-banner-template.psd",
      price: 39.99,
      tags: JSON.stringify(["template", "design"]),
      category: "ad-banner",
      useCase: "Digital advertising campaigns",
      industries: JSON.stringify(["ecommerce", "saas", "retail", "marketing"]),
      styleTags: JSON.stringify(["bold", "promotional", "attention-grabbing", "conversion-focused"]),
      aiPromptSeed: "eye-catching digital ad banner design, bold call-to-action, professional marketing",
      defaultPalette: JSON.stringify({
        primary: "#ef4444",
        secondary: "#fbbf24",
        accent: "#10b981",
        neutral: "#ffffff"
      }),
      fontStack: JSON.stringify({
        heading: "Montserrat",
        body: "Inter",
        accent: "Montserrat"
      }),
      canvasWidth: 728,
      canvasHeight: 90,
      isPremium: 1,
      isActive: 1
    });
    
    await storage.createTemplateVariant({
      templateId: adBanner.id,
      formatSlug: "leaderboard",
      formatName: "Leaderboard",      width: 728,
      height: 90,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/banner-leaderboard.png"
    });
    
    await storage.createTemplateVariant({
      templateId: adBanner.id,
      formatSlug: "medium-rectangle",
      formatName: "Medium Rectangle",      width: 300,
      height: 250,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/banner-rectangle.png"
    });
    
    await storage.createTemplateVariant({
      templateId: adBanner.id,
      formatSlug: "skyscraper",
      formatName: "Skyscraper",      width: 160,
      height: 600,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/banner-skyscraper.png"
    });
    
    await storage.createTemplateControl({
      templateId: adBanner.id,
      controlType: "text",
      label: "Call to Action",
      defaultValue: "Shop Now",
      required: 1,
      orderIndex: 1
    });
    
    await storage.createTemplateControl({
      templateId: adBanner.id,
      controlType: "color",
      label: "CTA Button Color",
      defaultValue: "#ef4444",
      required: 1,
      orderIndex: 2
    });
    
    console.log("✓ Created Ad Banner template");
    
    // 5. Presentation Template
    const presentation = await storage.createTemplate({
      creatorId: sellerId,
      name: "Pitch Deck Presentation",
      description: "Professional pitch deck template with 15+ slide layouts. Perfect for startups and business presentations.",
      thumbnail: "https://placeholder.com/template-thumb.png",
      previewUrl: "https://placeholder.com/presentation-preview.png",
      fileUrl: "https://placeholder.com/presentation-template.pptx",
      price: 59.99,
      tags: JSON.stringify(["template", "design"]),
      category: "presentation",
      useCase: "Business presentations and pitch decks",
      industries: JSON.stringify(["startup", "business", "consulting", "technology"]),
      styleTags: JSON.stringify(["professional", "modern", "corporate", "clean"]),
      aiPromptSeed: "professional presentation slide design, modern corporate aesthetic, clean data visualization",
      defaultPalette: JSON.stringify({
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#f59e0b",
        neutral: "#f8fafc"
      }),
      fontStack: JSON.stringify({
        heading: "Outfit",
        body: "Inter",
        accent: "Outfit"
      }),
      canvasWidth: 1920,
      canvasHeight: 1080,
      isPremium: 1,
      isActive: 1
    });
    
    await storage.createTemplateVariant({
      templateId: presentation.id,
      formatSlug: "widescreen",
      formatName: "Widescreen",      width: 1920,
      height: 1080,      fileUrl: "https://placeholder.com/variant-file.ai",
      previewUrl: "https://placeholder.com/presentation-16-9.png"
    });
    
    await storage.createTemplateControl({
      templateId: presentation.id,
      controlType: "color",
      label: "Theme Color",
      defaultValue: "#2563eb",
      required: 1,
      orderIndex: 1
    });
    
    await storage.createTemplateControl({
      templateId: presentation.id,
      controlType: "font",
      label: "Heading Font",
      defaultValue: "Outfit",
      options: JSON.stringify({ fonts: ["Outfit", "Montserrat", "Raleway", "Playfair Display"] }),
      required: 1,
      orderIndex: 2
    });
    
    console.log("✓ Created Presentation template");
    
    // Create a bundle with multiple templates
    const starterBundle = await storage.createTemplateBundle({
      creatorId: sellerId,
      name: "Startup Brand Essentials",
      description: "Complete branding package for startups: logo, business cards, social media templates, and pitch deck. Save 30% vs individual purchase!",
      thumbnail: "https://placeholder.com/starter-bundle-preview.png",
      price: 129.99,
      originalPrice: 185.00,
      discountPercentage: 30,
      isActive: 1
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
