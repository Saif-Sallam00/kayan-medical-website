import { useState } from "react";
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
import { Edit, Plus, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ObjectUploader } from "@/components/ObjectUploader";
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

const portfolioFormSchema = z.object({
  titleAr: z.string().min(3, "العنوان مطلوب"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "الصورة مطلوبة"),
  clientName: z.string().optional(),
  location: z.string().optional(),
  deliveryDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

export default function AdminPortfolioTab() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data } = useQuery<{ success: boolean; data: PortfolioItem[] }>({
    queryKey: ["/api/portfolio/all"],
  });

  const items = data?.data || [];

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      titleAr: "",
      description: "",
      imageUrl: "",
      clientName: "",
      location: "",
      deliveryDate: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PortfolioFormValues) => {
      return await apiRequest("POST", "/api/portfolio", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/all"] });
      toast({ title: "تم إضافة العنصر بنجاح" });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioFormValues }) => {
      return await apiRequest("PUT", `/api/portfolio/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/all"] });
      toast({ title: "تم تحديث العنصر بنجاح" });
      setIsDialogOpen(false);
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/portfolio/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/all"] });
      toast({ title: "تم حذف العنصر بنجاح" });
      setDeletingId(null);
    },
  });

  const handleOpenDialog = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        titleAr: item.titleAr,
        description: item.description || "",
        imageUrl: item.imageUrl,
        clientName: item.clientName || "",
        location: item.location || "",
        deliveryDate: item.deliveryDate || "",
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      form.reset({
        titleAr: "",
        description: "",
        imageUrl: "",
        clientName: "",
        location: "",
        deliveryDate: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: PortfolioFormValues) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>سجل التسليمات</CardTitle>
          <CardDescription>إدارة صور ومعلومات التسليمات السابقة للعملاء</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة تسليم جديد
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <img 
                  src={item.imageUrl} 
                  alt={item.titleAr}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold truncate">{item.titleAr}</h3>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenDialog(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeletingId(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {item.clientName && <p className="text-sm text-muted-foreground">العميل: {item.clientName}</p>}
                {item.location && <p className="text-sm text-muted-foreground">الموقع: {item.location}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "تعديل تسليم" : "إضافة تسليم جديد"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان (مثال: عيادة د. أحمد)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>صورة التسليم</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value && (
                          <img src={field.value} alt="Preview" className="h-32 w-full object-cover rounded-md" />
                        )}
                        <ObjectUploader
                          onGetUploadParameters={async () => {
                            const res = await apiRequest("POST", "/api/objects/upload", {});
                            const data = await res.json();
                            return { method: "PUT", url: data.uploadURL };
                          }}
                          onComplete={async (result) => {
                            if (result.successful[0]) {
                              const res = await apiRequest("POST", "/api/objects/set-acl", { imageUrl: result.successful[0].uploadURL });
                              const data = await res.json();
                              field.onChange(data.objectPath);
                              toast({ title: "تم رفع الصورة" });
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم العميل (اختياري)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموقع (اختياري)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تفاصيل إضافية</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">حفظ</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>سيتم حذف هذا العنصر نهائياً.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}