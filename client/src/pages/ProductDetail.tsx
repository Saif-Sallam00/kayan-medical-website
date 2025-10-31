import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle2, ArrowRight, Building2, Laptop } from "lucide-react";
import { getProductById } from "@/data/products";
import ultrasoundMachineUrl from "@/assets/ultrasound-machine.png";

export default function ProductDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const product = id ? getProductById(id) : undefined;

  const whatsappLink = "https://wa.link/hn35ok";
  const phoneNumber = "+20 10 25253012";

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Button onClick={() => setLocation("/products")} data-testid="button-back-products">
            العودة للمنتجات
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hospital':
        return <Building2 className="w-4 h-4" />;
      case 'portable':
        return <Laptop className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hospital':
        return 'مستشفيات';
      case 'clinic':
        return 'عيادات';
      case 'portable':
        return 'محمول';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 gap-2" 
          onClick={() => setLocation("/products")}
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمنتجات
        </Button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Image */}
          <div className="order-2 lg:order-1">
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="aspect-square flex items-center justify-center">
                <img 
                  src={product.imageUrl || ultrasoundMachineUrl}
                  alt={product.nameAr}
                  className="w-full h-full object-cover rounded-lg"
                  data-testid="image-product"
                />
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1" data-testid="badge-brand">
                {product.brand}
              </Badge>
              <Badge variant="outline" className="gap-1" data-testid="badge-category">
                {getCategoryIcon(product.category)}
                {getCategoryLabel(product.category)}
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 font-['Cairo']" data-testid="text-product-name">
                {product.nameAr}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-['Inter']" data-testid="text-product-name-en">
                {product.nameEn}
              </p>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">الموديل</p>
                <p className="font-semibold font-['Inter']" data-testid="text-model">{product.model}</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">السعر</p>
                <p className="font-semibold text-primary" data-testid="text-price">{product.priceInfo}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 font-['Cairo']">الوصف</h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-['Tajawal']" data-testid="text-description">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mb-12">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-['Cairo']" data-testid="text-specs-title">
              المواصفات التقنية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 hover-elevate"
                  data-testid={`spec-${index}`}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-['Tajawal']">{spec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <Card className="p-6 text-center hover-elevate">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2 font-['Cairo']">ضمان شامل</h3>
            <p className="text-sm text-muted-foreground font-['Tajawal']">
              ضمان على جميع الأجهزة
            </p>
          </Card>
          <Card className="p-6 text-center hover-elevate">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2 font-['Cairo']">صيانة دورية</h3>
            <p className="text-sm text-muted-foreground font-['Tajawal']">
              دعم فني على مدار الساعة
            </p>
          </Card>
          <Card className="p-6 text-center hover-elevate">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2 font-['Cairo']">تدريب مجاني</h3>
            <p className="text-sm text-muted-foreground font-['Tajawal']">
              تدريب شامل على استخدام الجهاز
            </p>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="p-8 sm:p-12 bg-gradient-to-br from-primary via-primary to-primary/90 text-white text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-['Cairo']" data-testid="text-cta-title">
            مهتم بهذا المنتج؟
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-white/90 font-['Tajawal']">
            تواصل معنا الآن للحصول على عرض سعر خاص واستشارة مجانية
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <a 
              href={`${whatsappLink}?text=مرحباً، أنا مهتم بـ ${product.nameAr} (${product.nameEn})`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2 text-lg px-8 min-h-12 w-full sm:w-auto" 
                data-testid="button-whatsapp"
              >
                <MessageCircle className="w-5 h-5" />
                استفسر عن هذا المنتج
              </Button>
            </a>
            <a href={`tel:${phoneNumber}`} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2 text-lg px-8 min-h-12 bg-white/10 border-white/30 text-white w-full sm:w-auto" 
                data-testid="button-call"
              >
                اتصل الآن: {phoneNumber}
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
