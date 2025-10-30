import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Clock, Shield, Headphones } from "lucide-react";
import { insertMaintenanceRequestSchema, type InsertMaintenanceRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Maintenance() {
  const { toast } = useToast();

  const form = useForm<InsertMaintenanceRequest>({
    resolver: zodResolver(insertMaintenanceRequestSchema),
    defaultValues: {
      clientName: "",
      deviceType: "",
      issueDescription: "",
      clinicLocation: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertMaintenanceRequest) => {
      return apiRequest("POST", "/api/maintenance", data);
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "تم الإرسال بنجاح",
        description: "تم إرسال طلب الصيانة بنجاح! سنتواصل معك قريباً",
      });
    },
    onError: (error: any) => {
      toast({
        title: "فشل الإرسال",
        description: error.message || "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMaintenanceRequest) => {
    mutation.mutate(data);
  };

  const services = [
    {
      icon: Wrench,
      title: "صيانة دورية",
      description: "صيانة منتظمة لضمان أداء مثالي لأجهزة السونار الخاصة بك"
    },
    {
      icon: Shield,
      title: "استبدال قطع الغيار",
      description: "قطع غيار أصلية من الشركات المصنعة مع ضمان الجودة"
    },
    {
      icon: Clock,
      title: "صيانة الطرازات القديمة",
      description: "دعم وصيانة الأجهزة القديمة بما في ذلك Toshiba Aplio"
    },
    {
      icon: Headphones,
      title: "دعم فني 24/7",
      description: "فريق دعم فني متاح على مدار الساعة لحل أي مشكلة فنية"
    }
  ];

  const deviceTypes = [
    "GE Voluson E10",
    "GE Logiq P9",
    "Philips ClearVue 650",
    "Samsung UGEO PT60A",
    "Mindray DC-70",
    "Toshiba Aplio",
    "أخرى"
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">خدماتنا</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            خدمات الصيانة والدعم الفني
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            نوفر خدمات صيانة شاملة لجميع أنواع أجهزة السونار مع ضمان الجودة والسرعة في الأداء
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover-elevate transition-all" data-testid={`service-card-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Maintenance Request Form */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                طلب صيانة
              </CardTitle>
              <p className="text-center text-muted-foreground">
                املأ النموذج وسنتواصل معك في أقرب وقت ممكن
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم العميل *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="أدخل اسمك الكامل" 
                              {...field} 
                              data-testid="input-client-name"
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
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="deviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الجهاز *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-device-type">
                                <SelectValue placeholder="اختر نوع الجهاز" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deviceTypes.map((device) => (
                                <SelectItem key={device} value={device}>
                                  {device}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clinicLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>موقع العيادة *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="المدينة والعنوان" 
                              {...field}
                              data-testid="input-clinic-location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="issueDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المشكلة *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="اشرح المشكلة التي تواجهها مع الجهاز بالتفصيل..."
                            className="min-h-[120px]"
                            {...field}
                            data-testid="textarea-issue-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg"
                    disabled={mutation.isPending}
                    data-testid="button-submit-maintenance"
                  >
                    {mutation.isPending ? "جاري الإرسال..." : "إرسال طلب الصيانة"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            هل تحتاج إلى دعم فوري؟
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            فريق الدعم الفني متاح على مدار الساعة للمساعدة
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+201234567890">
              <Button size="lg" variant="default" className="gap-2" data-testid="button-call-support">
                اتصل بالدعم الفني
              </Button>
            </a>
            <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-whatsapp-support">
                واتساب مباشر
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
