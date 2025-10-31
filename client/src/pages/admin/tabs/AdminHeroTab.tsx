import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit } from "lucide-react";
import type { HeroSection } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const heroFormSchema = z.object({
  titleAr: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  subtitleAr: z.string().min(10, "العنوان الفرعي يجب أن يكون 10 أحرف على الأقل"),
  ctaText: z.string().nullable().optional(),
  backgroundImageUrl: z.string().nullable().optional(),
});

type HeroFormValues = z.infer<typeof heroFormSchema>;

export default function AdminHeroTab() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: heroData } = useQuery<{ success: boolean; data: HeroSection[] }>({
    queryKey: ["/api/hero-sections/all"],
  });

  const heroSection = heroData?.data?.[0];

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      titleAr: "",
      subtitleAr: "",
      ctaText: "",
      backgroundImageUrl: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: HeroFormValues) => {
      if (!heroSection) throw new Error("Hero section not found");
      
      const transformedData = {
        ...data,
        ctaText: data.ctaText || null,
        backgroundImageUrl: data.backgroundImageUrl || null,
      };
      
      return await apiRequest("PUT", `/api/hero-sections/${heroSection.id}`, transformedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-sections/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hero-sections"] });
      toast({
        title: "تم تحديث Hero Section بنجاح",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث Hero Section",
        description: error.message,
      });
    },
  });

  const handleOpenDialog = () => {
    if (heroSection) {
      form.reset({
        titleAr: heroSection.titleAr,
        subtitleAr: heroSection.subtitleAr,
        ctaText: heroSection.ctaText || "",
        backgroundImageUrl: heroSection.backgroundImageUrl || "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: HeroFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>إدارة Hero Section</CardTitle>
          <CardDescription>تعديل محتوى القسم الرئيسي في الصفحة الرئيسية</CardDescription>
        </div>
        {heroSection && (
          <Button onClick={handleOpenDialog} data-testid="button-edit-hero">
            <Edit className="w-4 h-4 mr-2" />
            تعديل
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!heroSection ? (
          <p className="text-center text-muted-foreground py-8">لا يوجد Hero Section بعد</p>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-card" data-testid="hero-preview">
              <h3 className="text-xl font-bold mb-2">{heroSection.titleAr}</h3>
              <p className="text-muted-foreground mb-2">{heroSection.subtitleAr}</p>
              {heroSection.ctaText && (
                <p className="text-sm"><strong>CTA:</strong> {heroSection.ctaText}</p>
              )}
              {heroSection.backgroundImageUrl && (
                <div className="mt-3">
                  <img 
                    src={heroSection.backgroundImageUrl} 
                    alt="Hero" 
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل Hero Section</DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات القسم الرئيسي
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان الرئيسي</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-hero-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان الفرعي</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="اكتب العنوان الفرعي..."
                        rows={3}
                        data-testid="input-hero-subtitle"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ctaText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نص الزر (اختياري)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="مثال: اطلب جهازك الآن" data-testid="input-hero-cta" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backgroundImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط صورة الخلفية (اختياري)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-hero-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel-hero"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-submit-hero"
                >
                  تحديث
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
