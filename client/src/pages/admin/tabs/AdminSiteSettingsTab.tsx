import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

// Basic schema for the form
const settingsFormSchema = z.object({
  mainPhone: z.string(),
  whatsappLink: z.string().url(),
  email: z.string().email(),
  addressShebin: z.string(),
  addressZayed: z.string(),
  facebookUrl: z.string().url(),
  instagramUrl: z.string().url(),
});
type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function AdminSiteSettingsTab() {
  const { toast } = useToast();

  const { data: settingsData, isLoading } = useQuery<{ success: boolean; data: SettingsFormValues }>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      mainPhone: "",
      whatsappLink: "",
      email: "",
      addressShebin: "",
      addressZayed: "",
      facebookUrl: "",
      instagramUrl: "",
    },
  });

  useEffect(() => {
    if (settingsData?.data) {
      form.reset(settingsData.data);
    }
  }, [settingsData, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      return await apiRequest("PUT", `/api/settings`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "تم تحديث الإعدادات بنجاح" });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل تحديث الإعدادات",
        description: error.message,
      });
    },
  });

  const handleSubmit = (data: SettingsFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الموقع العامة</CardTitle>
        <CardDescription>تعديل معلومات التواصل والروابط العامة للموقع.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>جاري تحميل الإعدادات...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mainPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف الرئيسي</FormLabel>
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
                <FormField
                  control={form.control}
                  name="whatsappLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رابط الواتساب</FormLabel>
                      <FormControl>
                        <Input {...field} dir="ltr" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressShebin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان (شيبين الكوم)</FormLabel>
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
                      <FormLabel>عنوان (الشيخ زايد)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>رابط انستجرام</FormLabel>
                      <FormControl>
                        <Input {...field} dir="ltr" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}