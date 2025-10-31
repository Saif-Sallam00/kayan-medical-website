import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle2, TrendingUp, Shield, Package, PhoneCall, Clock, DollarSign, Sparkles } from "lucide-react";

export default function TradeIn() {
  const whatsappLink = "https://wa.link/hn35ok";
  const phoneNumber = "+20 10 25253012";

  const policyItems = [
    {
      title: "الأجهزة المقبولة",
      description: "نستقبل جميع أنواع أجهزة السونار من كافة العلامات التجارية العالمية مثل GE، Philips، Mindray، Samsung في أي حالة",
      icon: Package,
      gradient: "from-primary to-primary/70"
    },
    {
      title: "شروط الاستبدال",
      description: "نقبل الأجهزة القديمة بغض النظر عن حالتها. سواء كانت شغالة أو محتاجة صيانة، نحن نقدم أفضل سعر في السوق",
      icon: Shield,
      gradient: "from-accent to-accent/70"
    },
    {
      title: "التقييم والسعر",
      description: "تقييم فوري لجهازك القديم مع عرض سعر منافس. نضمن لك أفضل قيمة استبدال في مصر مع الشفافية الكاملة",
      icon: DollarSign,
      gradient: "from-primary to-accent"
    }
  ];

  const benefits = [
    {
      title: "أحسن سعر في السوق",
      description: "نشتري جهاز السونار منك بأفضل الأسعار مقارنة بالسوق المصري",
      icon: TrendingUp
    },
    {
      title: "تقييم فوري وشفاف",
      description: "خبراء متخصصون يقيمون جهازك بدقة ويعطوك السعر العادل فوراً",
      icon: Sparkles
    },
    {
      title: "إجراءات سريعة",
      description: "لا تعقيدات، لا أوراق كثيرة. عملية استبدال سريعة وسهلة",
      icon: Clock
    },
    {
      title: "ضمان الجودة",
      description: "عند شراء جهاز جديد، تحصل على ضمان شامل ودعم فني مستمر",
      icon: CheckCircle2
    }
  ];

  const processSteps = [
    {
      number: "١",
      title: "تواصل معنا",
      description: "اتصل بنا عبر الواتساب أو الهاتف وأخبرنا بتفاصيل جهازك القديم"
    },
    {
      number: "٢",
      title: "التقييم المبدئي",
      description: "نقدم لك تقييم مبدئي للجهاز بناءً على الموديل والحالة العامة"
    },
    {
      number: "٣",
      title: "المعاينة والفحص",
      description: "نرسل مندوبنا لمعاينة الجهاز أو تحضره لأحد فروعنا للفحص الدقيق"
    },
    {
      number: "٤",
      title: "الاستبدال والشراء",
      description: "نتفق على السعر النهائي، وتستلم المبلغ أو تستبدل بجهاز جديد مع الفرق"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center">
          <Badge className="mb-4 text-sm px-4 py-2" data-testid="badge-tradein-hero">
            خدمة استبدال أجهزة السونار
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-['Cairo']" data-testid="text-tradein-title">
            بنشتري جهاز السونار منك بأحسن سعر
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed font-['Tajawal']">
            هل عندك جهاز سونار قديم؟ كيان ميديكال تشتريه منك بأفضل سعر في السوق المصري. استبدل جهازك القديم بجهاز جديد بأحدث التقنيات العالمية
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 min-h-12" 
                data-testid="button-tradein-hero-whatsapp"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل معنا على الواتساب
              </Button>
            </a>
            <a href={`tel:${phoneNumber}`}>
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2 text-lg px-8 min-h-12" 
                data-testid="button-tradein-hero-call"
              >
                <PhoneCall className="w-5 h-5" />
                {phoneNumber}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-12">
            <Badge className="mb-4" data-testid="badge-policy">سياسة الاستبدال</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Cairo']" data-testid="text-policy-title">
              كل ما تحتاج معرفته عن خدمة الاستبدال
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-['Tajawal']">
              نقدم خدمة استبدال شفافة وعادلة لجميع أجهزة السونار
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {policyItems.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 hover-elevate" 
                data-testid={`card-policy-${index}`}
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-['Cairo']" data-testid={`text-policy-title-${index}`}>
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-['Tajawal']">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-12">
            <Badge className="mb-4" data-testid="badge-benefits">مميزات الخدمة</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Cairo']" data-testid="text-benefits-title">
              ليه تختار كيان ميديكال؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-['Tajawal']">
              نوفر لك تجربة استبدال سلسة ومريحة مع أفضل الأسعار
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="p-6 text-center hover-elevate" 
                data-testid={`card-benefit-${index}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 font-['Cairo']" data-testid={`text-benefit-title-${index}`}>
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground font-['Tajawal']">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-12">
            <Badge className="mb-4" data-testid="badge-process">خطوات الاستبدال</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Cairo']" data-testid="text-process-title">
              كيف تتم عملية الاستبدال؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-['Tajawal']">
              أربع خطوات بسيطة للحصول على أفضل سعر لجهازك القديم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="relative" 
                data-testid={`step-${index}`}
              >
                <Card className="p-6 h-full hover-elevate">
                  <div className="flex flex-col items-center text-center">
                    <Badge 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4"
                      data-testid={`badge-step-${index}`}
                    >
                      {step.number}
                    </Badge>
                    <h3 className="text-lg font-bold mb-2 font-['Cairo']" data-testid={`text-step-title-${index}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-['Tajawal']">
                      {step.description}
                    </p>
                  </div>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-border -translate-y-1/2 -translate-x-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary to-primary/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Cairo']" data-testid="text-cta-title">
            جاهز تبيع أو تستبدل جهاز السونار؟
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-['Tajawal']">
            تواصل معنا الآن واحصل على أفضل عرض سعر لجهازك القديم
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2 text-lg px-8 min-h-12" 
                data-testid="button-cta-whatsapp"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل على الواتساب
              </Button>
            </a>
            <a href={`tel:${phoneNumber}`}>
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2 text-lg px-8 min-h-12 bg-white/10 border-white/30 text-white" 
                data-testid="button-cta-call"
              >
                <PhoneCall className="w-5 h-5" />
                اتصل الآن: {phoneNumber}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
