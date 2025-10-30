import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Zap, Award } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col hover-elevate transition-all duration-300" data-testid={`card-product-${product.id}`}>
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between gap-2 mb-4">
          <Badge variant="secondary" className="text-xs font-medium">
            {product.brand}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.category === 'clinic' ? 'عيادات' : product.category === 'hospital' ? 'مستشفيات' : 'محمول'}
          </Badge>
        </div>
        
        <div className="aspect-[4/3] bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.nameAr} 
              className="w-full h-full object-contain"
            />
          ) : (
            <Stethoscope className="w-16 h-16 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-xl font-semibold mb-1" data-testid={`text-product-name-${product.id}`}>
          {product.nameAr}
        </h3>
        <p className="text-sm font-medium text-muted-foreground font-['Inter']">
          {product.nameEn}
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-4 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {product.description}
        </p>

        {product.specifications.length > 0 && (
          <div className="space-y-2">
            {product.specifications.slice(0, 3).map((spec, index) => (
              <div key={index} className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{spec}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          {product.priceInfo ? (
            <span className="text-base font-semibold text-primary" data-testid={`text-price-${product.id}`}>
              {product.priceInfo}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">استفسر عن السعر</span>
          )}
          <Award className="w-5 h-5 text-accent" />
        </div>
        
        <Link href={`/products/${product.id}`}>
          <Button variant="default" className="w-full" data-testid={`button-view-product-${product.id}`}>
            تفاصيل المنتج
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
