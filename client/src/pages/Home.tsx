import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestimonialCard } from "@/components/TestimonialCard";
import { StatsSection } from "@/components/StatsSection";
import { ArrowLeft, CheckCircle, PhoneCall, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial, Feature, HeroSection, Offer } from "@shared/schema";
import heroImageUrl from "@assets/Copy_of_بنشتري_جهاز_السونار_منك_بأحسن_سعر-removebg-preview_1761845516919.png";
import logoBgUrl from "@/assets/logo-bg.png";

export default function Home() {
  const { toast } = useToast();

  const { data: testimonialsData, isLoading: testimonialsLoading, isError: testimonialsError } = useQuery<{ success: boolean; data: Testimonial[] }>({
    queryKey: ["/api/testimonials"],
    retry: 2,
  });

  const { data: featuresData, isLoading: featuresLoading, isError: featuresError } = useQuery<{ success: boolean; data: Feature[] }>({
    queryKey: ["/api/features"],
    retry: 2,
  });

  const { data: heroData, isLoading: heroLoading, isError: heroError } = useQuery<{ success: boolean; data: HeroSection[] }>({
    queryKey: ["/api/hero-sections"],
    retry: 2,
  });

  const { data: offersData, isLoading: offersLoading, isError: offersError } = useQuery<{ success: boolean; data: Offer[] }>({
    queryKey: ["/api/offers"],
    retry: 2,
  });

  useEffect(() => {
    if (testimonialsError || featuresError || heroError || offersError) {
      toast({
        variant: "destructive",
        title: "خطأ في تحميل المحتوى",
        description: "حدث خطأ أثناء تحميل بعض محتويات الصفحة.",
      });
    }
  }, [testimonialsError, featuresError, heroError, offersError, toast]);

  const testimonials = testimonialsData?.data || [];
  const features = featuresData?.data || [];
  const hero = heroData?.data?.[0];
  const activeOffer = offersData?.data?.[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Background Logo */}
        <div 
          className="absolute inset-0 opacity-5 bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${logoBgUrl})`,
            backgroundSize: '80%',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          {heroLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center animate-pulse">
              <div className="order-2 lg:order-1 space-y-4 text-center lg:text-right">
                <div className="h-8 bg-muted rounded w-48 mx-auto lg:mr-0" />
                <div className="h-16 bg-muted rounded" />
                <div className="h-12 bg-muted rounded" />
                <div className="h-8 bg-muted rounded" />
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-square bg-muted rounded-full max-w-md mx-auto" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text Content */}
              <div className="order-2 lg:order-1 space-y-4 md:space-y-6 text-center lg:text-right">
                <Badge className="mb-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2" data-testid="badge-hero">
                  الشريك الموثوق في الرعاية الصحية
                </Badge>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-['Cairo']" data-testid="text-hero-title">
                  {hero?.titleAr || "أفضل حلول السونار الطبي في مصر"}
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground font-['Tajawal']">
                  {hero?.subtitleAr || "كيان ميديكال تقدم لك أحدث أجهزة السونار مثل Mindray و GE Logiq مع ضمان الجودة والصيانة"}
                </p>
                
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  نحن نقدم الحلول الطبية لأطباء ومقدمي الرعاية الصحية لضمان دقة التشخيص
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
                  <Link href="/products" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="gap-2 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto min-h-12" 
                      data-testid="button-hero-products"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      {hero?.ctaText || "اطلب جهازك الآن"}
                    </Button>
                  </Link>
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="gap-2 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto min-h-12" 
                      data-testid="button-hero-consultation"
                    >
                      <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
                      احجز استشارة مجانية
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Image */}
              <div className="order-1 lg:order-2 flex items-center justify-center">
                <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                  <img 
                    src={hero?.backgroundImageUrl || heroImageUrl} 
                    alt="طبيب كيان ميديكال مع أجهزة السونار الطبية"
                    className="relative w-full h-auto drop-shadow-2xl"
                    data-testid="image-hero-ultrasound"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Special Offer Section */}
      {(offersLoading || activeOffer) && (
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            {offersLoading ? (
              <div className="bg-card border border-card-border rounded-lg p-6 sm:p-8 md:p-12 animate-pulse">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-muted rounded w-24" />
                    <div className="h-10 bg-muted rounded" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                  </div>
                  <div className="h-12 w-48 bg-muted rounded" />
                </div>
              </div>
            ) : activeOffer && (
              <div className="bg-card border border-card-border rounded-lg p-6 sm:p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <Badge variant="destructive" className="mb-2 text-xs sm:text-sm">عرض خاص</Badge>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      {activeOffer.titleAr}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      {activeOffer.description}
                    </p>
                    {activeOffer.validUntil && (
                      <p className="text-sm text-muted-foreground">
                        ساري حتى: {activeOffer.validUntil}
                      </p>
                    )}
                  </div>
                  <Link href="/offers" className="w-full md:w-auto">
                    <Button size="lg" className="gap-2 text-base sm:text-lg w-full md:w-auto min-h-12" data-testid="button-view-offers">
                      استفيد من العروض الآن
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              لماذا تختار كيان ميديكال؟
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              نحن نقدم أكثر من مجرد أجهزة - نقدم حلول متكاملة لنجاح عيادتك
            </p>
          </div>

          {featuresLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-6 rounded-lg bg-muted">
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded-md" />
                  <div className="flex-1 h-6 bg-muted-foreground/20 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg bg-card border border-card-border hover-elevate transition-all"
                  data-testid={`feature-${feature.id}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-medium">{feature.titleAr}</p>
                    <p className="text-sm text-muted-foreground">{feature.descriptionAr}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              آراء الأطباء عن خدماتنا
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              ثقة المئات من الأطباء والعيادات في مختلف أنحاء مصر
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white dark:text-white">
            جاهز لتطوير عيادتك؟
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 dark:text-white/90 px-4">
            تواصل معنا اليوم واحصل على استشارة مجانية حول أفضل جهاز سونار لاحتياجاتك
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 text-base sm:text-lg bg-white text-primary hover:bg-white/90 border-white w-full sm:w-auto min-h-12" 
                data-testid="button-cta-contact"
              >
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
                تواصل معنا الآن
              </Button>
            </Link>
            <a href="https://wa.link/hn35ok" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="gap-2 text-base sm:text-lg bg-accent hover:bg-accent/90 border-accent-border w-full sm:w-auto min-h-12" 
                data-testid="button-cta-whatsapp"
              >
                واتساب مباشر
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
