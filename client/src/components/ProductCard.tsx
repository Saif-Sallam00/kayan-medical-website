import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Product } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // ✅ Fetch settings to get the dynamic WhatsApp message template
  const { data: settingsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 60, 
  });
  const settings = settingsData?.data;

  // Default message if settings haven't loaded yet
  const messageTemplate = settings?.whatsappMessage || "مرحباً، أود الاستفسار عن جهاز:";
  const whatsappMessage = encodeURIComponent(`${messageTemplate} ${product.nameAr}`);
  // Ensure we use the main phone number from settings if available
  const phoneNumber = settings?.mainPhone ? settings.mainPhone.replace(/[^0-9]/g, '') : "201025253012";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  return (
    <Card className="flex flex-col h-full overflow-hidden hover-elevate transition-all duration-300 border-card-border group">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.nameAr}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
            لا توجد صورة
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant={product.category === 'hospital' ? 'default' : 'secondary'} className="shadow-sm">
            {product.category === 'hospital' ? 'مستشفى' : product.category === 'clinic' ? 'عيادة' : 'محمول'}
          </Badge>
          {product.brand && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm shadow-sm">
              {product.brand}
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="space-y-2 p-5">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 min-h-[3rem]">
            {product.nameAr}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground font-medium">{product.model}</p>
      </CardHeader>

      <CardContent className="flex-1 px-5 pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-4 space-y-2">
          {product.specifications.slice(0, 2).map((spec, index) => (
            <div key={index} className="flex items-center text-xs text-muted-foreground bg-muted/50 p-1.5 rounded">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 ml-2 shrink-0" />
              <span className="truncate">{spec}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-2 flex flex-col gap-3 border-t border-border/50 mt-auto bg-card/50">
        <div className="w-full flex items-center justify-between">
          <p className="font-bold text-primary text-lg">
            {product.priceInfo || "تواصل للسعر"}
          </p>

          <a 
            href={whatsappLink}
            target="_blank" 
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Button 
              size="sm" 
              className="gap-1.5 bg-green-600 hover:bg-green-700 text-white shadow-sm animate-pulse-slow hover:animate-none transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>اطلب الآن</span>
            </Button>
          </a>
        </div>

        <Link href={`/products/${product.id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:border-primary/50 transition-colors">
            عرض التفاصيل
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}