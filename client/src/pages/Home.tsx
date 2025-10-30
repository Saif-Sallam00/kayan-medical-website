import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestimonialCard } from "@/components/TestimonialCard";
import { StatsSection } from "@/components/StatsSection";
import { ArrowLeft, CheckCircle, PhoneCall, ShoppingCart } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export default function Home() {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      doctorName: "د. أحمد محمود",
      specialization: "استشاري النساء والتوليد",
      quote: "أجهزة كيان ميديكال غيرت مستوى خدماتي للمرضى. جودة الصورة رائعة والدعم الفني ممتاز",
      rating: 5,
      clinicName: "عيادة النور - القاهرة"
    },
    {
      id: "2",
      doctorName: "د. سارة عبد الله",
      specialization: "أخصائية الأشعة التشخيصية",
      quote: "التعامل مع كيان ميديكال كان احترافياً من البداية. الصيانة الدورية ممتازة",
      rating: 5,
      clinicName: "مركز الشفاء الطبي - الشيخ زايد"
    },
    {
      id: "3",
      doctorName: "د. محمد حسن",
      specialization: "طبيب عام",
      quote: "حصلت على جهاز سونار محمول بسعر تنافسي وجودة عالية. أنصح بالتعامل معهم",
      rating: 5,
      clinicName: "عيادة الأمل - المنوفية"
    }
  ];

  const features = [
    { text: "أجهزة سونار من أفضل العلامات العالمية" },
    { text: "ضمان شامل على جميع الأجهزة" },
    { text: "صيانة دورية ودعم فني على مدار الساعة" },
    { text: "خيارات دفع مرنة ومريحة" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center overflow-hidden">
        {/* Background with gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/80 to-background/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80)',
          }}
        />
        
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <Badge className="mb-6 text-sm px-4 py-2 bg-primary/90 backdrop-blur-sm" data-testid="badge-hero">
              الشريك الموثوق في الرعاية الصحية
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white dark:text-white" data-testid="text-hero-title">
              أفضل حلول السونار الطبي في مصر
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 leading-relaxed text-white/90 dark:text-white/90 font-['Tajawal']">
              كيان ميديكال تقدم لك أحدث أجهزة السونار مثل <span className="font-semibold font-['Inter']">Mindray</span> و <span className="font-semibold font-['Inter']">GE Logiq</span> مع ضمان الجودة والصيانة
            </p>
            
            <p className="text-lg mb-8 text-white/80 dark:text-white/80">
              نحن نقدم الحلول الطبية لأطباء ومقدمي الرعاية الصحية لضمان دقة التشخيص
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="gap-2 text-lg px-8 bg-primary/95 backdrop-blur-sm border border-primary-border hover:bg-primary" 
                  data-testid="button-hero-products"
                >
                  <ShoppingCart className="w-5 h-5" />
                  اطلب جهازك الآن
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 text-lg px-8 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white" 
                  data-testid="button-hero-consultation"
                >
                  <PhoneCall className="w-5 h-5" />
                  احجز استشارة مجانية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Special Offer Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-card border border-card-border rounded-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <Badge variant="destructive" className="mb-2">عرض خاص</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  خصم 10% على جميع أجهزة السونار
                </h2>
                <p className="text-lg text-muted-foreground">
                  للأطباء الجدد - عرض محدود لفترة قصيرة
                </p>
              </div>
              <Link href="/offers">
                <Button size="lg" className="gap-2 text-lg" data-testid="button-view-offers">
                  استفيد من العروض الآن
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا تختار كيان ميديكال؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نحن نقدم أكثر من مجرد أجهزة - نقدم حلول متكاملة لنجاح عيادتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 rounded-lg bg-card border border-card-border hover-elevate transition-all"
                data-testid={`feature-${index}`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <p className="text-lg font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              آراء الأطباء عن خدماتنا
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ثقة المئات من الأطباء والعيادات في مختلف أنحاء مصر
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white dark:text-white">
            جاهز لتطوير عيادتك؟
          </h2>
          <p className="text-xl mb-8 text-white/90 dark:text-white/90">
            تواصل معنا اليوم واحصل على استشارة مجانية حول أفضل جهاز سونار لاحتياجاتك
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 text-lg bg-white text-primary hover:bg-white/90 border-white" 
                data-testid="button-cta-contact"
              >
                <PhoneCall className="w-5 h-5" />
                تواصل معنا الآن
              </Button>
            </Link>
            <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="gap-2 text-lg bg-accent hover:bg-accent/90 border-accent-border" 
                data-testid="button-cta-whatsapp"
              >
                واتساب مباشر
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
