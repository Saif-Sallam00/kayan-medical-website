import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Feature } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const featureFormSchema = z.object({
  titleAr: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  descriptionAr: z.string().min(5, "الوصف يجب أن يكون 5 أحرف على الأقل"),
  icon: z.string().default("CheckCircle"),
  isActive: z.boolean().default(true),
  displayOrder: z.string().optional(),
});

type FeatureFormValues = z.infer<typeof featureFormSchema>;

export default function AdminFeaturesTab() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [deletingFeatureId, setDeletingFeatureId] = useState<string | null>(null);

  const { data: featuresData } = useQuery<{ success: boolean; data: Feature[] }>({
    queryKey: ["/api/features/all"],
  });

  const features = featuresData?.data || [];

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      titleAr: "",
      descriptionAr: "",
      icon: "CheckCircle",
      isActive: true,
      displayOrder: "0",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FeatureFormValues) => {
      return await apiRequest("POST", "/api/features", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({
        title: "تم إضافة الميزة بنجاح",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في إضافة الميزة",
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FeatureFormValues }) => {
      return await apiRequest("PUT", `/api/features/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({
        title: "تم تحديث الميزة بنجاح",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث الميزة",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/features/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({
        title: "تم حذف الميزة بنجاح",
      });
      setDeletingFeatureId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في حذف الميزة",
        description: error.message,
      });
    },
  });

  const handleOpenDialog = (feature?: Feature) => {
    if (feature) {
      setEditingFeature(feature);
      form.reset({
        titleAr: feature.titleAr,
        descriptionAr: feature.descriptionAr,
        icon: feature.icon || "CheckCircle",
        isActive: feature.isActive,
        displayOrder: feature.displayOrder || "0",
      });
    } else {
      setEditingFeature(null);
      form.reset({
        titleAr: "",
        descriptionAr: "",
        icon: "CheckCircle",
        isActive: true,
        displayOrder: "0",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: FeatureFormValues) => {
    if (editingFeature) {
      updateMutation.mutate({ id: editingFeature.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>إدارة المميزات</CardTitle>
          <CardDescription>إضافة وتعديل وحذف مميزات كيان ميديكال</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-feature">
          <Plus className="w-4 h-4 mr-2" />
          إضافة ميزة جديدة
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد مميزات بعد</p>
          ) : (
            features.map((feature) => (
              <Card key={feature.id} data-testid={`feature-${feature.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{feature.titleAr}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{feature.descriptionAr}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={feature.isActive ? "default" : "secondary"}>
                              {feature.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                            <Badge variant="outline">{feature.icon}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(feature)}
                            data-testid={`button-edit-feature-${feature.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingFeatureId(feature.id)}
                            data-testid={`button-delete-feature-${feature.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingFeature ? "تعديل الميزة" : "إضافة ميزة جديدة"}</DialogTitle>
            <DialogDescription>
              {editingFeature ? "قم بتعديل بيانات الميزة" : "أدخل بيانات الميزة الجديدة"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الميزة</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-feature-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف الميزة</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="اكتب تفاصيل الميزة..."
                        rows={3}
                        data-testid="input-feature-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>أيقونة (Lucide Icon name)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="CheckCircle" data-testid="input-feature-icon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ترتيب العرض</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || "0"} type="number" data-testid="input-feature-order" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                        data-testid="checkbox-feature-active"
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
                    setIsDialogOpen(false);
                    setEditingFeature(null);
                  }}
                  data-testid="button-cancel-feature"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-feature"
                >
                  {editingFeature ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingFeatureId} onOpenChange={(open) => !open && setDeletingFeatureId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الميزة بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-feature">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingFeatureId && deleteMutation.mutate(deletingFeatureId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-feature"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
