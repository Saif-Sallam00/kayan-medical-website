import { Users, Calendar, Activity, TrendingUp } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "طبيب وعيادة",
      description: "يثقون في خدماتنا"
    },
    {
      icon: Calendar,
      value: "15+",
      label: "سنة خبرة",
      description: "في مجال الأجهزة الطبية"
    },
    {
      icon: Activity,
      value: "800+",
      label: "جهاز تم بيعه",
      description: "لمختلف التخصصات"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "معدل الرضا",
      description: "من عملائنا"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center space-y-3"
                data-testid={`stat-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-primary/10 mb-2">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-foreground font-['Cairo']" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
