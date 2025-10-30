import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Award } from "lucide-react";
import type { Product } from "@shared/schema";
import ultrasoundMachineUrl from "@/assets/ultrasound-machine.png";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col hover-elevate transition-all duration-300" data-testid={`card-product-${product.id}`}>
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
          <Badge variant="secondary" className="text-xs font-medium">
            {product.brand}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.category === 'clinic' ? 'عيادات' : product.category === 'hospital' ? 'مستشفيات' : 'محمول'}
          </Badge>
        </div>
        
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 rounded-md mb-3 sm:mb-4 flex items-center justify-center overflow-hidden p-3 sm:p-4">
          <img 
            src={ultrasoundMachineUrl} 
            alt={product.nameAr} 
            className="w-full h-full object-contain"
          />
        </div>

        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1" data-testid={`text-product-name-${product.id}`}>
          {product.nameAr}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground font-['Inter']">
          {product.nameEn}
        </p>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-3 sm:pb-4 flex-1">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4">
          {product.description}
        </p>

        {product.specifications.length > 0 && (
          <div className="space-y-1.5 sm:space-y-2">
            {product.specifications.slice(0, 3).map((spec, index) => (
              <div key={index} className="flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{spec}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center justify-between w-full">
          {product.priceInfo ? (
            <span className="text-sm sm:text-base font-semibold text-primary" data-testid={`text-price-${product.id}`}>
              {product.priceInfo}
            </span>
          ) : (
            <span className="text-xs sm:text-sm text-muted-foreground">استفسر عن السعر</span>
          )}
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
        </div>
        
        <Link href={`/products/${product.id}`} className="w-full">
          <Button variant="default" className="w-full min-h-10 text-sm sm:text-base" data-testid={`button-view-product-${product.id}`}>
            تفاصيل المنتج
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
