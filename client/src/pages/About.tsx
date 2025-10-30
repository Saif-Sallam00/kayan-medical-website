import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";

export default function About() {
  const teamMembers = [
    {
      name: "د. محمد أحمد",
      role: "المدير الفني",
      description: "خبرة 20 عاماً في مجال الأجهزة الطبية"
    },
    {
      name: "م. أحمد حسن",
      role: "رئيس قسم الصيانة",
      description: "متخصص في صيانة أجهزة السونار الطبية"
    },
    {
      name: "م. سارة علي",
      role: "مدير المبيعات",
      description: "خبيرة في حلول الأجهزة الطبية للعيادات"
    },
    {
      name: "م. كريم يوسف",
      role: "فني دعم فني",
      description: "متخصص في الدعم الفني والتدريب"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4">عن الشركة</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            من نحن
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            كيان ميديكال - الشريك الموثوق في توفير أحدث حلول الأجهزة الطبية في مصر
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="hover-elevate transition-all">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">رؤيتنا</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                نحن نسعى لنكون الرواد في تقديم أجهزة السونار الطبية عالية الجودة مع خدمة ممتازة لما بعد البيع، وأن نكون الخيار الأول للأطباء والمستشفيات في مصر والشرق الأوسط.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-md bg-accent/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-4">مهمتنا</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                نقدم حلول طبية مبتكرة تضمن دقة التشخيص في جميع المجالات الطبية، مع التزامنا بتوفير أحدث التقنيات وأفضل خدمات الدعم الفني والصيانة لعملائنا.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا نحن؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نجمع بين الخبرة والتكنولوجيا والخدمة المتميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-md bg-primary/10 flex items-center justify-center mx-auto">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">جودة عالمية</h3>
              <p className="text-muted-foreground leading-relaxed">
                نتعامل مع أفضل العلامات التجارية العالمية مثل GE وPhilips وSamsung
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-md bg-accent/10 flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold">فريق محترف</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق عمل من ذوي الخبرة والكفاءة في جميع جوانب الأجهزة الطبية
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-md bg-primary/10 flex items-center justify-center mx-auto">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">دعم متكامل</h3>
              <p className="text-muted-foreground leading-relaxed">
                صيانة دورية ودعم فني على مدار الساعة لضمان استمرارية عملك
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              فريق العمل
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نخبة من الخبراء المتخصصين في مجال الأجهزة الطبية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`team-member-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1" data-testid={`team-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-2">
                    {member.role}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  بدأت كيان ميديكال كحلم لتوفير أحدث التقنيات الطبية للأطباء في مصر. منذ أكثر من 15 عاماً، كنا نؤمن بأن كل طبيب يستحق أن يكون لديه أفضل الأدوات لخدمة مرضاه.
                </p>
                <p>
                  اليوم، نفخر بخدمة أكثر من 500 عيادة ومستشفى في جميع أنحاء مصر، ونواصل التزامنا بتقديم أفضل الأجهزة الطبية مع خدمة عملاء لا مثيل لها.
                </p>
                <p>
                  نحن لا نبيع أجهزة فقط - نبني شراكات طويلة الأمد مع عملائنا، ونكون معهم في كل خطوة من خطوات نجاحهم.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
