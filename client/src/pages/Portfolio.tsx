import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";

export default function Portfolio() {
  const { data, isLoading } = useQuery<{ success: boolean; data: PortfolioItem[] }>({
    queryKey: ["/api/portfolio"],
  });

  const items = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-['Cairo'] mb-4">تسليماتنا ونجاحات شركائنا</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نفخر بكوننا شركاء نجاح لأكثر من 500 طبيب ومركز طبي في جميع أنحاء مصر. هذه بعض من أحدث تسليماتنا لأجهزة السونار.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <p className="text-muted-foreground text-lg">سيتم إضافة صور التسليمات قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover-elevate transition-all duration-300 group border-border">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <img 
                    src={item.imageUrl} 
                    alt={item.titleAr}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold mb-3 font-['Cairo']">{item.titleAr}</h3>

                  <div className="space-y-2">
                    {item.clientName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 text-primary" />
                        <span>{item.clientName}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {item.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.deliveryDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{item.deliveryDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}