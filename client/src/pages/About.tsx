import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function About() {
  // Fetch About Page Content (Vision/Mission)
  const { data: aboutData, isLoading: isLoadingAbout } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["/api/about-page"],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  const aboutContent = aboutData?.data;

  // Fetch Team Members
  const { data: teamData, isLoading: isLoadingTeam } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/team-members"],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  const teamMembers = teamData?.data || [];

  // Hardcoded 'Why Choose Us' section as it's not part of the CMS requirement yet
  const whyChooseUsItems = [
    {
      icon: Award,
      title: "جودة عالمية",
      description: "نتعامل مع أفضل العلامات التجارية العالمية مثل GE وPhilips وSamsung"
    },
    {
      icon: Users,
      title: "فريق محترف",
      description: "فريق عمل من ذوي الخبرة والكفاءة في جميع جوانب الأجهزة الطبية"
    },
    {
      icon: Target,
      title: "دعم متكامل",
      description: "صيانة دورية ودعم فني على مدار الساعة لضمان استمرارية عملك"
    }
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center mb-12 md:mb-16">
          <Badge className="mb-3 md:mb-4 text-xs sm:text-sm">عن الشركة</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            من نحن
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            كيان ميديكال - الشريك الموثوق في توفير أحدث حلول الأجهزة الطبية في مصر
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {isLoadingAbout ? (
            <>
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </>
          ) : (
            <>
              <Card className="hover-elevate transition-all">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                    <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">رؤيتنا</h2>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {aboutContent?.visionAr || "جاري تحميل الرؤية..."}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-elevate transition-all">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-accent/10 flex items-center justify-center mb-4 sm:mb-6">
                    <Target className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">مهمتنا</h2>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {aboutContent?.missionAr || "جاري تحميل المهمة..."}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Why Choose Us */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              لماذا نحن؟
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              نجمع بين الخبرة والتكنولوجيا والخدمة المتميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center space-y-3 sm:space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              فريق العمل
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              نخبة من الخبراء المتخصصين في مجال الأجهزة الطبية
            </p>
          </div>

          {isLoadingTeam ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="hover-elevate transition-all">
                  <CardContent className="p-6 text-center">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                    <Skeleton className="h-3 w-full mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={member.id} className="hover-elevate transition-all" data-testid={`team-member-${index}`}>
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
          )}
        </div>

        {/* Story Section (Still hardcoded, can be added to CMS later) */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">قصتنا</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
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