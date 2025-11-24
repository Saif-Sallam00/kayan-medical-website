import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut, Edit, Trash2, Plus, X } from "lucide-react";
import type { SafeUser, Product, Testimonial, Offer } from "@shared/schema";
import AdminHeroTab from "./tabs/AdminHeroTab";
import AdminPortfolioTab from "./tabs/AdminPortfolioTab";
import AdminFeaturesTab from "./tabs/AdminFeaturesTab";
import AdminStatsTab from "./tabs/AdminStatsTab";
import AdminSiteSettingsTab from "./tabs/AdminSiteSettingsTab";
import AdminAboutTab from "./tabs/AdminAboutTab";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // ✅ Import Checkbox
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { ObjectUploader } from "@/components/ObjectUploader";

// --- SCHEMAS ---

const productFormSchema = z.object({
  nameAr: z.string().min(2, "الاسم بالعربية مطلوب"),
  nameEn: z.string().min(2, "الاسم بالإنجليزية مطلوب"),
  // ✅ UPDATED Category Schema
  category: z.string().min(1, "الفئة مطلوبة"),
  // ✅ NEW Type Schema
  type: z.string().optional(),
  brand: z.string().min(2, "الماركة مطلوبة"),
  model: z.string().min(1, "الموديل مطلوب"),
  description: z.string().min(10, "الوصف مطلوب"),
  specifications: z.string().min(1, "يجب إضافة المواصفات"),
  imageUrl: z.string().nullable().optional(),
  additionalImages: z.array(z.string()).optional().default([]),
  priceInfo: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  // ✅ NEW Sold Out Schema
  isSoldOut: z.boolean().default(false),
  displayOrder: z.string().optional(),
});

const testimonialFormSchema = z.object({
  doctorName: z.string().min(2, "الاسم مطلوب"),
  specialization: z.string().min(2, "التخصص مطلوب"),
  quote: z.string().min(10, "الشهادة يجب أن تكون 10 أحرف على الأقل"),
  rating: z.string().default("5"),
  clinicName: z.string().min(2, "اسم العيادة مطلوب"),
  photoUrl: z.string().nullable().optional(),
  teamImageUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.string().optional(),
});

const offerFormSchema = z.object({
  titleAr: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  discount: z.string().nullable().optional(),
  validUntil: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;
type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;
type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // --- STATE ---
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);

  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);

  // --- QUERIES ---
  const { data: authData, isLoading: authLoading, error: authError } = useQuery<{ success: boolean; user: SafeUser }>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    if (!authLoading && (authError || !authData?.user)) {
      setLocation("/admin/login");
    }
  }, [authLoading, authError, authData, setLocation]);

  const { data: contactData } = useQuery<{ success: boolean; data: any[] }>({ queryKey: ["/api/contact"], enabled: !!authData?.user });
  const { data: maintenanceData } = useQuery<{ success: boolean; data: any[] }>({ queryKey: ["/api/maintenance"], enabled: !!authData?.user });
  const { data: consultationData } = useQuery<{ success: boolean; data: any[] }>({ queryKey: ["/api/consultation"], enabled: !!authData?.user });
  const { data: productsData } = useQuery<{ success: boolean; data: Product[] }>({ queryKey: ["/api/products/all"], enabled: !!authData?.user });
  const { data: testimonialsData } = useQuery<{ success: boolean; data: Testimonial[] }>({ queryKey: ["/api/testimonials/all"], enabled: !!authData?.user });
  const { data: offersData } = useQuery<{ success: boolean; data: Offer[] }>({ queryKey: ["/api/offers/all"], enabled: !!authData?.user });

  // --- MUTATIONS ---
  const logoutMutation = useMutation({
    mutationFn: async () => { await apiRequest("POST", "/api/auth/logout", {}); },
    onSuccess: () => {
      queryClient.clear();
      toast({ title: "تم تسجيل الخروج" });
      setLocation("/admin/login");
    },
  });

  // Product Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const productData = {
        ...data,
        specifications: data.specifications.split(",").map((s) => s.trim()).filter(Boolean),
        additionalImages: data.additionalImages || [],
      };
      return await apiRequest("POST", "/api/products", productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/all"] });
      toast({ title: "تم إضافة المنتج بنجاح" });
      setIsProductDialogOpen(false);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormValues }) => {
      const productData = {
        ...data,
        specifications: data.specifications.split(",").map((s) => s.trim()).filter(Boolean),
        additionalImages: data.additionalImages || [],
      };
      return await apiRequest("PUT", `/api/products/${id}`, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/all"] });
      toast({ title: "تم تحديث المنتج بنجاح" });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => { return await apiRequest("DELETE", `/api/products/${id}`, {}); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/all"] });
      toast({ title: "تم حذف المنتج بنجاح" });
      setDeletingProductId(null);
    },
  });

  // Testimonial Mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: TestimonialFormValues) => { return await apiRequest("POST", "/api/testimonials", data); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      toast({ title: "تم إضافة الشهادة بنجاح" });
      setIsTestimonialDialogOpen(false);
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TestimonialFormValues }) => { return await apiRequest("PUT", `/api/testimonials/${id}`, data); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      toast({ title: "تم تحديث الشهادة بنجاح" });
      setIsTestimonialDialogOpen(false);
      setEditingTestimonial(null);
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => { return await apiRequest("DELETE", `/api/testimonials/${id}`, {}); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials/all"] });
      toast({ title: "تم حذف الشهادة بنجاح" });
      setDeletingTestimonialId(null);
    },
  });

  // Offer Mutations
  const createOfferMutation = useMutation({
    mutationFn: async (data: OfferFormValues) => { return await apiRequest("POST", "/api/offers", data); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers/all"] });
      toast({ title: "تم إضافة العرض بنجاح" });
      setIsOfferDialogOpen(false);
    },
  });

  const updateOfferMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OfferFormValues }) => { return await apiRequest("PUT", `/api/offers/${id}`, data); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers/all"] });
      toast({ title: "تم تحديث العرض بنجاح" });
      setIsOfferDialogOpen(false);
      setEditingOffer(null);
    },
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (id: string) => { return await apiRequest("DELETE", `/api/offers/${id}`, {}); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offers/all"] });
      toast({ title: "تم حذف العرض بنجاح" });
      setDeletingOfferId(null);
    },
  });

  // --- FORMS ---

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nameAr: "", nameEn: "", category: "bw", type: "portable", brand: "Mindray", model: "", description: "", specifications: "", imageUrl: "", additionalImages: [], priceInfo: "", isActive: true, isSoldOut: false, displayOrder: "0",
    },
  });

  const testimonialForm = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      doctorName: "", specialization: "", quote: "", rating: "5", clinicName: "", photoUrl: "", teamImageUrl: "", isActive: true, displayOrder: "0",
    },
  });

  const offerForm = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      titleAr: "", description: "", discount: "", validUntil: "", imageUrl: "", isActive: true, displayOrder: "0",
    },
  });

  // --- HANDLERS ---

  const handleOpenProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      productForm.reset({
        ...product,
        specifications: product.specifications.join(", "),
        imageUrl: product.imageUrl || "",
        additionalImages: product.additionalImages || [],
        priceInfo: product.priceInfo || "",
        displayOrder: product.displayOrder || "0",
        // ✅ Load new fields
        type: product.type || "portable",
        isSoldOut: product.isSoldOut || false,
      });
    } else {
      setEditingProduct(null);
      productForm.reset({ nameAr: "", nameEn: "", category: "bw", type: "portable", brand: "Mindray", model: "", description: "", specifications: "", imageUrl: "", additionalImages: [], priceInfo: "", isActive: true, isSoldOut: false, displayOrder: "0" });
    }
    setIsProductDialogOpen(true);
  };

  const handleProductSubmit = (data: ProductFormValues) => {
    if (editingProduct) updateProductMutation.mutate({ id: editingProduct.id, data });
    else createProductMutation.mutate(data);
  };

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
        teamImageUrl: testimonial.teamImageUrl || "", 
        isActive: testimonial.isActive,
        displayOrder: testimonial.displayOrder || "0",
      });
    } else {
      setEditingTestimonial(null);
      testimonialForm.reset({ doctorName: "", specialization: "", quote: "", rating: "5", clinicName: "", photoUrl: "", teamImageUrl: "", isActive: true, displayOrder: "0" });
    }
    setIsTestimonialDialogOpen(true);
  };

  const handleTestimonialSubmit = (data: TestimonialFormValues) => {
    if (editingTestimonial) updateTestimonialMutation.mutate({ id: editingTestimonial.id, data });
    else createTestimonialMutation.mutate(data);
  };

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
      offerForm.reset({ titleAr: "", description: "", discount: "", validUntil: "", imageUrl: "", isActive: true, displayOrder: "0" });
    }
    setIsOfferDialogOpen(true);
  };

  const handleOfferSubmit = (data: OfferFormValues) => {
    const transformedData = { ...data, discount: data.discount || null, validUntil: data.validUntil || null, imageUrl: data.imageUrl || null };
    if (editingOffer) updateOfferMutation.mutate({ id: editingOffer.id, data: transformedData });
    else createOfferMutation.mutate(transformedData);
  };

  if (authLoading) return <div>جاري التحميل...</div>;
  const user = authData?.user as SafeUser;
  const contactForms = contactData?.data || [];
  const maintenanceRequests = maintenanceData?.data || [];
  const consultationRequests = consultationData?.data || [];
  const products = productsData?.data || [];
  const testimonials = testimonialsData?.data || [];
  const offers = offersData?.data || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b bg-card">
        <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold">لوحة التحكم - كيان ميديكال</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">مرحباً {user?.name}</p>
          </div>
          <Button variant="outline" onClick={() => logoutMutation.mutate()} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </Button>
        </div>
      </header>

      <main className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card><CardHeader><CardTitle className="text-sm font-medium">نماذج الاتصال</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{contactForms.length}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">طلبات الصيانة</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{maintenanceRequests.length}</div></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">طلبات الاستشارة</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{consultationRequests.length}</div></CardContent></Card>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="w-full flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar p-1 sm:p-0">
            <TabsTrigger className="shrink-0" value="products">المنتجات</TabsTrigger>
            <TabsTrigger className="shrink-0" value="portfolio">سجل الأعمال</TabsTrigger>
            <TabsTrigger className="shrink-0" value="testimonials">الشهادات</TabsTrigger>
            <TabsTrigger className="shrink-0" value="offers">العروض</TabsTrigger>
            <TabsTrigger className="shrink-0" value="hero">Hero</TabsTrigger>
            <TabsTrigger className="shrink-0" value="features">المميزات</TabsTrigger>
            <TabsTrigger className="shrink-0" value="stats">الإحصائيات</TabsTrigger>
            <TabsTrigger className="shrink-0" value="contact">نماذج الاتصال</TabsTrigger>
            <TabsTrigger className="shrink-0" value="maintenance">طلبات الصيانة</TabsTrigger>
            <TabsTrigger className="shrink-0" value="consultation">طلبات الاستشارة</TabsTrigger>
            <TabsTrigger className="shrink-0" value="about">صفحة "من نحن"</TabsTrigger>
            <TabsTrigger className="shrink-0" value="settings">الإعدادات العامة</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div><CardTitle>إدارة المنتجات</CardTitle><CardDescription>إضافة وتعديل وحذف المنتجات</CardDescription></div>
                <Button onClick={() => handleOpenProductDialog()}><Plus className="w-4 h-4 mr-2" />إضافة منتج جديد</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <Card key={product.id}><CardContent className="pt-6"><div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      {product.imageUrl && <img src={product.imageUrl} alt={product.nameAr} className="w-full sm:w-24 h-auto sm:h-24 object-cover rounded-md" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{product.nameAr}</h3>
                            <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                            {product.isSoldOut && <Badge variant="destructive" className="mt-1">تم البيع</Badge>}
                          </div>
                          <div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => handleOpenProductDialog(product)}><Edit className="w-4 h-4" /></Button><Button variant="outline" size="icon" onClick={() => setDeletingProductId(product.id)}><Trash2 className="w-4 h-4" /></Button></div>
                        </div>
                      </div>
                    </div></CardContent></Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio"><AdminPortfolioTab /></TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>آراء العملاء</CardTitle><CardDescription>إدارة شهادات وتقييمات العملاء</CardDescription></div>
                <Button onClick={() => handleOpenTestimonialDialog()}><Plus className="w-4 h-4 mr-2" />إضافة شهادة</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map(t => (
                    <div key={t.id} className="flex justify-between p-4 border rounded items-center">
                      <div className="flex items-center gap-4">
                        {t.photoUrl && <img src={t.photoUrl} className="w-12 h-12 rounded-full object-cover" alt={t.doctorName} />}
                        <div><h3 className="font-bold">{t.doctorName}</h3><p className="text-sm text-muted-foreground">{t.clinicName}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleOpenTestimonialDialog(t)}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeletingTestimonialId(t.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>العروض</CardTitle></div>
                <Button onClick={() => handleOpenOfferDialog()}><Plus className="w-4 h-4 mr-2" />إضافة عرض</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offers.map(o => (
                    <div key={o.id} className="flex justify-between p-4 border rounded">
                      <div><h3 className="font-bold">{o.titleAr}</h3><p>{o.description}</p></div>
                      <div className="flex gap-2"><Button size="icon" variant="ghost" onClick={() => handleOpenOfferDialog(o)}><Edit className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => setDeletingOfferId(o.id)}><Trash2 className="w-4 h-4" /></Button></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OTHER TABS */}
          <TabsContent value="hero"><AdminHeroTab /></TabsContent>
          <TabsContent value="features"><AdminFeaturesTab /></TabsContent>
          <TabsContent value="stats"><AdminStatsTab /></TabsContent>
          <TabsContent value="contact"><div className="space-y-2">{contactForms.map(f => <Card key={f.id} className="p-4"><p className="font-bold">{f.name}</p><p>{f.email}</p><p>{f.message}</p></Card>)}</div></TabsContent>
          <TabsContent value="maintenance"><div className="space-y-2">{maintenanceRequests.map(m => <Card key={m.id} className="p-4"><p className="font-bold">{m.clientName}</p><p>{m.deviceType}</p><p>{m.issueDescription}</p></Card>)}</div></TabsContent>
          <TabsContent value="consultation"><div className="space-y-2">{consultationRequests.map(c => <Card key={c.id} className="p-4"><p className="font-bold">{c.name}</p><p>{c.phone}</p><p>{c.productName}</p></Card>)}</div></TabsContent>
          <TabsContent value="about"><AdminAboutTab /></TabsContent>
          <TabsContent value="settings"><AdminSiteSettingsTab /></TabsContent>
        </Tabs>

        {/* --- DIALOGS --- */}

        {/* Product Dialog - UPDATED */}
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent className="w-[calc(100vw-1rem)] sm:w-auto max-w-[min(100vw-1rem,42rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6" dir="rtl">
            <DialogHeader><DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle><DialogDescription>أدخل بيانات المنتج</DialogDescription></DialogHeader>
            <Form {...productForm}>
              <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={productForm.control} name="nameAr" render={({ field }) => (<FormItem><FormLabel>الاسم بالعربية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={productForm.control} name="nameEn" render={({ field }) => (<FormItem><FormLabel>الاسم بالإنجليزية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>

                {/* ✅ Category (Black & White, etc.) */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={productForm.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>تصنيف الجهاز</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bw">Black and white</SelectItem>
                          <SelectItem value="pulse">Pulse waves</SelectItem>
                          <SelectItem value="color">Color doppler</SelectItem>
                          <SelectItem value="4d">4D</SelectItem>
                          <SelectItem value="echo">Echo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  {/* ✅ Type (Portable/Built-in) */}
                  <FormField control={productForm.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الجهاز</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portable">Portable (محمول)</SelectItem>
                          <SelectItem value="builtin">Built-In (عيادة/مستشفى)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>

                {/* ✅ Brand Select */}
                <FormField control={productForm.control} name="brand" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الماركة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mindray">Mindray</SelectItem>
                        <SelectItem value="Sonoscape">Sonoscape</SelectItem>
                        <SelectItem value="Chison">Chison</SelectItem>
                        <SelectItem value="Edan">Edan</SelectItem>
                        <SelectItem value="Samsung">Samsung</SelectItem>
                        <SelectItem value="GE">GE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={productForm.control} name="model" render={({ field }) => (<FormItem><FormLabel>الموديل</FormLabel><Input {...field} /></FormItem>)} />
                <FormField control={productForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>الوصف</FormLabel><Textarea {...field} /></FormItem>)} />
                <FormField control={productForm.control} name="specifications" render={({ field }) => (<FormItem><FormLabel>المواصفات</FormLabel><Textarea {...field} /></FormItem>)} />

                {/* Image Uploader (Same as before) */}
                <FormField control={productForm.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>الصورة الرئيسية</FormLabel><FormControl><div className="space-y-2">{field.value && (<div className="relative w-24 h-24"><img src={field.value} alt="Main" className="w-full h-full object-cover rounded-md" /><Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 w-6 h-6 rounded-full" onClick={() => field.onChange("")}><X className="w-3 h-3" /></Button></div>)}<ObjectUploader onGetUploadParameters={async () => { const res = await apiRequest("POST", "/api/objects/upload", {}); const data = await res.json(); return { method: "PUT", url: data.uploadURL }; }} onComplete={async (result) => { if (result.successful[0]) { const aclRes = await apiRequest("POST", "/api/objects/set-acl", { imageUrl: result.successful[0].uploadURL }); const aclData = await aclRes.json(); field.onChange(aclData.objectPath); toast({ title: "تم رفع الصورة" }); } }} /></div></FormControl><FormMessage /></FormItem>)} />

                {/* Additional Images (Same as before) */}
                <div className="space-y-2">
                  <FormLabel>صور إضافية</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <FormField key={index} control={productForm.control} name="additionalImages" render={({ field }) => {
                          const currentImages = field.value || []; const currentImage = currentImages[index] || "";
                          const handleUpdateImage = (newUrl: string) => { const newImages = [...currentImages]; newImages[index] = newUrl; field.onChange(newImages); };
                          return (<FormItem className="border p-2 rounded-md"><FormLabel className="text-xs">صورة {index + 1}</FormLabel><FormControl><div className="space-y-2">{currentImage ? (<div className="relative w-full h-24"><img src={currentImage} alt={`Img ${index}`} className="w-full h-full object-cover rounded-md" /><Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 w-6 h-6 rounded-full" onClick={() => handleUpdateImage("")}><X className="w-3 h-3" /></Button></div>) : (<ObjectUploader onGetUploadParameters={async () => { const res = await apiRequest("POST", "/api/objects/upload", {}); const data = await res.json(); return { method: "PUT", url: data.uploadURL }; }} onComplete={async (result) => { if (result.successful[0]) { const aclRes = await apiRequest("POST", "/api/objects/set-acl", { imageUrl: result.successful[0].uploadURL }); const aclData = await aclRes.json(); handleUpdateImage(aclData.objectPath); } }} />)}</div></FormControl></FormItem>);
                        }} />
                    ))}
                  </div>
                </div>

                {/* ✅ Sold Out Checkbox */}
                <FormField
                  control={productForm.control}
                  name="isSoldOut"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none mr-2">
                        <FormLabel>تم البيع (Sold Out)</FormLabel>
                        <FormDescription>
                          حدد هذا الخيار إذا نفدت الكمية. سيظهر للعملاء علامة "تم البيع".
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>إلغاء</Button><Button type="submit">{editingProduct ? "تحديث" : "إضافة"}</Button></div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Testimonial Dialog - FIXED */}
        <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader><DialogTitle>{editingTestimonial ? "تعديل التقييم" : "إضافة تقييم جديد"}</DialogTitle><DialogDescription>أدخل بيانات الطبيب وصورة التسليم لزيادة المصداقية</DialogDescription></DialogHeader>
            <Form {...testimonialForm}>
              <form onSubmit={testimonialForm.handleSubmit(handleTestimonialSubmit)} className="space-y-6 py-4">
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">الصور والمرفقات</h3>
                  <div className="flex gap-4 items-start">
                    <FormField control={testimonialForm.control} name="photoUrl" render={({ field }) => (
                        <FormItem className="flex-1"><FormLabel className="text-xs">الصورة الشخصية (Avatar)</FormLabel><FormControl><div className="space-y-2"><div className="flex items-center gap-4">{field.value ? (<div className="relative w-16 h-16"><img src={field.value} alt="Avatar" className="w-full h-full object-cover rounded-full border" /><Button type="button" variant="destructive" size="icon" className="absolute -top-1 -right-1 w-5 h-5 rounded-full" onClick={() => field.onChange("")}><X className="w-3 h-3" /></Button></div>) : (<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center border border-dashed"><span className="text-xs text-muted-foreground">لا يوجد</span></div>)}<div className="flex-1"><ObjectUploader onGetUploadParameters={async () => { const res = await apiRequest("POST", "/api/objects/upload", {}); const data = await res.json(); return { method: "PUT", url: data.uploadURL }; }} onComplete={async (result) => { if (result.successful[0]) { const aclRes = await apiRequest("POST", "/api/objects/set-acl", { imageUrl: result.successful[0].uploadURL }); const aclData = await aclRes.json(); field.onChange(aclData.objectPath); toast({ title: "تم رفع الصورة" }); } }} /></div></div></div></FormControl></FormItem>)} />
                  </div>
                  <FormField control={testimonialForm.control} name="teamImageUrl" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-bold text-primary">صورة التسليم (مع الفريق والجهاز)</FormLabel><FormControl><div className="space-y-2">{field.value && (<div className="relative w-full h-40"><img src={field.value} alt="Team" className="w-full h-full object-cover rounded-md border" /><Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => field.onChange("")}><Trash2 className="w-4 h-4" /></Button></div>)}{!field.value && (<div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center bg-background hover:bg-accent/50 transition-colors"><p className="text-sm text-muted-foreground">اضغط لرفع صورة التسليم</p><ObjectUploader onGetUploadParameters={async () => { const res = await apiRequest("POST", "/api/objects/upload", {}); const data = await res.json(); return { method: "PUT", url: data.uploadURL }; }} onComplete={async (result) => { if (result.successful[0]) { const aclRes = await apiRequest("POST", "/api/objects/set-acl", { imageUrl: result.successful[0].uploadURL }); const aclData = await aclRes.json(); field.onChange(aclData.objectPath); toast({ title: "تم رفع صورة التسليم" }); } }} /></div>)}</div></FormControl></FormItem>)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={testimonialForm.control} name="doctorName" render={({ field }) => (<FormItem><FormLabel>اسم الطبيب</FormLabel><FormControl><Input {...field} placeholder="د. محمد علي" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={testimonialForm.control} name="specialization" render={({ field }) => (<FormItem><FormLabel>التخصص</FormLabel><FormControl><Input {...field} placeholder="نساء وتوليد" /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={testimonialForm.control} name="clinicName" render={({ field }) => (<FormItem><FormLabel>اسم العيادة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={testimonialForm.control} name="rating" render={({ field }) => (<FormItem><FormLabel>التقييم</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="5">5 نجوم</SelectItem><SelectItem value="4">4 نجوم</SelectItem><SelectItem value="3">3 نجوم</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                <FormField control={testimonialForm.control} name="quote" render={({ field }) => (<FormItem><FormLabel>نص الشهادة</FormLabel><FormControl><Textarea {...field} className="h-24 resize-none" /></FormControl><FormMessage /></FormItem>)} />
                <div className="flex justify-end gap-3 pt-4 border-t"><Button type="button" variant="outline" onClick={() => setIsTestimonialDialogOpen(false)}>إلغاء</Button><Button type="submit" className="min-w-[100px]">{editingTestimonial ? "حفظ التغييرات" : "إضافة الشهادة"}</Button></div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Offer Dialog */}
        <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}><DialogContent><Form {...offerForm}><form onSubmit={offerForm.handleSubmit(handleOfferSubmit)}><FormField control={offerForm.control} name="titleAr" render={({ field }) => <Input {...field} placeholder="عنوان العرض" />} /><Button type="submit">حفظ</Button></form></Form></DialogContent></Dialog>

        {/* DELETE ALERTS */}
        <AlertDialog open={!!deletingProductId} onOpenChange={(open) => !open && setDeletingProductId(null)}>
          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>هل أنت متأكد من حذف المنتج؟</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deletingProductId && deleteProductMutation.mutate(deletingProductId)}>حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deletingTestimonialId} onOpenChange={(open) => !open && setDeletingTestimonialId(null)}>
          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>هل أنت متأكد من حذف الشهادة؟</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deletingTestimonialId && deleteTestimonialMutation.mutate(deletingTestimonialId)}>حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deletingOfferId} onOpenChange={(open) => !open && setDeletingOfferId(null)}>
          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>هل أنت متأكد من حذف العرض؟</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => deletingOfferId && deleteOfferMutation.mutate(deletingOfferId)}>حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>

      </main>
    </div>
  );
}