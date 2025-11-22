import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { SiteSettings } from "@shared/schema";

const settingsSchema = z.object({
  mainPhone: z.string().min(5, "رقم الهاتف مطلوب"),
  whatsappLink: z.string().url("رابط غير صحيح"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  addressShebin: z.string().min(5, "العنوان مطلوب"),
  addressZayed: z.string().min(5, "العنوان مطلوب"),
  facebookUrl: z.string().url("رابط غير صحيح"),
  instagramUrl: z.string().url("رابط غير صحيح"),
  // ✅ Validation for new field
  whatsappMessage: z.string().min(5, "الرسالة الافتتاحية مطلوبة"), 
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSiteSettingsTab() {
  const { toast } = useToast();

  const { data: settingsData, isLoading } = useQuery<{
    success: boolean;
    data: SiteSettings;
  }>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      mainPhone: "",
      whatsappLink: "",
      email: "",
      addressShebin: "",
      addressZayed: "",
      facebookUrl: "",
      instagramUrl: "",
      whatsappMessage: "", // ✅ Default
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (settingsData?.data) {
      form.reset({
        mainPhone: settingsData.data.mainPhone,
        whatsappLink: settingsData.data.whatsappLink,
        email: settingsData.data.email,
        addressShebin: settingsData.data.addressShebin,
        addressZayed: settingsData.data.addressZayed,
        facebookUrl: settingsData.data.facebookUrl,
        instagramUrl: settingsData.data.instagramUrl,
        whatsappMessage: settingsData.data.whatsappMessage || "مرحباً، أود الاستفسار عن جهاز:", // ✅ Load
      });
    }
  }, [settingsData, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      return await apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "تم تحديث الإعدادات بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث الإعدادات",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإعدادات العامة</CardTitle>
        <CardDescription>
          تعديل معلومات التواصل والروابط الخاصة بالموقع
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* WhatsApp Message Template Section */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-medium">إعدادات واتساب للمنتجات</h3>
              <FormField
                control={form.control}
                name="whatsappMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رسالة الاستفسار الافتراضية</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="مرحباً، أود الاستفسار عن جهاز:" 
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      سيتم إضافة اسم المنتج تلقائياً بعد هذا النص عند ضغط العميل على "اطلب الآن".
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mainPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف الرئيسي</FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط واتساب العام</FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="addressShebin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان المقر الأول</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressZayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان المقر الثاني</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط فيسبوك</FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط إنستجرام</FormLabel>
                    <FormControl>
                      <Input {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}