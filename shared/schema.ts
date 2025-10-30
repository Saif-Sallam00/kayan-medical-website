import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  priceInfo: text("price_info"), // "استفسر عن السعر" or actual price
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
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

// Testimonial Schema (for display, not user-generated)
export interface Testimonial {
  id: string;
  doctorName: string;
  specialization: string;
  quote: string;
  rating: number;
  clinicName: string;
  photoUrl?: string;
}

// Offer/News Schema
export interface Offer {
  id: string;
  titleAr: string;
  description: string;
  discount?: string;
  validUntil?: string;
  imageUrl?: string;
  isActive: boolean;
}
