CREATE TABLE `brand_kit_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_kit_id` text NOT NULL,
	`filename` text NOT NULL,
	`original_filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`url` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`brand_kit_id`) REFERENCES `brand_kits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `brand_kits` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`colors` text NOT NULL,
	`tags` text NOT NULL,
	`thumbnail` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `generations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`brand_kit_id` text,
	`prompt` text NOT NULL,
	`image_url` text NOT NULL,
	`aspect_ratio` text NOT NULL,
	`style` text NOT NULL,
	`quality` integer NOT NULL,
	`has_watermark` integer DEFAULT 1 NOT NULL,
	`is_favorite` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`brand_kit_id`) REFERENCES `brand_kits`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` text PRIMARY KEY NOT NULL,
	`sess` text NOT NULL,
	`expire` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `IDX_session_expire` ON `sessions` (`expire`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tier` text DEFAULT 'free' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`stripe_customer_id` text,
	`stripe_subscription_id` text,
	`current_period_end` integer,
	`cancel_at_period_end` integer DEFAULT 0,
	`generations_used` integer DEFAULT 0 NOT NULL,
	`generations_limit` integer DEFAULT 5 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template_bundles` (
	`id` text PRIMARY KEY NOT NULL,
	`creator_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail` text NOT NULL,
	`price` real NOT NULL,
	`original_price` real NOT NULL,
	`template_ids` text NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`sales_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template_controls` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`control_type` text NOT NULL,
	`label` text NOT NULL,
	`default_value` text,
	`options` text,
	`required` integer DEFAULT 0 NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template_customizations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`template_id` text NOT NULL,
	`name` text NOT NULL,
	`customizations` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template_purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`template_id` text NOT NULL,
	`amount` real NOT NULL,
	`stripe_payment_intent_id` text,
	`purchased_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`format_slug` text NOT NULL,
	`format_name` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`file_url` text NOT NULL,
	`preview_url` text,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`creator_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`tags` text NOT NULL,
	`industries` text NOT NULL,
	`style_tags` text NOT NULL,
	`thumbnail` text NOT NULL,
	`preview_url` text NOT NULL,
	`file_url` text NOT NULL,
	`price` real NOT NULL,
	`use_case` text NOT NULL,
	`ai_prompt_seed` text,
	`default_palette` text,
	`font_stack` text,
	`canvas_width` integer,
	`canvas_height` integer,
	`is_premium` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`download_count` integer DEFAULT 0 NOT NULL,
	`rating` real DEFAULT 0,
	`rating_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`password` text,
	`first_name` text,
	`last_name` text,
	`profile_image_url` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);