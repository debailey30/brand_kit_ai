import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Subscription tiers and management
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: varchar("tier", { enum: ["free", "pro", "enterprise"] }).notNull().default("free"),
  status: varchar("status", { enum: ["active", "canceled", "past_due", "incomplete"] }).notNull().default("active"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  generationsUsed: integer("generations_used").notNull().default(0),
  generationsLimit: integer("generations_limit").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Brand kits
export const brandKits = pgTable("brand_kits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  colors: text("colors").array().notNull(),
  tags: text("tags").array().notNull(),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBrandKitSchema = createInsertSchema(brandKits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBrandKit = z.infer<typeof insertBrandKitSchema>;
export type BrandKit = typeof brandKits.$inferSelect;

// Brand kit assets (uploaded files)
export const brandKitAssets = pgTable("brand_kit_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandKitId: varchar("brand_kit_id").notNull().references(() => brandKits.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileType: varchar("file_type", { enum: ["image", "font", "document", "other"] }).notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBrandKitAssetSchema = createInsertSchema(brandKitAssets).omit({
  id: true,
  createdAt: true,
});

export type InsertBrandKitAsset = z.infer<typeof insertBrandKitAssetSchema>;
export type BrandKitAsset = typeof brandKitAssets.$inferSelect;

// AI Generations
export const generations = pgTable("generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  brandKitId: varchar("brand_kit_id").references(() => brandKits.id, { onDelete: "set null" }),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url").notNull(),
  aspectRatio: varchar("aspect_ratio", { enum: ["1:1", "16:9", "9:16", "4:3", "3:4"] }).notNull(),
  style: text("style").notNull(),
  quality: integer("quality").notNull(),
  hasWatermark: boolean("has_watermark").notNull().default(true),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGenerationSchema = createInsertSchema(generations).omit({
  id: true,
  createdAt: true,
});

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;

// Templates for marketplace
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  previewUrl: text("preview_url").notNull(),
  fileUrl: text("file_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { enum: ["logo", "social-media", "business-card", "letterhead", "presentation", "ad-banner", "email-template", "web-hero", "brand-kit", "other"] }).notNull(),
  useCase: text("use_case"),
  industries: text("industries").array().default(sql`'{}'::text[]`),
  styleTags: text("style_tags").array().default(sql`'{}'::text[]`),
  aiPromptSeed: text("ai_prompt_seed"),
  defaultPalette: jsonb("default_palette"),
  fontStack: jsonb("font_stack"),
  canvasWidth: integer("canvas_width"),
  canvasHeight: integer("canvas_height"),
  isPremium: boolean("is_premium").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  salesCount: integer("sales_count").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  salesCount: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Template purchases
export const templatePurchases = pgTable("template_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  creatorEarnings: decimal("creator_earnings", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

export const insertTemplatePurchaseSchema = createInsertSchema(templatePurchases).omit({
  id: true,
  purchasedAt: true,
});

export type InsertTemplatePurchase = z.infer<typeof insertTemplatePurchaseSchema>;
export type TemplatePurchase = typeof templatePurchases.$inferSelect;

// Template variants (different sizes/formats for each template)
export const templateVariants = pgTable("template_variants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  formatSlug: varchar("format_slug").notNull(),
  name: text("name").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  orientation: varchar("orientation", { enum: ["portrait", "landscape", "square"] }).notNull(),
  exportFormats: text("export_formats").array().default(sql`'{}'::text[]`),
  recommendedUsage: text("recommended_usage"),
  previewUrl: text("preview_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateVariantSchema = createInsertSchema(templateVariants).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplateVariant = z.infer<typeof insertTemplateVariantSchema>;
export type TemplateVariant = typeof templateVariants.$inferSelect;

// Template customization controls (color pickers, font selectors, etc.)
export const templateControls = pgTable("template_controls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  controlType: varchar("control_type", { enum: ["color", "font", "text", "number", "select", "toggle"] }).notNull(),
  key: varchar("key").notNull(),
  label: text("label").notNull(),
  defaultValue: text("default_value"),
  options: jsonb("options"),
  minValue: integer("min_value"),
  maxValue: integer("max_value"),
  required: boolean("required").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateControlSchema = createInsertSchema(templateControls).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplateControl = z.infer<typeof insertTemplateControlSchema>;
export type TemplateControl = typeof templateControls.$inferSelect;

// User template customizations (saved configurations)
export const templateCustomizations = pgTable("template_customizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  variantId: varchar("variant_id").references(() => templateVariants.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  configuration: jsonb("configuration").notNull(),
  brandKitId: varchar("brand_kit_id").references(() => brandKits.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTemplateCustomizationSchema = createInsertSchema(templateCustomizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplateCustomization = z.infer<typeof insertTemplateCustomizationSchema>;
export type TemplateCustomization = typeof templateCustomizations.$inferSelect;

// Template bundles (multi-template packages)
export const templateBundles = pgTable("template_bundles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  previewUrl: text("preview_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  templateIds: text("template_ids").array().notNull(),
  isPremium: boolean("is_premium").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  salesCount: integer("sales_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTemplateBundleSchema = createInsertSchema(templateBundles).omit({
  id: true,
  salesCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplateBundle = z.infer<typeof insertTemplateBundleSchema>;
export type TemplateBundle = typeof templateBundles.$inferSelect;
