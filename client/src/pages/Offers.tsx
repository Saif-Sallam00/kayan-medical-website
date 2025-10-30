import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Calendar, ArrowLeft, Sparkles } from "lucide-react";
import type { Offer } from "@shared/schema";

export default function Offers() {
  const offers: Offer[] = [
    {
      id: "1",
      titleAr: "خصم 10% على جميع أجهزة السونار",
      description: "عرض خاص للأطباء الجدد - احصل على خصم 10% على أي جهاز سونار عند الشراء لأول مرة",
      discount: "10%",
      validUntil: "31 ديسمبر 2025",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      isActive: true
    },
    {
      id: "2",
      titleAr: "عرض خاص على Samsung UGEO PT60A",
      description: "جهاز سونار محمول بسعر مخفض - مثالي للعيادات الصغيرة والاستخدام المنزلي",
      discount: "15%",
      validUntil: "15 يناير 2026",
      imageUrl: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80",
      isActive: true
    },
    {
      id: "3",
      titleAr: "صيانة مجانية لمدة سنة",
      description: "عند شراء أي جهاز سونار من GE Healthcare، احصل على صيانة مجانية لمدة سنة كاملة",
      validUntil: "30 نوفمبر 2025",
      imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80",
      isActive: true
    }
  ];

  const news = [
    {
      id: "1",
      title: "تقنية 4D الجديدة في أجهزة GE Voluson",
      description: "تعرف على أحدث التطورات في تكنولوجيا التصوير ثلاثي ورباعي الأبعاد وكيف تحسن دقة التشخيص",
      date: "20 ديسمبر 2024",
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80"
    },
    {
      id: "2",
      title: "أهمية الصيانة الدورية لأجهزة السونار",
      description: "نصائح وإرشادات للحفاظ على أداء جهاز السونار الخاص بك لأطول فترة ممكنة",
      date: "15 ديسمبر 2024",
      imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80"
    },
    {
      id: "3",
      title: "كيف تختار جهاز السونار المناسب لعيادتك؟",
      description: "دليل شامل لمساعدتك في اختيار الجهاز الأنسب حسب احتياجاتك وميزانيتك",
      date: "10 ديسمبر 2024",
      imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">العروض والأخبار</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            العروض الخاصة والأخبار
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            استفد من عروضنا الحصرية واطلع على آخر الأخبار في عالم الأجهزة الطبية
          </p>
        </div>

        {/* Special Offers Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">العروض الحالية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card 
                key={offer.id} 
                className="overflow-hidden hover-elevate transition-all" 
                data-testid={`offer-card-${offer.id}`}
              >
                <div className="relative aspect-video bg-muted">
                  {offer.imageUrl && (
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.titleAr} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {offer.discount && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-4 right-4 text-lg px-4 py-2"
                    >
                      خصم {offer.discount}
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl" data-testid={`offer-title-${offer.id}`}>
                    {offer.titleAr}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {offer.description}
                  </p>
                  {offer.validUntil && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>ساري حتى {offer.validUntil}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Link href="/contact" className="w-full">
                    <Button className="w-full gap-2" data-testid={`button-offer-${offer.id}`}>
                      استفيد من العرض
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">آخر الأخبار والمقالات</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <Card 
                key={article.id} 
                className="overflow-hidden hover-elevate transition-all" 
                data-testid={`news-card-${article.id}`}
              >
                <div className="aspect-video bg-muted">
                  {article.imageUrl && (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <CardTitle className="text-xl" data-testid={`news-title-${article.id}`}>
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {article.description}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button variant="outline" className="w-full gap-2" data-testid={`button-news-${article.id}`}>
                    اقرأ المزيد
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            اشترك في نشرتنا الإخبارية
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            احصل على آخر العروض والأخبار مباشرة في بريدك الإلكتروني
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <Input 
              type="email" 
              placeholder="بريدك الإلكتروني" 
              className="flex-1 font-['Inter']" 
              dir="ltr"
            />
            <Button>اشترك الآن</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
