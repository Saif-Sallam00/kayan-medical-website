import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "./auth";
import type { SafeUser } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { 
  insertContactFormSchema,
  insertMaintenanceRequestSchema,
  insertConsultationRequestSchema,
  insertProductSchema,
  updateProductSchema,
  insertTestimonialSchema,
  updateTestimonialSchema,
  insertOfferSchema,
  updateOfferSchema,
  insertHeroSectionSchema,
  updateHeroSectionSchema,
  insertFeatureSchema,
  updateFeatureSchema,
  insertStatSchema,
  updateStatSchema
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

  // Product Routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const activeProducts = products.filter(p => p.isActive);
      res.json({ success: true, data: activeProducts });
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب المنتجات" 
      });
    }
  });

  // Admin endpoint to get all products (including inactive)
  app.get("/api/products/all", requireAdmin, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ success: true, data: products });
    } catch (error: any) {
      console.error("Error fetching all products:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب المنتجات" 
      });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: "المنتج غير موجود" 
        });
      }
      res.json({ success: true, data: product });
    } catch (error: any) {
      console.error("Error fetching product:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب المنتج" 
      });
    }
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في إنشاء المنتج" 
      });
    }
  });

  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: "المنتج غير موجود" 
        });
      }
      res.json({ success: true, data: product });
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في تحديث المنتج" 
      });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "المنتج غير موجود" 
        });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في حذف المنتج" 
      });
    }
  });

  // Testimonial Routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getActiveTestimonials();
      res.json({ success: true, data: testimonials });
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الشهادات" 
      });
    }
  });

  app.get("/api/testimonials/all", requireAdmin, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json({ success: true, data: testimonials });
    } catch (error: any) {
      console.error("Error fetching all testimonials:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الشهادات" 
      });
    }
  });

  app.get("/api/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const testimonial = await storage.getTestimonial(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ 
          success: false, 
          message: "الشهادة غير موجودة" 
        });
      }
      res.json({ success: true, data: testimonial });
    } catch (error: any) {
      console.error("Error fetching testimonial:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الشهادة" 
      });
    }
  });

  app.post("/api/testimonials", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json({ success: true, data: testimonial });
    } catch (error: any) {
      console.error("Error creating testimonial:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في إنشاء الشهادة" 
      });
    }
  });

  app.put("/api/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateTestimonialSchema.parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validatedData);
      if (!testimonial) {
        return res.status(404).json({ 
          success: false, 
          message: "الشهادة غير موجودة" 
        });
      }
      res.json({ success: true, data: testimonial });
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في تحديث الشهادة" 
      });
    }
  });

  app.delete("/api/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteTestimonial(req.params.id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "الشهادة غير موجودة" 
        });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في حذف الشهادة" 
      });
    }
  });

  // Offer Routes
  app.get("/api/offers", async (req, res) => {
    try {
      const offers = await storage.getActiveOffers();
      res.json({ success: true, data: offers });
    } catch (error: any) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب العروض" 
      });
    }
  });

  app.get("/api/offers/all", requireAdmin, async (req, res) => {
    try {
      const offers = await storage.getAllOffers();
      res.json({ success: true, data: offers });
    } catch (error: any) {
      console.error("Error fetching all offers:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب العروض" 
      });
    }
  });

  app.get("/api/offers/:id", requireAdmin, async (req, res) => {
    try {
      const offer = await storage.getOffer(req.params.id);
      if (!offer) {
        return res.status(404).json({ 
          success: false, 
          message: "العرض غير موجود" 
        });
      }
      res.json({ success: true, data: offer });
    } catch (error: any) {
      console.error("Error fetching offer:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب العرض" 
      });
    }
  });

  app.post("/api/offers", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer(validatedData);
      res.status(201).json({ success: true, data: offer });
    } catch (error: any) {
      console.error("Error creating offer:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في إنشاء العرض" 
      });
    }
  });

  app.put("/api/offers/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateOfferSchema.parse(req.body);
      const offer = await storage.updateOffer(req.params.id, validatedData);
      if (!offer) {
        return res.status(404).json({ 
          success: false, 
          message: "العرض غير موجود" 
        });
      }
      res.json({ success: true, data: offer });
    } catch (error: any) {
      console.error("Error updating offer:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في تحديث العرض" 
      });
    }
  });

  app.delete("/api/offers/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteOffer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "العرض غير موجود" 
        });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting offer:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في حذف العرض" 
      });
    }
  });

  // Hero Section Routes
  app.get("/api/hero-sections", async (req, res) => {
    try {
      const heroSections = await storage.getActiveHeroSections();
      res.json({ success: true, data: heroSections });
    } catch (error: any) {
      console.error("Error fetching hero sections:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الأقسام الرئيسية" 
      });
    }
  });

  app.get("/api/hero-sections/all", requireAdmin, async (req, res) => {
    try {
      const heroSections = await storage.getAllHeroSections();
      res.json({ success: true, data: heroSections });
    } catch (error: any) {
      console.error("Error fetching all hero sections:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الأقسام الرئيسية" 
      });
    }
  });

  app.get("/api/hero-sections/:id", requireAdmin, async (req, res) => {
    try {
      const heroSection = await storage.getHeroSection(req.params.id);
      if (!heroSection) {
        return res.status(404).json({ 
          success: false, 
          message: "القسم الرئيسي غير موجود" 
        });
      }
      res.json({ success: true, data: heroSection });
    } catch (error: any) {
      console.error("Error fetching hero section:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب القسم الرئيسي" 
      });
    }
  });

  app.post("/api/hero-sections", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertHeroSectionSchema.parse(req.body);
      const heroSection = await storage.createHeroSection(validatedData);
      res.status(201).json({ success: true, data: heroSection });
    } catch (error: any) {
      console.error("Error creating hero section:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في إنشاء القسم الرئيسي" 
      });
    }
  });

  app.put("/api/hero-sections/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateHeroSectionSchema.parse(req.body);
      const heroSection = await storage.updateHeroSection(req.params.id, validatedData);
      if (!heroSection) {
        return res.status(404).json({ 
          success: false, 
          message: "القسم الرئيسي غير موجود" 
        });
      }
      res.json({ success: true, data: heroSection });
    } catch (error: any) {
      console.error("Error updating hero section:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في تحديث القسم الرئيسي" 
      });
    }
  });

  app.delete("/api/hero-sections/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteHeroSection(req.params.id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "القسم الرئيسي غير موجود" 
        });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting hero section:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في حذف القسم الرئيسي" 
      });
    }
  });

  // Feature Routes
  app.get("/api/features", async (req, res) => {
    try {
      const features = await storage.getActiveFeatures();
      res.json({ success: true, data: features });
    } catch (error: any) {
      console.error("Error fetching features:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب المميزات" 
      });
    }
  });

  app.get("/api/features/all", requireAdmin, async (req, res) => {
    try {
      const features = await storage.getAllFeatures();
      res.json({ success: true, data: features });
    } catch (error: any) {
      console.error("Error fetching all features:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب المميزات" 
      });
    }
  });

  app.get("/api/features/:id", requireAdmin, async (req, res) => {
    try {
      const feature = await storage.getFeature(req.params.id);
      if (!feature) {
        return res.status(404).json({ 
          success: false, 
          message: "الميزة غير موجودة" 
        });
      }
      res.json({ success: true, data: feature });
    } catch (error: any) {
      console.error("Error fetching feature:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الميزة" 
      });
    }
  });

  app.post("/api/features", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertFeatureSchema.parse(req.body);
      const feature = await storage.createFeature(validatedData);
      res.status(201).json({ success: true, data: feature });
    } catch (error: any) {
      console.error("Error creating feature:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في إنشاء الميزة" 
      });
    }
  });

  app.put("/api/features/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateFeatureSchema.parse(req.body);
      const feature = await storage.updateFeature(req.params.id, validatedData);
      if (!feature) {
        return res.status(404).json({ 
          success: false, 
          message: "الميزة غير موجودة" 
        });
      }
      res.json({ success: true, data: feature });
    } catch (error: any) {
      console.error("Error updating feature:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في تحديث الميزة" 
      });
    }
  });

  app.delete("/api/features/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteFeature(req.params.id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "الميزة غير موجودة" 
        });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting feature:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في حذف الميزة" 
      });
    }
  });

  // Stats Routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getActiveStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الإحصائيات" 
      });
    }
  });

  app.get("/api/stats/all", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getAllStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      console.error("Error fetching all stats:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الإحصائيات" 
      });
    }
  });

  app.get("/api/stats/:id", requireAdmin, async (req, res) => {
    try {
      const stat = await storage.getStat(req.params.id);
      if (!stat) {
        return res.status(404).json({ 
          success: false, 
          message: "الإحصائية غير موجودة" 
        });
      }
      res.json({ success: true, data: stat });
    } catch (error: any) {
      console.error("Error fetching stat:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في جلب الإحصائية" 
      });
    }
  });

  app.post("/api/stats", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertStatSchema.parse(req.body);
      const stat = await storage.createStat(validatedData);
      res.status(201).json({ success: true, data: stat });
    } catch (error: any) {
      console.error("Error creating stat:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في إنشاء الإحصائية" 
      });
    }
  });

  app.put("/api/stats/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateStatSchema.parse(req.body);
      const stat = await storage.updateStat(req.params.id, validatedData);
      if (!stat) {
        return res.status(404).json({ 
          success: false, 
          message: "الإحصائية غير موجودة" 
        });
      }
      res.json({ success: true, data: stat });
    } catch (error: any) {
      console.error("Error updating stat:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          success: false, 
          message: error.message || "بيانات غير صحيحة" 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "فشل في تحديث الإحصائية" 
      });
    }
  });

  app.delete("/api/stats/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteStat(req.params.id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "الإحصائية غير موجودة" 
        });
      }
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting stat:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في حذف الإحصائية" 
      });
    }
  });

  // Object Storage Routes - From blueprint: javascript_object_storage
  
  // Endpoint to serve uploaded images (public access)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Endpoint to get upload URL (admin only)
  app.post("/api/objects/upload", requireAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في إنشاء رابط الرفع" 
      });
    }
  });

  // Endpoint to set ACL policy for uploaded image (admin only)
  app.post("/api/objects/set-acl", requireAdmin, async (req, res) => {
    try {
      if (!req.body.imageUrl) {
        return res.status(400).json({ 
          success: false, 
          message: "رابط الصورة مطلوب" 
        });
      }

      const userId = (req.user as SafeUser).id;
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageUrl,
        {
          owner: userId,
          visibility: "public", // All uploaded images are public (visible to website visitors)
        }
      );

      res.json({ 
        success: true, 
        objectPath 
      });
    } catch (error: any) {
      console.error("Error setting ACL policy:", error);
      res.status(500).json({ 
        success: false, 
        message: "فشل في معالجة الصورة" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
