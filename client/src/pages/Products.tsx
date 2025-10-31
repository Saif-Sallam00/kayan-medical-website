import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery<{ success: boolean; data: Product[] }>({
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

  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    if (selectedCategory === "all") return data.data;
    return data.data.filter(p => p.category === selectedCategory);
  }, [data, selectedCategory]);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-8 md:mb-12">
          <Badge className="mb-3 md:mb-4 text-xs sm:text-sm">منتجاتنا</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            أجهزة السونار الطبية
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            اختر من مجموعة واسعة من أجهزة السونار عالية الجودة من أفضل العلامات التجارية العالمية
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 md:mb-12">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 sm:grid-cols-4 h-auto p-1 gap-1" data-testid="tabs-category">
              <TabsTrigger value="all" className="text-xs sm:text-sm md:text-base py-2.5 sm:py-3" data-testid="tab-all">
                جميع الأجهزة
              </TabsTrigger>
              <TabsTrigger value="clinic" className="text-xs sm:text-sm md:text-base py-2.5 sm:py-3" data-testid="tab-clinic">
                العيادات
              </TabsTrigger>
              <TabsTrigger value="hospital" className="text-xs sm:text-sm md:text-base py-2.5 sm:py-3" data-testid="tab-hospital">شراء</TabsTrigger>
              <TabsTrigger value="portable" className="text-xs sm:text-sm md:text-base py-2.5 sm:py-3" data-testid="tab-portable">بيع</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive text-base sm:text-lg mb-4">فشل في تحميل المنتجات</p>
            <Button onClick={() => window.location.reload()} data-testid="button-retry">
              إعادة المحاولة
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-card-border rounded-lg p-4 animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-base sm:text-lg">لا توجد منتجات في هذه الفئة حالياً</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 md:mt-16 bg-card border border-card-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            لم تجد ما تبحث عنه؟
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
            تواصل معنا للحصول على استشارة مجانية ومساعدتك في اختيار الجهاز المناسب لاحتياجاتك
          </p>
          <Button size="lg" className="gap-2 w-full sm:w-auto min-h-12" data-testid="button-contact-sales">
            تواصل مع فريق المبيعات
          </Button>
        </div>
      </div>
    </div>
  );
}
