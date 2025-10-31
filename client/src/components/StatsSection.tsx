import * as LucideIcons from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Stat } from "@shared/schema";

// Map icon string to Lucide component
const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as Record<string, any>)[iconName];
  // Fallback to CheckCircle if icon not found
  return Icon && typeof Icon === 'function' ? Icon : LucideIcons.CheckCircle;
};

export function StatsSection() {
  const { data, isLoading } = useQuery<{ success: boolean; data: Stat[] }>({
    queryKey: ["/api/stats"],
    retry: 2,
  });

  // Filter active stats and sort by displayOrder (memoized to prevent recreating on every render)
  const stats = useMemo(() => {
    return (data?.data || [])
      .filter(stat => stat.isActive)
      .sort((a, b) => parseInt(a.displayOrder || "0") - parseInt(b.displayOrder || "0"));
  }, [data]);

  const [counts, setCounts] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection || stats.length === 0) return;

    // Initialize counts to target values (to show immediately if animation doesn't fire)
    const initialCounts = stats.map(stat => parseInt(stat.value.replace(/[^0-9]/g, '')) || 0);
    setCounts(initialCounts);
    hasAnimatedRef.current = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            
            // Reset to 0 for animation
            setCounts(stats.map(() => 0));
            
            stats.forEach((stat, index) => {
              // Extract number from value (e.g., "500+" -> 500, "98%" -> 98)
              const targetValue = parseInt(stat.value.replace(/[^0-9]/g, '')) || 0;
              const duration = 2000;
              const steps = 60;
              const stepValue = targetValue / steps;
              let currentStep = 0;

              const timer = setInterval(() => {
                currentStep++;
                if (currentStep <= steps) {
                  setCounts((prev) => {
                    const newCounts = [...prev];
                    newCounts[index] = Math.min(
                      Math.round(stepValue * currentStep),
                      targetValue
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
  }, [stats]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-4 p-6 rounded-lg bg-card">
                <div className="w-20 h-20 bg-muted rounded-xl mx-auto" />
                <div className="space-y-2">
                  <div className="h-12 bg-muted rounded mx-auto w-24" />
                  <div className="h-6 bg-muted rounded mx-auto w-32" />
                  <div className="h-4 bg-muted rounded mx-auto w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Extract suffix from value (e.g., "500+" -> "+", "98%" -> "%")
  const getSuffix = (value: string) => {
    const match = value.match(/[^0-9]+$/);
    return match ? match[0] : '';
  };

  // Show empty state if no active stats
  if (!isLoading && stats.length === 0) {
    return null; // Don't render section if no stats available
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const gradient = index % 2 === 0 ? "from-primary to-primary/70" : "from-accent to-accent/70";
            const Icon = getIconComponent(stat.icon);
            return (
              <div 
                key={stat.id} 
                className="group text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-card border border-card-border hover-elevate transition-all duration-300"
                data-testid={`stat-${stat.id}`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${gradient} mb-2 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-['Cairo'] group-hover:text-primary transition-colors duration-300" data-testid={`stat-value-${stat.id}`}>
                    {counts[index]}{getSuffix(stat.value)}
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-foreground">
                    {stat.labelAr}
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
