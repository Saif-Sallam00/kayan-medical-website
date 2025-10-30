import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@shared/schema";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Sample products data
  const products: Product[] = [
    {
      id: "1",
      nameAr: "جهاز سونار GE Voluson E10",
      nameEn: "GE Voluson E10",
      category: "hospital",
      brand: "GE Healthcare",
      model: "Voluson E10",
      description: "جهاز سونار متقدم مع تكنولوجيا 4D Imaging لتقديم أعلى جودة صور للحمل وتقييم الجنين",
      specifications: [
        "تقنية 4D HD Live الحصرية",
        "معالج صور فائق السرعة",
        "نظام تصوير ثلاثي ورباعي الأبعاد"
      ],
      imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80",
      priceInfo: "استفسر عن السعر"
    },
    {
      id: "2",
      nameAr: "جهاز سونار Philips ClearVue",
      nameEn: "Philips ClearVue 650",
      category: "clinic",
      brand: "Philips",
      model: "ClearVue 650",
      description: "جهاز سونار دقيق ومتعدد الاستخدامات للاستخدامات الطبية المتقدمة في العيادات",
      specifications: [
        "شاشة LED عالية الوضوح 19 بوصة",
        "بطارية قابلة للشحن لسهولة التنقل",
        "واجهة مستخدم بسيطة وسهلة"
      ],
      imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
      priceInfo: "استفسر عن السعر"
    },
    {
      id: "3",
      nameAr: "جهاز سونار Samsung UGEO PT60A",
      nameEn: "Samsung UGEO PT60A",
      category: "portable",
      brand: "Samsung",
      model: "UGEO PT60A",
      description: "جهاز سونار محمول خفيف الوزن مع تقنيات تصوير متقدمة للاستخدام في أي مكان",
      specifications: [
        "وزن خفيف (5.9 كجم فقط)",
        "بطارية تدوم 4 ساعات متواصلة",
        "شاشة لمس 15.6 بوصة"
      ],
      imageUrl: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80",
      priceInfo: "عرض خاص"
    },
    {
      id: "4",
      nameAr: "جهاز سونار Mindray DC-70",
      nameEn: "Mindray DC-70",
      category: "hospital",
      brand: "Mindray",
      model: "DC-70",
      description: "نظام سونار متطور للتطبيقات السريرية الشاملة مع أداء تصوير استثنائي",
      specifications: [
        "تقنية Zone Sonography",
        "معالجة صور فائقة الدقة",
        "شاشة LED عالية الدقة 21.5 بوصة"
      ],
      imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80",
      priceInfo: "استفسر عن السعر"
    },
    {
      id: "5",
      nameAr: "جهاز سونار GE Logiq P9",
      nameEn: "GE Logiq P9",
      category: "clinic",
      brand: "GE Healthcare",
      model: "Logiq P9",
      description: "جهاز سونار عالي الأداء مصمم للحصول على صور واضحة في جميع التطبيقات",
      specifications: [
        "تقنية XDclear للحد من الضوضاء",
        "مجسات متعددة التطبيقات",
        "نظام تصوير دوبلر ملون متقدم"
      ],
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
      priceInfo: "استفسر عن السعر"
    },
    {
      id: "6",
      nameAr: "جهاز سونار محمول Clarius",
      nameEn: "Clarius Wireless Scanner",
      category: "portable",
      brand: "Clarius",
      model: "Wireless Scanner",
      description: "جهاز سونار لاسلكي فائق الحداثة يعمل مع الهواتف الذكية والأجهزة اللوحية",
      specifications: [
        "اتصال لاسلكي عبر Wi-Fi",
        "يعمل مع أجهزة iOS و Android",
        "صغير الحجم وسهل الحمل"
      ],
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
      priceInfo: "عرض خاص"
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">منتجاتنا</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            أجهزة السونار الطبية
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            اختر من مجموعة واسعة من أجهزة السونار عالية الجودة من أفضل العلامات التجارية العالمية
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-12">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-auto p-1" data-testid="tabs-category">
              <TabsTrigger value="all" className="text-sm md:text-base py-3" data-testid="tab-all">
                جميع الأجهزة
              </TabsTrigger>
              <TabsTrigger value="clinic" className="text-sm md:text-base py-3" data-testid="tab-clinic">
                أجهزة العيادات
              </TabsTrigger>
              <TabsTrigger value="hospital" className="text-sm md:text-base py-3" data-testid="tab-hospital">
                أجهزة المستشفيات
              </TabsTrigger>
              <TabsTrigger value="portable" className="text-sm md:text-base py-3" data-testid="tab-portable">
                أجهزة محمولة
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">لا توجد منتجات في هذه الفئة حالياً</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-card border border-card-border rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            لم تجد ما تبحث عنه؟
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            تواصل معنا للحصول على استشارة مجانية ومساعدتك في اختيار الجهاز المناسب لاحتياجاتك
          </p>
          <Button size="lg" className="gap-2" data-testid="button-contact-sales">
            تواصل مع فريق المبيعات
          </Button>
        </div>
      </div>
    </div>
  );
}
