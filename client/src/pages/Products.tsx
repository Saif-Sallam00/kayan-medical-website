import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { Search } from "lucide-react"; // Icon for empty state

export default function Products() {
  // Default to "all"
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery<{ success: boolean; data: Product[] }>({
    queryKey: ["/api/products"],
    retry: 2,
  });

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "خطأ في تحميل المنتجات",
        description: "حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.",
      });
    }
  }, [isError, toast]);

  // ✅ Filter Logic based on new categories
  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    if (selectedCategory === "all") return data.data;
    return data.data.filter(p => p.category === selectedCategory);
  }, [data, selectedCategory]);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">منتجاتنا</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة واسعة من أجهزة السونار المتطورة لتلبية كافة احتياجاتك الطبية
          </p>
        </div>

        {/* ✅ NEW TABS CATEGORIES */}
        <Tabs defaultValue="all" className="w-full mb-8" onValueChange={setSelectedCategory}>
          <div className="flex justify-center">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-2">
              <TabsTrigger value="all" className="px-4 py-2">جميع الأجهزة</TabsTrigger>
              <TabsTrigger value="bw" className="px-4 py-2">Black & White</TabsTrigger>
              <TabsTrigger value="pulse" className="px-4 py-2">Pulse Waves</TabsTrigger>
              <TabsTrigger value="color" className="px-4 py-2">Color Doppler</TabsTrigger>
              <TabsTrigger value="4d" className="px-4 py-2">4D Ultrasound</TabsTrigger>
              <TabsTrigger value="echo" className="px-4 py-2">Echo</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                <div className="h-48 bg-muted rounded-md animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
            <div className="flex justify-center mb-4">
              <Search className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">لا توجد منتجات في هذه الفئة حالياً</h3>
            <p className="text-sm text-muted-foreground mt-1">يرجى التحقق من الفئات الأخرى</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 md:mt-16 bg-primary/5 border border-primary/10 rounded-lg p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-primary">
            لم تجد ما تبحث عنه؟
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
            تواصل معنا للحصول على استشارة مجانية ومساعدتك في اختيار الجهاز المناسب لاحتياجاتك وميزانيتك.
          </p>
          <Button size="lg" className="font-bold px-8" onClick={() => window.location.href = '/contact'}>
            تواصل معنا
          </Button>
        </div>
      </div>
    </div>
  );
}