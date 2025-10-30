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
  // User methods (existing)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
      ...insertRequest,
      id,
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
