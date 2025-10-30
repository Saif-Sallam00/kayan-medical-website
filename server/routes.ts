import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactFormSchema,
  insertMaintenanceRequestSchema,
  insertConsultationRequestSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact Form Routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactFormSchema.parse(req.body);
      const contactForm = await storage.createContactForm(validatedData);
      res.json({ success: true, data: contactForm });
    } catch (error: any) {
      console.error("Error creating contact form:", error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "فشل في إرسال النموذج" 
      });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const forms = await storage.getAllContactForms();
      res.json({ success: true, data: forms });
    } catch (error: any) {
      console.error("Error fetching contact forms:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب النماذج" 
      });
    }
  });

  app.get("/api/contact/:id", async (req, res) => {
    try {
      const form = await storage.getContactForm(req.params.id);
      if (!form) {
        return res.status(404).json({ 
          success: false, 
          message: "النموذج غير موجود" 
        });
      }
      res.json({ success: true, data: form });
    } catch (error: any) {
      console.error("Error fetching contact form:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب النموذج" 
      });
    }
  });

  // Maintenance Request Routes
  app.post("/api/maintenance", async (req, res) => {
    try {
      const validatedData = insertMaintenanceRequestSchema.parse(req.body);
      const maintenanceRequest = await storage.createMaintenanceRequest(validatedData);
      res.json({ success: true, data: maintenanceRequest });
    } catch (error: any) {
      console.error("Error creating maintenance request:", error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "فشل في إرسال طلب الصيانة" 
      });
    }
  });

  app.get("/api/maintenance", async (req, res) => {
    try {
      const requests = await storage.getAllMaintenanceRequests();
      res.json({ success: true, data: requests });
    } catch (error: any) {
      console.error("Error fetching maintenance requests:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب طلبات الصيانة" 
      });
    }
  });

  app.get("/api/maintenance/:id", async (req, res) => {
    try {
      const request = await storage.getMaintenanceRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ 
          success: false, 
          message: "طلب الصيانة غير موجود" 
        });
      }
      res.json({ success: true, data: request });
    } catch (error: any) {
      console.error("Error fetching maintenance request:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب طلب الصيانة" 
      });
    }
  });

  // Consultation Request Routes
  app.post("/api/consultation", async (req, res) => {
    try {
      const validatedData = insertConsultationRequestSchema.parse(req.body);
      const consultationRequest = await storage.createConsultationRequest(validatedData);
      res.json({ success: true, data: consultationRequest });
    } catch (error: any) {
      console.error("Error creating consultation request:", error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "فشل في إرسال طلب الاستشارة" 
      });
    }
  });

  app.get("/api/consultation", async (req, res) => {
    try {
      const requests = await storage.getAllConsultationRequests();
      res.json({ success: true, data: requests });
    } catch (error: any) {
      console.error("Error fetching consultation requests:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب طلبات الاستشارة" 
      });
    }
  });

  app.get("/api/consultation/:id", async (req, res) => {
    try {
      const request = await storage.getConsultationRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ 
          success: false, 
          message: "طلب الاستشارة غير موجود" 
        });
      }
      res.json({ success: true, data: request });
    } catch (error: any) {
      console.error("Error fetching consultation request:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب طلب الاستشارة" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
