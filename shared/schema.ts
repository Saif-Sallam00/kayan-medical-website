import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema (Admin Authentication)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"), // admin, editor, viewer
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Safe user type without password
export type SafeUser = Omit<User, 'passwordHash'>;

// Products Schema
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  category: text("category").notNull(), // clinic, hospital, portable
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  description: text("description").notNull(),
  specifications: text("specifications").array().notNull(),
  imageUrl: text("image_url"),
  // Store up to 4 additional images
  additionalImages: text("additional_images").array(), 
  priceInfo: text("price_info"), 
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: text("display_order").default("0"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
}).extend({
  nameAr: z.string().min(2, "الاسم بالعربية مطلوب"),
  nameEn: z.string().min(2, "الاسم بالإنجليزية مطلوب"),
  description: z.string().min(10, "الوصف مطلوب"),
  brand: z.string().min(2, "الماركة مطلوبة"),
  model: z.string().min(1, "الموديل مطلوب"),
  additionalImages: z.array(z.string()).optional(),
});

export const updateProductSchema = insertProductSchema.partial();

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Product = typeof products.$inferSelect;

// Contact Form Schema
export const contactForms = pgTable("contact_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactFormSchema = createInsertSchema(contactForms).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

export type InsertContactForm = z.infer<typeof insertContactFormSchema>;
export type ContactForm = typeof contactForms.$inferSelect;

// Maintenance Request Schema
export const maintenanceRequests = pgTable("maintenance_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  deviceType: text("device_type").notNull(),
  issueDescription: text("issue_description").notNull(),
  clinicLocation: text("clinic_location").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMaintenanceRequestSchema = createInsertSchema(maintenanceRequests).omit({
  id: true,
  createdAt: true,
}).extend({
  clientName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  deviceType: z.string().min(2, "يرجى اختيار نوع الجهاز"),
  issueDescription: z.string().min(10, "يرجى وصف المشكلة بالتفصيل"),
  clinicLocation: z.string().min(3, "يرجى كتابة عنوان العيادة"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
});

export type InsertMaintenanceRequest = z.infer<typeof insertMaintenanceRequestSchema>;
export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;

// Consultation Request Schema
export const consultationRequests = pgTable("consultation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  productId: text("product_id"),
  productName: text("product_name"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConsultationRequestSchema = createInsertSchema(consultationRequests).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  message: z.string().optional(),
});

export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;
export type ConsultationRequest = typeof consultationRequests.$inferSelect;

// Testimonials Schema (Client testimonials)
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorName: text("doctor_name").notNull(),
  specialization: text("specialization").notNull(),
  quote: text("quote").notNull(),
  rating: text("rating").notNull().default("5"),
  clinicName: text("clinic_name").notNull(),
  photoUrl: text("photo_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  displayOrder: text("display_order").default("0"),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
}).extend({
  doctorName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  specialization: z.string().min(2, "التخصص مطلوب"),
  quote: z.string().min(10, "الشهادة يجب أن تكون 10 أحرف على الأقل"),
  clinicName: z.string().min(2, "اسم العيادة مطلوب"),
});

export const updateTestimonialSchema = insertTestimonialSchema.partial();

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type UpdateTestimonial = z.infer<typeof updateTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Offers Schema (Special deals and news)
export const offers = pgTable("offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleAr: text("title_ar").notNull(),
  description: text("description").notNull(),
  discount: text("discount"),
  validUntil: text("valid_until"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  displayOrder: text("display_order").default("0"),
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true,
}).extend({
  titleAr: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
});

export const updateOfferSchema = insertOfferSchema.partial();

export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type UpdateOffer = z.infer<typeof updateOfferSchema>;
export type Offer = typeof offers.$inferSelect;

// Hero Sections Schema (Homepage hero sections)
export const heroSections = pgTable("hero_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleAr: text("title_ar").notNull(),
  subtitleAr: text("subtitle_ar").notNull(),
  descriptionAr: text("description_ar"),
  badgeAr: text("badge_ar"),
  backgroundImageUrl: text("background_image_url"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: text("display_order").default("0"),
});

export const insertHeroSectionSchema = createInsertSchema(heroSections).omit({
  id: true,
}).extend({
  titleAr: z.string().min(3, "العنوان مطلوب"),
  subtitleAr: z.string().min(10, "النص الفرعي مطلوب"),
  descriptionAr: z.string().optional(),
  badgeAr: z.string().optional(),
});

export const updateHeroSectionSchema = insertHeroSectionSchema.partial();

export type InsertHeroSection = z.infer<typeof insertHeroSectionSchema>;
export type UpdateHeroSection = z.infer<typeof updateHeroSectionSchema>;
export type HeroSection = typeof heroSections.$inferSelect;

// Features Schema (Homepage features)
export const features = pgTable("features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleAr: text("title_ar").notNull(),
  descriptionAr: text("description_ar").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: text("display_order").default("0"),
});

export const insertFeatureSchema = createInsertSchema(features).omit({
  id: true,
}).extend({
  titleAr: z.string().min(2, "العنوان مطلوب"),
  descriptionAr: z.string().min(10, "الوصف مطلوب"),
  icon: z.string().min(2, "اسم الأيقونة مطلوب"),
});

export const updateFeatureSchema = insertFeatureSchema.partial();

export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type UpdateFeature = z.infer<typeof updateFeatureSchema>;
export type Feature = typeof features.$inferSelect;

// Stats Schema (Homepage statistics)
export const stats = pgTable("stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labelAr: text("label_ar").notNull(),
  value: text("value").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: text("display_order").default("0"),
});

export const insertStatSchema = createInsertSchema(stats).omit({
  id: true,
}).extend({
  labelAr: z.string().min(2, "التسمية مطلوبة"),
  value: z.string().min(1, "القيمة مطلوبة"),
  icon: z.string().min(2, "اسم الأيقونة مطلوب"),
});

export const updateStatSchema = insertStatSchema.partial();

export type InsertStat = z.infer<typeof insertStatSchema>;
export type UpdateStat = z.infer<typeof updateStatSchema>;
export type Stat = typeof stats.$inferSelect;

// --- NEW TABLES ADDED ---

// ✅ NEW: Portfolio/Previous Work Schema
export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleAr: text("title_ar").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  clientName: text("client_name"), // Optional: who was this for?
  location: text("location"),      // Optional: where was this installed?
  deliveryDate: text("delivery_date"), // Optional: when?
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: text("display_order").default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
}).extend({
  titleAr: z.string().min(3, "العنوان مطلوب"),
  imageUrl: z.string().min(1, "الصورة مطلوبة"),
});

export const updatePortfolioItemSchema = insertPortfolioItemSchema.partial();

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type UpdatePortfolioItem = z.infer<typeof updatePortfolioItemSchema>;

// Add this for Site-wide settings (contact, footer, etc.)
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mainPhone: text("main_phone").notNull().default("+20 10 25253012"),
  whatsappLink: text("whatsapp_link").notNull().default("https://wa.link/hn35ok"),
  email: text("email").notNull().default("info@kayanmedical.com"),
  addressShebin: text("address_shebin").notNull().default("شيبين الكوم، المنوفية"),
  addressZayed: text("address_zayed").notNull().default("الشيخ زايد، القاهرة"),
  facebookUrl: text("facebook_url").notNull().default("https://facebook.com"),
  instagramUrl: text("instagram_url").notNull().default("https://instagram.com"),
  // ✅ NEW: Default WhatsApp Message Template
  whatsappMessage: text("whatsapp_message").notNull().default("مرحباً، أود الاستفسار عن جهاز:"),
});

// Add this for the About Us page content
export const aboutPage = pgTable("about_page", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visionAr: text("vision_ar").notNull().default("اكتب رؤيتنا هنا..."),
  missionAr: text("mission_ar").notNull().default("اكتب مهمتنا هنا..."),
});

// Add this for the Team Members on the About page
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  displayOrder: text("display_order").default("0"),
  isActive: boolean("is_active").notNull().default(true),
});

// Zod schemas for validation
export const insertSiteSettingsSchema = createInsertSchema(siteSettings);
export const insertAboutPageSchema = createInsertSchema(aboutPage);
export const insertTeamMemberSchema = createInsertSchema(teamMembers, {
  // Omit the id field and add custom validation
  id: undefined, // This omits the id field
  name: z.string().min(2, "الاسم مطلوب"),
  role: z.string().min(2, "الدور مطلوب"),
  description: z.string().min(5, "الوصف مطلوب"),
});

export const updateTeamMemberSchema = insertTeamMemberSchema.partial();

// --- FIX: Export the Types ---
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;

export type AboutPage = typeof aboutPage.$inferSelect;
export type InsertAboutPage = z.infer<typeof insertAboutPageSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;