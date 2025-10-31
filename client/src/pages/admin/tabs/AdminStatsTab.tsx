import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Stat } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const statFormSchema = z.object({
  labelAr: z.string().min(3, "الوصف يجب أن يكون 3 أحرف على الأقل"),
  value: z.string().min(1, "القيمة مطلوبة"),
  icon: z.string().default("TrendingUp"),
  isActive: z.boolean().default(true),
  displayOrder: z.string().optional(),
});

type StatFormValues = z.infer<typeof statFormSchema>;

export default function AdminStatsTab() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [deletingStatId, setDeletingStatId] = useState<string | null>(null);

  const { data: statsData } = useQuery<{ success: boolean; data: Stat[] }>({
    queryKey: ["/api/stats/all"],
  });

  const stats = statsData?.data || [];

  const form = useForm<StatFormValues>({
    resolver: zodResolver(statFormSchema),
    defaultValues: {
      labelAr: "",
      value: "",
      icon: "TrendingUp",
      isActive: true,
      displayOrder: "0",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: StatFormValues) => {
      return await apiRequest("POST", "/api/stats", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "تم إضافة الإحصائية بنجاح",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في إضافة الإحصائية",
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StatFormValues }) => {
      return await apiRequest("PUT", `/api/stats/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "تم تحديث الإحصائية بنجاح",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث الإحصائية",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/stats/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "تم حذف الإحصائية بنجاح",
      });
      setDeletingStatId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "فشل في حذف الإحصائية",
        description: error.message,
      });
    },
  });

  const handleOpenDialog = (stat?: Stat) => {
    if (stat) {
      setEditingStat(stat);
      form.reset({
        labelAr: stat.labelAr,
        value: stat.value,
        icon: stat.icon || "TrendingUp",
        isActive: stat.isActive,
        displayOrder: stat.displayOrder || "0",
      });
    } else {
      setEditingStat(null);
      form.reset({
        labelAr: "",
        value: "",
        icon: "TrendingUp",
        isActive: true,
        displayOrder: "0",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: StatFormValues) => {
    if (editingStat) {
      updateMutation.mutate({ id: editingStat.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>إدارة الإحصائيات</CardTitle>
          <CardDescription>إضافة وتعديل وحذف إحصائيات كيان ميديكال</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-stat">
          <Plus className="w-4 h-4 mr-2" />
          إضافة إحصائية جديدة
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد إحصائيات بعد</p>
          ) : (
            stats.map((stat) => (
              <Card key={stat.id} data-testid={`stat-${stat.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-primary">{stat.value}</span>
                            <span className="text-lg font-medium">{stat.labelAr}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={stat.isActive ? "default" : "secondary"}>
                              {stat.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                            <Badge variant="outline">{stat.icon}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(stat)}
                            data-testid={`button-edit-stat-${stat.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingStatId(stat.id)}
                            data-testid={`button-delete-stat-${stat.id}`}
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
            <DialogTitle>{editingStat ? "تعديل الإحصائية" : "إضافة إحصائية جديدة"}</DialogTitle>
            <DialogDescription>
              {editingStat ? "قم بتعديل بيانات الإحصائية" : "أدخل بيانات الإحصائية الجديدة"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القيمة (مثال: 500+, 98%)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="500+" data-testid="input-stat-value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="labelAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="عميل سعيد" data-testid="input-stat-label" />
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
                      <Input {...field} placeholder="TrendingUp" data-testid="input-stat-icon" />
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
                      <Input {...field} value={field.value || "0"} type="number" data-testid="input-stat-order" />
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
                        data-testid="checkbox-stat-active"
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
                    setEditingStat(null);
                  }}
                  data-testid="button-cancel-stat"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-stat"
                >
                  {editingStat ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingStatId} onOpenChange={(open) => !open && setDeletingStatId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الإحصائية بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-stat">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingStatId && deleteMutation.mutate(deletingStatId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-stat"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
