import { Stethoscope, Award, PackageCheck, ThumbsUp } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Stethoscope,
      value: "500+",
      label: "طبيب وعيادة",
      description: "يثقون في خدماتنا",
      gradient: "from-primary to-primary/70"
    },
    {
      icon: Award,
      value: "15+",
      label: "سنة خبرة",
      description: "في مجال الأجهزة الطبية",
      gradient: "from-accent to-accent/70"
    },
    {
      icon: PackageCheck,
      value: "800+",
      label: "جهاز تم بيعه",
      description: "لمختلف التخصصات",
      gradient: "from-primary to-primary/70"
    },
    {
      icon: ThumbsUp,
      value: "98%",
      label: "معدل الرضا",
      description: "من عملائنا",
      gradient: "from-accent to-accent/70"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-card border border-card-border hover-elevate transition-all duration-300"
                data-testid={`stat-${index}`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${stat.gradient} mb-2 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Cairo'] group-hover:text-primary transition-colors duration-300" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
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
