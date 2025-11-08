import { 
  type User, 
  type InsertUser,
  type ContactForm,
  type InsertContactForm,
  type MaintenanceRequest,
  type InsertMaintenanceRequest,
  type ConsultationRequest,
  type InsertConsultationRequest,
  type Product,
  type InsertProduct,
  type Testimonial,
  type InsertTestimonial,
  type Offer,
  type InsertOffer,
  type HeroSection,
  type InsertHeroSection,
  type Feature,
  type InsertFeature,
  type Stat,
  type InsertStat,
  users,
  contactForms,
  maintenanceRequests,
  consultationRequests,
  products,
  testimonials,
  offers,
  heroSections,
  features,
  stats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  
  // Contact form methods
  createContactForm(form: InsertContactForm): Promise<ContactForm>;
  getAllContactForms(): Promise<ContactForm[]>;
  getContactForm(id: string): Promise<ContactForm | undefined>;
  
  // Maintenance request methods
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  getAllMaintenanceRequests(): Promise<MaintenanceRequest[]>;
  getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined>;
  
  // Consultation request methods
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  getAllConsultationRequests(): Promise<ConsultationRequest[]>;
  getConsultationRequest(id: string): Promise<ConsultationRequest | undefined>;

  // Product methods
  createProduct(product: InsertProduct): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Testimonial methods
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getAllTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Offer methods
  createOffer(offer: InsertOffer): Promise<Offer>;
  getAllOffers(): Promise<Offer[]>;
  getActiveOffers(): Promise<Offer[]>;
  getOffer(id: string): Promise<Offer | undefined>;
  updateOffer(id: string, offer: Partial<InsertOffer>): Promise<Offer | undefined>;
  deleteOffer(id: string): Promise<boolean>;

  // Hero section methods
  createHeroSection(hero: InsertHeroSection): Promise<HeroSection>;
  getAllHeroSections(): Promise<HeroSection[]>;
  getActiveHeroSections(): Promise<HeroSection[]>;
  getHeroSection(id: string): Promise<HeroSection | undefined>;
  updateHeroSection(id: string, hero: Partial<InsertHeroSection>): Promise<HeroSection | undefined>;
  deleteHeroSection(id: string): Promise<boolean>;

  // Feature methods
  createFeature(feature: InsertFeature): Promise<Feature>;
  getAllFeatures(): Promise<Feature[]>;
  getActiveFeatures(): Promise<Feature[]>;
  getFeature(id: string): Promise<Feature | undefined>;
  updateFeature(id: string, feature: Partial<InsertFeature>): Promise<Feature | undefined>;
  deleteFeature(id: string): Promise<boolean>;

  // Stat methods
  createStat(stat: InsertStat): Promise<Stat>;
  getAllStats(): Promise<Stat[]>;
  getActiveStats(): Promise<Stat[]>;
  getStat(id: string): Promise<Stat | undefined>;
  updateStat(id: string, stat: Partial<InsertStat>): Promise<Stat | undefined>;
  deleteStat(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Normalize email to lowercase for case-insensitive matching
    const normalizedEmail = email.trim().toLowerCase();
    const result = await db.select().from(users).where(eq(users.email, normalizedEmail));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Normalize email to lowercase before storing
    const normalizedUser = {
      ...insertUser,
      email: insertUser.email.trim().toLowerCase(),
    };
    const result = await db.insert(users).values(normalizedUser).returning();
    return result[0];
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  // Contact form methods
  async createContactForm(insertForm: InsertContactForm): Promise<ContactForm> {
    const result = await db.insert(contactForms).values(insertForm).returning();
    return result[0];
  }

  async getAllContactForms(): Promise<ContactForm[]> {
    return await db.select().from(contactForms).orderBy(desc(contactForms.createdAt));
  }

  async getContactForm(id: string): Promise<ContactForm | undefined> {
    const result = await db.select().from(contactForms).where(eq(contactForms.id, id));
    return result[0];
  }

  // Maintenance request methods
  async createMaintenanceRequest(insertRequest: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const result = await db.insert(maintenanceRequests).values(insertRequest).returning();
    return result[0];
  }

  async getAllMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return await db.select().from(maintenanceRequests).orderBy(desc(maintenanceRequests.createdAt));
  }

  async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined> {
    const result = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id));
    return result[0];
  }

  // Consultation request methods
  async createConsultationRequest(insertRequest: InsertConsultationRequest): Promise<ConsultationRequest> {
    const result = await db.insert(consultationRequests).values(insertRequest).returning();
    return result[0];
  }

  async getAllConsultationRequests(): Promise<ConsultationRequest[]> {
    return await db.select().from(consultationRequests).orderBy(desc(consultationRequests.createdAt));
  }

  async getConsultationRequest(id: string): Promise<ConsultationRequest | undefined> {
    const result = await db.select().from(consultationRequests).where(eq(consultationRequests.id, id));
    return result[0];
  }

  // Product methods
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  // Testimonial methods
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(insertTestimonial).returning();
    return result[0];
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.displayOrder));
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(desc(testimonials.displayOrder));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return result[0];
  }

  async updateTestimonial(id: string, updateData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const result = await db.update(testimonials)
      .set(updateData)
      .where(eq(testimonials.id, id))
      .returning();
    return result[0];
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }

  // Offer methods
  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const result = await db.insert(offers).values(insertOffer).returning();
    return result[0];
  }

  async getAllOffers(): Promise<Offer[]> {
    return await db.select().from(offers).orderBy(desc(offers.displayOrder));
  }

  async getActiveOffers(): Promise<Offer[]> {
    return await db.select().from(offers)
      .where(eq(offers.isActive, true))
      .orderBy(desc(offers.displayOrder));
  }

  async getOffer(id: string): Promise<Offer | undefined> {
    const result = await db.select().from(offers).where(eq(offers.id, id));
    return result[0];
  }

  async updateOffer(id: string, updateData: Partial<InsertOffer>): Promise<Offer | undefined> {
    const result = await db.update(offers)
      .set(updateData)
      .where(eq(offers.id, id))
      .returning();
    return result[0];
  }

  async deleteOffer(id: string): Promise<boolean> {
    const result = await db.delete(offers).where(eq(offers.id, id)).returning();
    return result.length > 0;
  }

  // Hero section methods
  async createHeroSection(insertHero: InsertHeroSection): Promise<HeroSection> {
    const result = await db.insert(heroSections).values(insertHero).returning();
    return result[0];
  }

  async getAllHeroSections(): Promise<HeroSection[]> {
    return await db.select().from(heroSections).orderBy(desc(heroSections.displayOrder));
  }

  async getActiveHeroSections(): Promise<HeroSection[]> {
    return await db.select().from(heroSections)
      .where(eq(heroSections.isActive, true))
      .orderBy(desc(heroSections.displayOrder));
  }

  async getHeroSection(id: string): Promise<HeroSection | undefined> {
    const result = await db.select().from(heroSections).where(eq(heroSections.id, id));
    return result[0];
  }

  async updateHeroSection(id: string, updateData: Partial<InsertHeroSection>): Promise<HeroSection | undefined> {
    const result = await db.update(heroSections)
      .set(updateData)
      .where(eq(heroSections.id, id))
      .returning();
    return result[0];
  }

  async deleteHeroSection(id: string): Promise<boolean> {
    const result = await db.delete(heroSections).where(eq(heroSections.id, id)).returning();
    return result.length > 0;
  }

  // Feature methods
  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const result = await db.insert(features).values(insertFeature).returning();
    return result[0];
  }

  async getAllFeatures(): Promise<Feature[]> {
    return await db.select().from(features).orderBy(desc(features.displayOrder));
  }

  async getActiveFeatures(): Promise<Feature[]> {
    return await db.select().from(features)
      .where(eq(features.isActive, true))
      .orderBy(desc(features.displayOrder));
  }

  async getFeature(id: string): Promise<Feature | undefined> {
    const result = await db.select().from(features).where(eq(features.id, id));
    return result[0];
  }

  async updateFeature(id: string, updateData: Partial<InsertFeature>): Promise<Feature | undefined> {
    const result = await db.update(features)
      .set(updateData)
      .where(eq(features.id, id))
      .returning();
    return result[0];
  }

  async deleteFeature(id: string): Promise<boolean> {
    const result = await db.delete(features).where(eq(features.id, id)).returning();
    return result.length > 0;
  }

  // Stat methods
  async createStat(insertStat: InsertStat): Promise<Stat> {
    const result = await db.insert(stats).values(insertStat).returning();
    return result[0];
  }

  async getAllStats(): Promise<Stat[]> {
    return await db.select().from(stats).orderBy(desc(stats.displayOrder));
  }

  async getActiveStats(): Promise<Stat[]> {
    return await db.select().from(stats)
      .where(eq(stats.isActive, true))
      .orderBy(desc(stats.displayOrder));
  }

  async getStat(id: string): Promise<Stat | undefined> {
    const result = await db.select().from(stats).where(eq(stats.id, id));
    return result[0];
  }

  async updateStat(id: string, updateData: Partial<InsertStat>): Promise<Stat | undefined> {
    const result = await db.update(stats)
      .set(updateData)
      .where(eq(stats.id, id))
      .returning();
    return result[0];
  }

  async deleteStat(id: string): Promise<boolean> {
    const result = await db.delete(stats).where(eq(stats.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
