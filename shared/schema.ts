import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: integer("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = Omit<InsertUser, 'email'> & { id: string; email: string };

// User subscriptions
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: text("tier", { enum: ["free", "pro", "enterprise"] }).notNull().default("free"),
  status: text("status", { enum: ["active", "canceled", "past_due", "incomplete"] }).notNull().default("active"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodEnd: integer("current_period_end"),
  cancelAtPeriodEnd: integer("cancel_at_period_end").default(0),
  generationsUsed: integer("generations_used").notNull().default(0),
  generationsLimit: integer("generations_limit").notNull().default(5),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Brand kits
export const brandKits = sqliteTable("brand_kits", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  colors: text("colors").notNull(),
  tags: text("tags").notNull(),
  thumbnail: text("thumbnail"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const insertBrandKitSchema = createInsertSchema(brandKits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBrandKit = z.infer<typeof insertBrandKitSchema>;
export type BrandKit = typeof brandKits.$inferSelect;

// Brand kit assets
export const brandKitAssets = sqliteTable("brand_kit_assets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandKitId: text("brand_kit_id").notNull().references(() => brandKits.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

export const insertBrandKitAssetSchema = createInsertSchema(brandKitAssets).omit({
  id: true,
  createdAt: true,
});

export type InsertBrandKitAsset = z.infer<typeof insertBrandKitAssetSchema>;
export type BrandKitAsset = typeof brandKitAssets.$inferSelect;

// AI-generated images
export const generations = sqliteTable("generations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  brandKitId: text("brand_kit_id").references(() => brandKits.id, { onDelete: "set null" }),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url").notNull(),
  aspectRatio: text("aspect_ratio", { enum: ["1:1", "16:9", "9:16", "4:3", "3:4"] }).notNull(),
  style: text("style").notNull(),
  quality: integer("quality").notNull(),
  hasWatermark: integer("has_watermark").notNull().default(1),
  isFavorite: integer("is_favorite").notNull().default(0),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

export const insertGenerationSchema = createInsertSchema(generations).omit({
  id: true,
  createdAt: true,
});

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;

// Templates
export const templates = sqliteTable("templates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  creatorId: text("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tags: text("tags").notNull(),
  industries: text("industries").notNull(),
  styleTags: text("style_tags").notNull(),
  thumbnail: text("thumbnail").notNull(),
  previewUrl: text("preview_url").notNull(),
  fileUrl: text("file_url").notNull(),
  price: real("price").notNull(),
  useCase: text("use_case"),
  aiPromptSeed: text("ai_prompt_seed"),
  defaultPalette: text("default_palette"),
  fontStack: text("font_stack"),
  canvasWidth: integer("canvas_width"),
  canvasHeight: integer("canvas_height"),
  isPremium: integer("is_premium").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  downloadCount: integer("download_count").notNull().default(0),
  rating: real("rating").default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  downloadCount: true,
  rating: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

// Template variants
export const templateVariants = sqliteTable("template_variants", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  templateId: text("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  formatSlug: text("format_slug").notNull(),
  formatName: text("format_name").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  fileUrl: text("file_url").notNull(),
  previewUrl: text("preview_url"),
});

export const insertTemplateVariantSchema = createInsertSchema(templateVariants).omit({
  id: true,
});

export type InsertTemplateVariant = z.infer<typeof insertTemplateVariantSchema>;
export type TemplateVariant = typeof templateVariants.$inferSelect;

// Template controls
export const templateControls = sqliteTable("template_controls", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  templateId: text("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  controlType: text("control_type", { enum: ["text", "color", "image", "font"] }).notNull(),
  label: text("label").notNull(),
  defaultValue: text("default_value"),
  options: text("options"),
  required: integer("required").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
});

export const insertTemplateControlSchema = createInsertSchema(templateControls).omit({
  id: true,
});

export type InsertTemplateControl = z.infer<typeof insertTemplateControlSchema>;
export type TemplateControl = typeof templateControls.$inferSelect;

// Template customizations
export const templateCustomizations = sqliteTable("template_customizations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: text("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  customizations: text("customizations").notNull(),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const insertTemplateCustomizationSchema = createInsertSchema(templateCustomizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplateCustomization = z.infer<typeof insertTemplateCustomizationSchema>;
export type TemplateCustomization = typeof templateCustomizations.$inferSelect;

// Template purchases
export const templatePurchases = sqliteTable("template_purchases", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  templateId: text("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  price: real("price").notNull(),
  currency: text("currency").notNull().default("usd"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

export const insertTemplatePurchaseSchema = createInsertSchema(templatePurchases).omit({
  id: true,
  createdAt: true,
});

export type InsertTemplatePurchase = z.infer<typeof insertTemplatePurchaseSchema>;
export type TemplatePurchase = typeof templatePurchases.$inferSelect;

// Template bundles
export const templateBundles = sqliteTable("template_bundles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  creatorId: text("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price").notNull(),
  discountPercentage: integer("discount_percentage").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  downloadCount: integer("download_count").notNull().default(0),
  salesCount: integer("sales_count").notNull().default(0),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const insertTemplateBundleSchema = createInsertSchema(templateBundles).omit({
  id: true,
  salesCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTemplateBundle = z.infer<typeof insertTemplateBundleSchema>;
export type TemplateBundle = typeof templateBundles.$inferSelect;
