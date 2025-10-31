import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut, Mail, Wrench, MessageSquare, Package, Edit, Trash2, Plus, MessageCircle, Tag } from "lucide-react";
import type { SafeUser, Product, Testimonial, Offer } from "@shared/schema";
import AdminHeroTab from "./tabs/AdminHeroTab";
import AdminFeaturesTab from "./tabs/AdminFeaturesTab";
import AdminStatsTab from "./tabs/AdminStatsTab";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertProductSchema, insertTestimonialSchema, insertOfferSchema } from "@shared/schema";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Form schema for products with specifications as comma-separated string
const productFormSchema = z.object({
  nameAr: z.string().min(2, "الاسم بالعربية مطلوب"),
  nameEn: z.string().min(2, "الاسم بالإنجليزية مطلوب"),
  category: z.string(),
  brand: z.string().min(2, "الماركة مطلوبة"),
  model: z.string().min(1, "الموديل مطلوب"),
  description: z.string().min(10, "الوصف مطلوب"),
  specifications: z.string().min(1, "يجب إضافة المواصفات"),
  imageUrl: z.string().nullable().optional(),
  priceInfo: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Form schema for testimonials
const testimonialFormSchema = z.object({
  doctorName: z.string().min(2, "الاسم مطلوب"),
  specialization: z.string().min(2, "التخصص مطلوب"),
  quote: z.string().min(10, "الشهادة يجب أن تكون 10 أحرف على الأقل"),
  rating: z.string().default("5"),
  clinicName: z.string().min(2, "اسم العيادة مطلوب"),
  photoUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

// Form schema for offers
const offerFormSchema = z.object({
  titleAr: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  discount: z.string().nullable().optional(),
  validUntil: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.string().optional(),
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);
  
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);

  // Check if user is authenticated
  const { data: authData, isLoading: authLoading, error: authError } = useQuery<{ success: boolean; user: SafeUser }>({
    queryKey: ["/api/auth/me"],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (authError || !authData?.user)) {
      setLocation("/admin/login");
    }
  }, [authLoading, authError, authData, setLocation]);

  // Fetch contact forms
  const { data: contactData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/contact"],
    enabled: !!authData?.user,
  });

  // Fetch maintenance requests
  const { data: maintenanceData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/maintenance"],
    enabled: !!authData?.user,
  });

  // Fetch consultation requests
  const { data: consultationData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/consultation"],
    enabled: !!authData?.user,
  });

  // Fetch products (admin endpoint returns all products including inactive)
  const { data: productsData } = useQuery<{ success: boolean; data: Product[] }>({
    queryKey: ["/api/admin/products"],
    enabled: !!authData?.user,
  });

  // Fetch testimonials (admin endpoint returns all testimonials including inactive)
  const { data: testimonialsData } = useQuery<{ success: boolean; data: Testimonial[] }>({
    queryKey: ["/api/testimonials/all"],
    enabled: !!authData?.user,
  });

  // Fetch offers (admin endpoint returns all offers including inactive)
  const { data: offersData } = useQuery<{ success: boolean; data: Offer[] }>({
    queryKey: ["/api/offers/all"],
    enabled: !!authData?.user,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريباً",
      });
      setLocation("/admin/login");
    },
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const productData = {
        ...data,
        specifications: data.specifications.split(',').map(s => s.trim()).filter(Boolean),
      };
      return await apiRequest("POST", "/api/admin/products", productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم إضافة المنتج بنجاح",
      });
      setIsProductDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في إضافة المنتج",
        description: error.message,
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormValues }) => {
      const productData = {
        ...data,
        specifications: data.specifications.split(',').map(s => s.trim()).filter(Boolean),
      };
      return await apiRequest("PUT", `/api/admin/products/${id}`, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم تحديث المنتج بنجاح",
      });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث المنتج",
        description: error.message,
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/products/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم حذف المنتج بنجاح",
      });
      setDeletingProductId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في حذف المنتج",
        description: error.message,
      });
    },
  });

  // Testimonial mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: TestimonialFormValues) => {
      return await apiRequest("POST", "/api/testimonials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "تم إضافة الشهادة بنجاح",
      });
      setIsTestimonialDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في إضافة الشهادة",
        description: error.message,
      });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TestimonialFormValues }) => {
      return await apiRequest("PUT", `/api/testimonials/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "تم تحديث الشهادة بنجاح",
      });
      setIsTestimonialDialogOpen(false);
      setEditingTestimonial(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث الشهادة",
        description: error.message,
      });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/testimonials/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({
        title: "تم حذف الشهادة بنجاح",
      });
      setDeletingTestimonialId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في حذف الشهادة",
        description: error.message,
      });
    },
  });

  // Offer mutations
  const createOfferMutation = useMutation({
    mutationFn: async (data: OfferFormValues) => {
      return await apiRequest("POST", "/api/offers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({
        title: "تم إضافة العرض بنجاح",
      });
      setIsOfferDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في إضافة العرض",
        description: error.message,
      });
    },
  });

  const updateOfferMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OfferFormValues }) => {
      return await apiRequest("PUT", `/api/offers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({
        title: "تم تحديث العرض بنجاح",
      });
      setIsOfferDialogOpen(false);
      setEditingOffer(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث العرض",
        description: error.message,
      });
    },
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/offers/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/offers"] });
      toast({
        title: "تم حذف العرض بنجاح",
      });
      setDeletingOfferId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في حذف العرض",
        description: error.message,
      });
    },
  });

  // Product form
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nameAr: "",
      nameEn: "",
      category: "clinic",
      brand: "",
      model: "",
      description: "",
      specifications: "",
      imageUrl: "",
      priceInfo: "",
      isActive: true,
      displayOrder: "0",
    },
  });

  // Handle open product dialog for adding/editing
  const handleOpenProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      productForm.reset({
        ...product,
        specifications: product.specifications.join(', '),
        imageUrl: product.imageUrl || "",
        priceInfo: product.priceInfo || "",
        displayOrder: product.displayOrder || "0",
      });
    } else {
      setEditingProduct(null);
      productForm.reset({
        nameAr: "",
        nameEn: "",
        category: "clinic",
        brand: "",
        model: "",
        description: "",
        specifications: "",
        imageUrl: "",
        priceInfo: "",
        isActive: true,
        displayOrder: "0",
      });
    }
    setIsProductDialogOpen(true);
  };

  // Handle product form submit
  const handleProductSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  // Testimonial form
  const testimonialForm = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      doctorName: "",
      specialization: "",
      quote: "",
      rating: "5",
      clinicName: "",
      photoUrl: "",
      isActive: true,
      displayOrder: "0",
    },
  });

  // Handle open testimonial dialog for adding/editing
  const handleOpenTestimonialDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      testimonialForm.reset({
        doctorName: testimonial.doctorName,
        specialization: testimonial.specialization,
        quote: testimonial.quote,
        rating: testimonial.rating,
        clinicName: testimonial.clinicName,
        photoUrl: testimonial.photoUrl || "",
        isActive: testimonial.isActive,
        displayOrder: testimonial.displayOrder || "0",
      });
    } else {
      setEditingTestimonial(null);
      testimonialForm.reset({
        doctorName: "",
        specialization: "",
        quote: "",
        rating: "5",
        clinicName: "",
        photoUrl: "",
        isActive: true,
        displayOrder: "0",
      });
    }
    setIsTestimonialDialogOpen(true);
  };

  // Handle testimonial form submit
  const handleTestimonialSubmit = (data: TestimonialFormValues) => {
    if (editingTestimonial) {
      updateTestimonialMutation.mutate({ id: editingTestimonial.id, data });
    } else {
      createTestimonialMutation.mutate(data);
    }
  };

  // Offer form
  const offerForm = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      titleAr: "",
      description: "",
      discount: "",
      validUntil: "",
      imageUrl: "",
      isActive: true,
      displayOrder: "0",
    },
  });

  // Handle open offer dialog for adding/editing
  const handleOpenOfferDialog = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer);
      offerForm.reset({
        titleAr: offer.titleAr,
        description: offer.description,
        discount: offer.discount || "",
        validUntil: offer.validUntil || "",
        imageUrl: offer.imageUrl || "",
        isActive: offer.isActive,
        displayOrder: offer.displayOrder || "0",
      });
    } else {
      setEditingOffer(null);
      offerForm.reset({
        titleAr: "",
        description: "",
        discount: "",
        validUntil: "",
        imageUrl: "",
        isActive: true,
        displayOrder: "0",
      });
    }
    setIsOfferDialogOpen(true);
  };

  // Handle offer form submit
  const handleOfferSubmit = (data: OfferFormValues) => {
    // Transform empty strings to null for optional fields
    const transformedData = {
      ...data,
      discount: data.discount || null,
      validUntil: data.validUntil || null,
      imageUrl: data.imageUrl || null,
    };
    
    if (editingOffer) {
      updateOfferMutation.mutate({ id: editingOffer.id, data: transformedData });
    } else {
      createOfferMutation.mutate(transformedData);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const user = authData?.user as SafeUser;
  const contactForms = contactData?.data || [];
  const maintenanceRequests = maintenanceData?.data || [];
  const consultationRequests = consultationData?.data || [];
  const products = productsData?.data || [];
  const testimonials = testimonialsData?.data || [];
  const offers = offersData?.data || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم - كيان ميديكال</h1>
            <p className="text-sm text-muted-foreground">مرحباً {user?.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نماذج الاتصال</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-contact">{contactForms.length}</div>
              <p className="text-xs text-muted-foreground">إجمالي الرسائل المستلمة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات الصيانة</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-maintenance">{maintenanceRequests.length}</div>
              <p className="text-xs text-muted-foreground">طلبات الصيانة المسجلة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات الاستشارة</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-consultation">{consultationRequests.length}</div>
              <p className="text-xs text-muted-foreground">استشارات المنتجات</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
            <TabsTrigger value="products" data-testid="tab-products">المنتجات</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">الشهادات</TabsTrigger>
            <TabsTrigger value="offers" data-testid="tab-offers">العروض</TabsTrigger>
            <TabsTrigger value="hero" data-testid="tab-hero">Hero</TabsTrigger>
            <TabsTrigger value="features" data-testid="tab-features">المميزات</TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">الإحصائيات</TabsTrigger>
            <TabsTrigger value="contact" data-testid="tab-contact">نماذج الاتصال</TabsTrigger>
            <TabsTrigger value="maintenance" data-testid="tab-maintenance">طلبات الصيانة</TabsTrigger>
            <TabsTrigger value="consultation" data-testid="tab-consultation">طلبات الاستشارة</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>إدارة المنتجات</CardTitle>
                  <CardDescription>إضافة وتعديل وحذف المنتجات</CardDescription>
                </div>
                <Button onClick={() => handleOpenProductDialog()} data-testid="button-add-product">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة منتج جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد منتجات بعد</p>
                  ) : (
                    products.map((product) => (
                      <Card key={product.id} data-testid={`product-${product.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.nameAr}
                                className="w-24 h-24 object-cover rounded-md"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{product.nameAr}</h3>
                                  <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">{product.category}</Badge>
                                    <Badge variant="outline">{product.brand}</Badge>
                                    <Badge variant={product.isActive ? "default" : "secondary"}>
                                      {product.isActive ? "نشط" : "غير نشط"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleOpenProductDialog(product)}
                                    data-testid={`button-edit-product-${product.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setDeletingProductId(product.id)}
                                    data-testid={`button-delete-product-${product.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                              <p className="text-sm font-medium mt-2">المواصفات:</p>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {product.specifications.slice(0, 3).map((spec, idx) => (
                                  <li key={idx}>{spec}</li>
                                ))}
                                {product.specifications.length > 3 && (
                                  <li>...و {product.specifications.length - 3} مواصفة أخرى</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>إدارة الشهادات</CardTitle>
                  <CardDescription>إضافة وتعديل وحذف شهادات الأطباء</CardDescription>
                </div>
                <Button onClick={() => handleOpenTestimonialDialog()} data-testid="button-add-testimonial">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة شهادة جديدة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد شهادات بعد</p>
                  ) : (
                    testimonials.map((testimonial) => (
                      <Card key={testimonial.id} data-testid={`testimonial-${testimonial.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            {testimonial.photoUrl && (
                              <img 
                                src={testimonial.photoUrl} 
                                alt={testimonial.doctorName}
                                className="w-16 h-16 object-cover rounded-full"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold">{testimonial.doctorName}</h3>
                                  <p className="text-sm text-muted-foreground">{testimonial.specialization}</p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="outline">{testimonial.clinicName}</Badge>
                                    <Badge variant="outline">⭐ {testimonial.rating}</Badge>
                                    <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                                      {testimonial.isActive ? "نشط" : "غير نشط"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleOpenTestimonialDialog(testimonial)}
                                    data-testid={`button-edit-testimonial-${testimonial.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setDeletingTestimonialId(testimonial.id)}
                                    data-testid={`button-delete-testimonial-${testimonial.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-3 italic">"{testimonial.quote}"</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>إدارة العروض</CardTitle>
                  <CardDescription>إضافة وتعديل وحذف العروض والأخبار</CardDescription>
                </div>
                <Button onClick={() => handleOpenOfferDialog()} data-testid="button-add-offer">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة عرض جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد عروض بعد</p>
                  ) : (
                    offers.map((offer) => (
                      <Card key={offer.id} data-testid={`offer-${offer.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            {offer.imageUrl && (
                              <img 
                                src={offer.imageUrl} 
                                alt={offer.titleAr}
                                className="w-24 h-24 object-cover rounded-md"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold">{offer.titleAr}</h3>
                                  <div className="flex gap-2 mt-2">
                                    {offer.discount && (
                                      <Badge variant="outline">{offer.discount}</Badge>
                                    )}
                                    {offer.validUntil && (
                                      <Badge variant="outline">صالح حتى: {offer.validUntil}</Badge>
                                    )}
                                    <Badge variant={offer.isActive ? "default" : "secondary"}>
                                      {offer.isActive ? "نشط" : "غير نشط"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleOpenOfferDialog(offer)}
                                    data-testid={`button-edit-offer-${offer.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setDeletingOfferId(offer.id)}
                                    data-testid={`button-delete-offer-${offer.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-3">{offer.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>نماذج الاتصال</CardTitle>
                <CardDescription>الرسائل المستلمة من العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactForms.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد رسائل بعد</p>
                  ) : (
                    contactForms.map((form: any) => (
                      <Card key={form.id} data-testid={`contact-${form.id}`}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">الاسم</p>
                              <p className="text-sm text-muted-foreground">{form.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">البريد الإلكتروني</p>
                              <p className="text-sm text-muted-foreground">{form.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">رقم الهاتف</p>
                              <p className="text-sm text-muted-foreground">{form.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">التاريخ</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(form.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">الرسالة</p>
                              <p className="text-sm text-muted-foreground">{form.message}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>طلبات الصيانة</CardTitle>
                <CardDescription>طلبات صيانة الأجهزة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceRequests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد طلبات صيانة بعد</p>
                  ) : (
                    maintenanceRequests.map((request: any) => (
                      <Card key={request.id} data-testid={`maintenance-${request.id}`}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">اسم العميل</p>
                              <p className="text-sm text-muted-foreground">{request.clientName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">نوع الجهاز</p>
                              <p className="text-sm text-muted-foreground">{request.deviceType}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">رقم الهاتف</p>
                              <p className="text-sm text-muted-foreground">{request.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">موقع العيادة</p>
                              <p className="text-sm text-muted-foreground">{request.clinicLocation}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">وصف المشكلة</p>
                              <p className="text-sm text-muted-foreground">{request.issueDescription}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">التاريخ</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultation">
            <Card>
              <CardHeader>
                <CardTitle>طلبات الاستشارة</CardTitle>
                <CardDescription>استفسارات العملاء عن المنتجات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationRequests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد طلبات استشارة بعد</p>
                  ) : (
                    consultationRequests.map((request: any) => (
                      <Card key={request.id} data-testid={`consultation-${request.id}`}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">الاسم</p>
                              <p className="text-sm text-muted-foreground">{request.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">رقم الهاتف</p>
                              <p className="text-sm text-muted-foreground">{request.phone}</p>
                            </div>
                            {request.email && (
                              <div>
                                <p className="text-sm font-medium">البريد الإلكتروني</p>
                                <p className="text-sm text-muted-foreground">{request.email}</p>
                              </div>
                            )}
                            {request.productName && (
                              <div>
                                <p className="text-sm font-medium">المنتج</p>
                                <p className="text-sm text-muted-foreground">{request.productName}</p>
                              </div>
                            )}
                            {request.message && (
                              <div className="col-span-2">
                                <p className="text-sm font-medium">الرسالة</p>
                                <p className="text-sm text-muted-foreground">{request.message}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">التاريخ</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <AdminHeroTab />
          </TabsContent>

          <TabsContent value="features">
            <AdminFeaturesTab />
          </TabsContent>

          <TabsContent value="stats">
            <AdminStatsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "قم بتعديل بيانات المنتج" : "أدخل بيانات المنتج الجديد"}
            </DialogDescription>
          </DialogHeader>
          <Form {...productForm}>
            <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالعربية</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-product-name-ar" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم بالإنجليزية</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-product-name-en" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={productForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الفئة</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-product-category">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="clinic">عيادة</SelectItem>
                          <SelectItem value="hospital">مستشفى</SelectItem>
                          <SelectItem value="portable">محمول</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الماركة</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-product-brand" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموديل</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-product-model" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} data-testid="input-product-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={productForm.control}
                name="specifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المواصفات (مفصولة بفواصل)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="مثال: شاشة 15 إنش, تقنية 4D, ذاكرة 256 جيجا"
                        rows={3}
                        data-testid="input-product-specifications"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رابط الصورة</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-product-image" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={productForm.control}
                  name="priceInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>معلومات السعر</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="مثال: اتصل للسعر" data-testid="input-product-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={productForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                        data-testid="checkbox-product-active"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">نشط (يظهر للعملاء)</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsProductDialogOpen(false);
                    setEditingProduct(null);
                  }}
                  data-testid="button-cancel-product"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  data-testid="button-submit-product"
                >
                  {editingProduct ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation */}
      <AlertDialog open={!!deletingProductId} onOpenChange={(open) => !open && setDeletingProductId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المنتج بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProductId && deleteProductMutation.mutate(deletingProductId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Testimonial Dialog */}
      <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "تعديل الشهادة" : "إضافة شهادة جديدة"}</DialogTitle>
            <DialogDescription>
              {editingTestimonial ? "قم بتعديل بيانات الشهادة" : "أدخل بيانات الشهادة الجديدة"}
            </DialogDescription>
          </DialogHeader>
          <Form {...testimonialForm}>
            <form onSubmit={testimonialForm.handleSubmit(handleTestimonialSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={testimonialForm.control}
                  name="doctorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الطبيب</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-testimonial-doctor-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={testimonialForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التخصص</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="مثال: استشاري النساء والتوليد" data-testid="input-testimonial-specialization" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={testimonialForm.control}
                  name="clinicName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم العيادة / المستشفى</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-testimonial-clinic" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={testimonialForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التقييم</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-testimonial-rating">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={testimonialForm.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نص الشهادة</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="اكتب شهادة الطبيب هنا..."
                        rows={4}
                        data-testid="input-testimonial-quote"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={testimonialForm.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الصورة (اختياري)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-testimonial-photo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={testimonialForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                        data-testid="checkbox-testimonial-active"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">نشط (يظهر للعملاء)</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsTestimonialDialogOpen(false);
                    setEditingTestimonial(null);
                  }}
                  data-testid="button-cancel-testimonial"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                  data-testid="button-submit-testimonial"
                >
                  {editingTestimonial ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Testimonial Confirmation */}
      <AlertDialog open={!!deletingTestimonialId} onOpenChange={(open) => !open && setDeletingTestimonialId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الشهادة بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-testimonial">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTestimonialId && deleteTestimonialMutation.mutate(deletingTestimonialId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-testimonial"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Offer Dialog */}
      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}</DialogTitle>
            <DialogDescription>
              {editingOffer ? "قم بتعديل بيانات العرض" : "أدخل بيانات العرض الجديد"}
            </DialogDescription>
          </DialogHeader>
          <Form {...offerForm}>
            <form onSubmit={offerForm.handleSubmit(handleOfferSubmit)} className="space-y-4">
              <FormField
                control={offerForm.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان العرض</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-offer-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={offerForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف العرض</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="اكتب تفاصيل العرض هنا..."
                        rows={4}
                        data-testid="input-offer-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={offerForm.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الخصم (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="مثال: خصم 20%" data-testid="input-offer-discount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offerForm.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>صالح حتى (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="مثال: 31/12/2024" data-testid="input-offer-valid-until" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={offerForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط الصورة (اختياري)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-offer-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={offerForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                        data-testid="checkbox-offer-active"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">نشط (يظهر للعملاء)</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOfferDialogOpen(false);
                    setEditingOffer(null);
                  }}
                  data-testid="button-cancel-offer"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createOfferMutation.isPending || updateOfferMutation.isPending}
                  data-testid="button-submit-offer"
                >
                  {editingOffer ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Offer Confirmation */}
      <AlertDialog open={!!deletingOfferId} onOpenChange={(open) => !open && setDeletingOfferId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف العرض بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-offer">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingOfferId && deleteOfferMutation.mutate(deletingOfferId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-offer"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
