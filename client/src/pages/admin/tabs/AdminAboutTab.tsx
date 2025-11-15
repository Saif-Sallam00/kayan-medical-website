import { useState, useEffect } from "react";
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
import { Edit, Trash2, Plus } from "lucide-react";
import type { TeamMember } from "@shared/schema";
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

// Schema for Vision/Mission form
const aboutFormSchema = z.object({
  visionAr: z.string().min(10, "الرؤية مطلوبة"),
  missionAr: z.string().min(10, "المهمة مطلوبة"),
});
type AboutFormValues = z.infer<typeof aboutFormSchema>;

// Schema for Team Member form
const memberFormSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  role: z.string().min(2, "الدور مطلوب"),
  description: z.string().min(5, "الوصف مطلوب"),
  displayOrder: z.string().optional(),
  isActive: z.boolean().default(true),
});
type MemberFormValues = z.infer<typeof memberFormSchema>;

// --- Component for Vision/Mission ---
function AboutContentEditor() {
  const { toast } = useToast();
  const { data, isLoading } = useQuery<{
    success: boolean;
    data: AboutFormValues;
  }>({
    queryKey: ["/api/about-page"],
  });

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: { visionAr: "", missionAr: "" },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset(data.data);
    }
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: AboutFormValues) =>
      apiRequest("PUT", "/api/about-page", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about-page"] });
      toast({ title: "تم تحديث محتوى الصفحة" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>محتوى صفحة "من نحن"</CardTitle>
        <CardDescription>تعديل نصوص الرؤية والمهمة.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="visionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رؤيتنا</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="missionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مهمتنا</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updateMutation.isPending}>
                حفظ
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

// --- Component for Team Members ---
function TeamMembersEditor() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const { data: membersData } = useQuery<{
    success: boolean;
    data: TeamMember[];
  }>({
    queryKey: ["/api/team-members/all"],
  });
  const members = membersData?.data || [];

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      description: "",
      displayOrder: "0",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: MemberFormValues) =>
      apiRequest("POST", "/api/team-members", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members/all"] });
      toast({ title: "تم إضافة عضو الفريق" });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MemberFormValues }) =>
      apiRequest("PUT", `/api/team-members/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members/all"] });
      toast({ title: "تم تحديث عضو الفريق" });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      apiRequest("DELETE", `/api/team-members/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members/all"] });
      toast({ title: "تم حذف عضو الفريق" });
      setDeletingMemberId(null);
    },
  });

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      form.reset(member);
    } else {
      setEditingMember(null);
      form.reset({
        name: "",
        role: "",
        description: "",
        displayOrder: "0",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: MemberFormValues) => {
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>إدارة أعضاء الفريق</CardTitle>
          <CardDescription>إضافة وتعديل وحذف أعضاء الفريق.</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة عضو جديد
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <Card key={member.id} data-testid={`member-${member.id}`}>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {member.description}
                  </p>
                  <Badge
                    variant={member.isActive ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {member.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeletingMemberId(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Dialog for Add/Edit Member */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "تعديل عضو" : "إضافة عضو جديد"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الدور (المسمى الوظيفي)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
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
                      <Input {...field} type="number" />
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
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">نشط (يظهر للعملاء)</FormLabel>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingMemberId}
        onOpenChange={(open) => !open && setDeletingMemberId(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا العضو. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingMemberId && deleteMutation.mutate(deletingMemberId)
              }
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

// --- Main Tab Component ---
export default function AdminAboutTab() {
  return (
    <div className="space-y-6">
      <AboutContentEditor />
      <TeamMembersEditor />
    </div>
  );
}
