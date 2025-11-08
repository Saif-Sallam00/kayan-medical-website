import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LockKeyhole } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    console.log("Login form submitted:", data);
    setIsLoading(true);
    
    try {
      console.log("Sending login request...");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      console.log("Login response status:", res.status);
      const jsonData = await res.json();
      console.log("Login response data:", jsonData);
      
      if (!res.ok || !jsonData.success) {
        console.error("Login failed:", jsonData);
        toast({
          variant: "destructive",
          title: "فشل تسجيل الدخول",
          description: jsonData.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Login successful! Verifying session...");
      
      // CRITICAL: Verify session actually works by fetching /api/auth/me
      try {
        console.log("Fetching /api/auth/me to verify session...");
        const authResponse = await apiRequest("GET", "/api/auth/me");
        const authData = await authResponse.json();
        console.log("Session verified:", authData);
        
        if (!authData.success || !authData.user) {
          throw new Error("Session verification failed");
        }
        
        // Manually set the auth data in cache so Dashboard doesn't refetch
        queryClient.setQueryData(["/api/auth/me"], authData);
        console.log("Auth data cached!");
        
        // Show success toast
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً ${authData.user.name}`,
        });
        
        // Now safely redirect
        console.log("Redirecting to dashboard...");
        setLocation("/admin/dashboard");
        
      } catch (verifyError: any) {
        console.error("Session verification failed:", verifyError);
        toast({
          variant: "destructive",
          title: "فشل التحقق من الجلسة",
          description: "تم تسجيل الدخول ولكن لم نتمكن من التحقق. يرجى المحاولة مرة أخرى.",
        });
        setIsLoading(false);
        return;
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LockKeyhole className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">لوحة التحكم الإدارية</CardTitle>
          <CardDescription>قم بتسجيل الدخول للوصول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="faris@omniflowai.agency"
                        autoComplete="email"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
