import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";
// --- FIX: Reverted to using the correct project aliases ---
import { insertContactFormSchema, type InsertContactForm } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
// --- End Fix ---

export default function Contact() {
  const { toast } = useToast();

  // Fetch site settings for dynamic contact info
  const { data: settingsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  const settings = settingsData?.data;

  const form = useForm<InsertContactForm>({
    resolver: zodResolver(insertContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "تم الإرسال بنجاح",
        description: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً",
      });
    },
    onError: (error: any) => {
      toast({
        title: "فشل الإرسال",
        description: error.message || "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactForm) => {
    mutation.mutate(data);
  };

  // Locations array is now built dynamically from settings
  // We need to check if settings exists before building the array
  const locations = settings ? [
    {
      title: "المقر الرئيسي",
      city: settings.addressShebin || "شيبين الكوم، المنوفية",
      address: "شارع الجلاء، وسط البلد", // This can be added to schema later if needed
      phone: settings.mainPhone || "+20 10 25253012",
      whatsapp: settings.whatsappLink || "https://wa.link/hn35ok",
      email: settings.email || "info@kayanmedical.com",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.3!2d31.0!3d30.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDMwJzAwLjAiTiAzMcKwMDAnMDAuMCJF!5e0!3m2!1sen!2seg!4v1234567890" // This can also be added to schema
    },
    {
      title: "المقر الثاني",
      city: settings.addressZayed || "الشيخ زايد، القاهرة",
      address: "طريق الواحات، البوابة الثانية", // This can be added to schema later if needed
      phone: settings.mainPhone || "+20 10 25253012",
      whatsapp: settings.whatsappLink || "https://wa.link/hn35ok",
      email: settings.email || "info@kayanmedical.com",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.3!2d31.0!3d30.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAwJzAwLjAiTiAzMcKwMDAnMDAuMCJF!5e0!3m2!1sen!2seg!4v1234567890"
    }
  ] : []; // Provide an empty array as a fallback while settings are loading

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12">
          <Badge className="mb-3 md:mb-4 text-xs sm:text-sm">تواصل معنا</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            نحن هنا لمساعدتك
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            تواصل معنا للحصول على استشارة مجانية أو لأي استفسار عن منتجاتنا وخدماتنا
          </p>
        </div>

        {/* Contact Form and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-12 mb-8 md:mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">أرسل لنا رسالة</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="أدخل اسمك الكامل" 
                              {...field}
                              data-testid="input-contact-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="name@example.com" 
                                {...field}
                                dir="ltr"
                                className="font-['Inter']"
                                data-testid="input-contact-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="01234567890" 
                                {...field}
                                dir="ltr"
                                className="font-['Inter']"
                                data-testid="input-contact-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رسالتك *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="كيف يمكننا مساعدتك؟"
                              className="min-h-[150px]"
                              {...field}
                              data-testid="textarea-contact-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base sm:text-lg min-h-12"
                      disabled={mutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {mutation.isPending ? "جاري الإرسال..." : "إرسال الرسالة"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">اتصل بنا</h3>
                    <a 
                      href={settings?.whatsappLink || "https://wa.link/hn35ok"} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground font-['Inter']" 
                      dir="ltr"
                      data-testid="link-contact-phone"
                    >
                      {settings?.mainPhone || "+20 10 25253012"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">البريد الإلكتروني</h3>
                    <a 
                      href={`mailto:${settings?.email || "info@kayanmedical.com"}`} 
                      className="text-muted-foreground hover:text-foreground font-['Inter']" 
                      dir="ltr"
                      data-testid="link-contact-email"
                    >
                      {settings?.email || "info@kayanmedical.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">ساعات العمل</h3>
                    <p className="text-muted-foreground text-sm">
                      السبت - الخميس: 9 ص - 6 م<br />
                      الجمعة: عطلة
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">تابعنا</h3>
                <div className="flex gap-3">
                  <a
                    href={settings?.facebookUrl || "https://facebook.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-md bg-muted hover-elevate active-elevate-2"
                    data-testid="link-contact-facebook"
                    aria-label="فيسبوك"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href={settings?.instagramUrl || "https://instagram.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-md bg-muted hover-elevate active-elevate-2"
                    data-testid="link-contact-instagram"
                    aria-label="إنستجرام"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Locations */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 md:mb-8 text-center">مواقعنا</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {locations.map((location, index) => (
              <Card key={index} className="overflow-hidden" data-testid={`location-card-${index}`}>
                <div className="aspect-video bg-muted">
                  <iframe
                    src={location.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={location.title}
                  />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" data-testid={`location-title-${index}`}>
                    {location.title}
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{location.city}</p>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <a 
                        href={location.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground font-['Inter']" 
                        dir="ltr"
                      >
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <a 
                        href={`mailto:${location.email}`} 
                        className="text-sm text-muted-foreground hover:text-foreground font-['Inter']" 
                        dir="ltr"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```eof