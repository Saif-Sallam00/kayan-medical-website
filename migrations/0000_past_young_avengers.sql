CREATE TABLE "consultation_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"product_id" text,
	"product_name" text,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_forms" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "features" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"description_ar" text NOT NULL,
	"icon" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" text DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "hero_sections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"subtitle_ar" text NOT NULL,
	"background_image_url" text,
	"cta_text" text,
	"cta_link" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" text DEFAULT '0',
	"description_ar" text
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"device_type" text NOT NULL,
	"issue_description" text NOT NULL,
	"clinic_location" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_ar" text NOT NULL,
	"description" text NOT NULL,
	"discount" text,
	"valid_until" text,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"display_order" text DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"category" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"description" text NOT NULL,
	"specifications" text[] NOT NULL,
	"image_url" text,
	"price_info" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" text DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label_ar" text NOT NULL,
	"value" text NOT NULL,
	"icon" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" text DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_name" text NOT NULL,
	"specialization" text NOT NULL,
	"quote" text NOT NULL,
	"rating" text DEFAULT '5' NOT NULL,
	"clinic_name" text NOT NULL,
	"photo_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"display_order" text DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
