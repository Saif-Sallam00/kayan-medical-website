import { Stethoscope, Award, PackageCheck, ThumbsUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const STATS_CONFIG = [
  {
    icon: Stethoscope,
    targetValue: 500,
    suffix: "+",
    label: "طبيب وعيادة",
    description: "يثقون في خدماتنا",
    gradient: "from-primary to-primary/70"
  },
  {
    icon: Award,
    targetValue: 15,
    suffix: "+",
    label: "سنة خبرة",
    description: "في مجال الأجهزة الطبية",
    gradient: "from-accent to-accent/70"
  },
  {
    icon: PackageCheck,
    targetValue: 800,
    suffix: "+",
    label: "جهاز تم بيعه",
    description: "لمختلف التخصصات",
    gradient: "from-primary to-primary/70"
  },
  {
    icon: ThumbsUp,
    targetValue: 98,
    suffix: "%",
    label: "معدل الرضا",
    description: "من عملائنا",
    gradient: "from-accent to-accent/70"
  }
] as const;

export function StatsSection() {
  const [counts, setCounts] = useState(() => STATS_CONFIG.map(() => 0));
  const sectionRef = useRef<HTMLElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            
            STATS_CONFIG.forEach((stat, index) => {
              const duration = 2000;
              const steps = 60;
              const stepValue = stat.targetValue / steps;
              let currentStep = 0;

              const timer = setInterval(() => {
                currentStep++;
                if (currentStep <= steps) {
                  setCounts((prev) => {
                    const newCounts = [...prev];
                    newCounts[index] = Math.min(
                      Math.round(stepValue * currentStep),
                      stat.targetValue
                    );
                    return newCounts;
                  });
                } else {
                  clearInterval(timer);
                  timersRef.current = timersRef.current.filter(t => t !== timer);
                }
              }, duration / steps);
              
              timersRef.current.push(timer);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(currentSection);

    return () => {
      timersRef.current.forEach(timer => clearInterval(timer));
      timersRef.current = [];
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STATS_CONFIG.map((stat, index) => {
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
                    {counts[index]}{stat.suffix}
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
