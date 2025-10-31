import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "./auth";
import type { SafeUser } from "@shared/schema";
import { 
  insertContactFormSchema,
  insertMaintenanceRequestSchema,
  insertConsultationRequestSchema
} from "@shared/schema";

// Auth middleware to protect routes
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    success: false, 
    message: "يجب تسجيل الدخول أولاً" 
  });
}

// Middleware to check admin role
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as SafeUser).role === "admin") {
    return next();
  }
  res.status(403).json({ 
    success: false, 
    message: "غير مصرح لك بالوصول لهذه الصفحة" 
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: SafeUser | false, info: any) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "حدث خطأ أثناء تسجيل الدخول" 
        });
      }
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: info?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
        });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: "حدث خطأ أثناء تسجيل الدخول" 
          });
        }
        
        return res.json({ 
          success: true, 
          user 
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "حدث خطأ أثناء تسجيل الخروج" 
        });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ 
        success: true, 
        user: req.user 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "غير مسجل الدخول" 
      });
    }
  });

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

  app.get("/api/contact", requireAdmin, async (req, res) => {
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

  app.get("/api/contact/:id", requireAdmin, async (req, res) => {
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

  app.get("/api/maintenance", requireAdmin, async (req, res) => {
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

  app.get("/api/maintenance/:id", requireAdmin, async (req, res) => {
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

  app.get("/api/consultation", requireAdmin, async (req, res) => {
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

  app.get("/api/consultation/:id", requireAdmin, async (req, res) => {
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
