import { 
  type User, 
  type InsertUser,
  type ContactForm,
  type InsertContactForm,
  type MaintenanceRequest,
  type InsertMaintenanceRequest,
  type ConsultationRequest,
  type InsertConsultationRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactForms: Map<string, ContactForm>;
  private maintenanceRequests: Map<string, MaintenanceRequest>;
  private consultationRequests: Map<string, ConsultationRequest>;

  constructor() {
    this.users = new Map();
    this.contactForms = new Map();
    this.maintenanceRequests = new Map();
    this.consultationRequests = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email,
      passwordHash: insertUser.passwordHash,
      name: insertUser.name,
      role: insertUser.role || "admin",
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
      lastLoginAt: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      this.users.set(id, user);
    }
  }

  // Contact form methods
  async createContactForm(insertForm: InsertContactForm): Promise<ContactForm> {
    const id = randomUUID();
    const contactForm: ContactForm = {
      ...insertForm,
      id,
      createdAt: new Date(),
    };
    this.contactForms.set(id, contactForm);
    return contactForm;
  }

  async getAllContactForms(): Promise<ContactForm[]> {
    return Array.from(this.contactForms.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getContactForm(id: string): Promise<ContactForm | undefined> {
    return this.contactForms.get(id);
  }

  // Maintenance request methods
  async createMaintenanceRequest(insertRequest: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const id = randomUUID();
    const maintenanceRequest: MaintenanceRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
    };
    this.maintenanceRequests.set(id, maintenanceRequest);
    return maintenanceRequest;
  }

  async getAllMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined> {
    return this.maintenanceRequests.get(id);
  }

  // Consultation request methods
  async createConsultationRequest(insertRequest: InsertConsultationRequest): Promise<ConsultationRequest> {
    const id = randomUUID();
    const consultationRequest: ConsultationRequest = {
      id,
      name: insertRequest.name,
      phone: insertRequest.phone,
      email: insertRequest.email || null,
      productId: insertRequest.productId || null,
      productName: insertRequest.productName || null,
      message: insertRequest.message || null,
      createdAt: new Date(),
    };
    this.consultationRequests.set(id, consultationRequest);
    return consultationRequest;
  }

  async getAllConsultationRequests(): Promise<ConsultationRequest[]> {
    return Array.from(this.consultationRequests.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getConsultationRequest(id: string): Promise<ConsultationRequest | undefined> {
    return this.consultationRequests.get(id);
  }
}

export const storage = new MemStorage();
