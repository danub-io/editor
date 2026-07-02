CREATE TABLE `chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`type` text DEFAULT 'chapter' NOT NULL,
	`sub_type` text,
	`part_id` text,
	`number` integer NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '',
	`word_count` integer DEFAULT 0,
	`tags` text DEFAULT '[]',
	`status` text DEFAULT 'draft',
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`physical_traits` text,
	`personality` text,
	`motivations` text,
	`relationships` text DEFAULT '[]',
	`image_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'other',
	`image_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '',
	`type` text DEFAULT 'general',
	`tags` text DEFAULT '[]',
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`description` text,
	`language` text DEFAULT 'pt-BR' NOT NULL,
	`isbn` text,
	`categories` text DEFAULT '[]',
	`keywords` text DEFAULT '[]',
	`cover_image` text,
	`settings_page_format` text DEFAULT '6x9',
	`settings_font_family` text DEFAULT 'Lora',
	`settings_font_size` integer DEFAULT 11,
	`settings_line_height` real DEFAULT 1.4,
	`settings_margin_top` text DEFAULT '2cm',
	`settings_margin_bottom` text DEFAULT '2cm',
	`settings_margin_inner` text DEFAULT '2.5cm',
	`settings_margin_outer` text DEFAULT '2cm',
	`settings_theme` text DEFAULT 'light',
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `timeline_events` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text,
	`chapter_id` text,
	`character_ids` text DEFAULT '[]',
	`location_id` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
