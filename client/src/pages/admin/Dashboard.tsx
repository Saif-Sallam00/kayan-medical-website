import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut, Mail, Wrench, MessageSquare, BarChart3 } from "lucide-react";
import type { SafeUser } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is authenticated
  const { data: authData, isLoading: authLoading, error: authError } = useQuery<{ success: boolean; user: SafeUser }>({
    queryKey: ["/api/auth/me"],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (authError || !authData?.user)) {
      setLocation("/admin/login");
    }
  }, [authLoading, authError, authData, setLocation]);

  // Fetch contact forms
  const { data: contactData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/contact"],
    enabled: !!authData?.user,
  });

  // Fetch maintenance requests
  const { data: maintenanceData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/maintenance"],
    enabled: !!authData?.user,
  });

  // Fetch consultation requests
  const { data: consultationData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/consultation"],
    enabled: !!authData?.user,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريباً",
      });
      setLocation("/admin/login");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const user = authData?.user as SafeUser;
  const contactForms = contactData?.data || [];
  const maintenanceRequests = maintenanceData?.data || [];
  const consultationRequests = consultationData?.data || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم - كيان ميديكال</h1>
            <p className="text-sm text-muted-foreground">مرحباً {user?.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نماذج الاتصال</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-contact">{contactForms.length}</div>
              <p className="text-xs text-muted-foreground">إجمالي الرسائل المستلمة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات الصيانة</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-maintenance">{maintenanceRequests.length}</div>
              <p className="text-xs text-muted-foreground">طلبات الصيانة المسجلة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات الاستشارة</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-consultation">{consultationRequests.length}</div>
              <p className="text-xs text-muted-foreground">استشارات المنتجات</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="contact" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact" data-testid="tab-contact">نماذج الاتصال</TabsTrigger>
            <TabsTrigger value="maintenance" data-testid="tab-maintenance">طلبات الصيانة</TabsTrigger>
            <TabsTrigger value="consultation" data-testid="tab-consultation">طلبات الاستشارة</TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>نماذج الاتصال</CardTitle>
                <CardDescription>الرسائل المستلمة من العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactForms.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد رسائل بعد</p>
                  ) : (
                    contactForms.map((form: any) => (
                      <Card key={form.id} data-testid={`contact-${form.id}`}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">الاسم</p>
                              <p className="text-sm text-muted-foreground">{form.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">البريد الإلكتروني</p>
                              <p className="text-sm text-muted-foreground">{form.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">رقم الهاتف</p>
                              <p className="text-sm text-muted-foreground">{form.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">التاريخ</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(form.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">الرسالة</p>
                              <p className="text-sm text-muted-foreground">{form.message}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>طلبات الصيانة</CardTitle>
                <CardDescription>طلبات صيانة الأجهزة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceRequests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد طلبات صيانة بعد</p>
                  ) : (
                    maintenanceRequests.map((request: any) => (
                      <Card key={request.id} data-testid={`maintenance-${request.id}`}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">اسم العميل</p>
                              <p className="text-sm text-muted-foreground">{request.clientName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">نوع الجهاز</p>
                              <p className="text-sm text-muted-foreground">{request.deviceType}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">رقم الهاتف</p>
                              <p className="text-sm text-muted-foreground">{request.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">موقع العيادة</p>
                              <p className="text-sm text-muted-foreground">{request.clinicLocation}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium">وصف المشكلة</p>
                              <p className="text-sm text-muted-foreground">{request.issueDescription}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">التاريخ</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultation">
            <Card>
              <CardHeader>
                <CardTitle>طلبات الاستشارة</CardTitle>
                <CardDescription>استفسارات العملاء عن المنتجات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultationRequests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد طلبات استشارة بعد</p>
                  ) : (
                    consultationRequests.map((request: any) => (
                      <Card key={request.id} data-testid={`consultation-${request.id}`}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">الاسم</p>
                              <p className="text-sm text-muted-foreground">{request.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">رقم الهاتف</p>
                              <p className="text-sm text-muted-foreground">{request.phone}</p>
                            </div>
                            {request.email && (
                              <div>
                                <p className="text-sm font-medium">البريد الإلكتروني</p>
                                <p className="text-sm text-muted-foreground">{request.email}</p>
                              </div>
                            )}
                            {request.productName && (
                              <div>
                                <p className="text-sm font-medium">المنتج</p>
                                <p className="text-sm text-muted-foreground">{request.productName}</p>
                              </div>
                            )}
                            {request.message && (
                              <div className="col-span-2">
                                <p className="text-sm font-medium">الرسالة</p>
                                <p className="text-sm text-muted-foreground">{request.message}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">التاريخ</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
