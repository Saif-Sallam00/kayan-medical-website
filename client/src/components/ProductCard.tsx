import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Mapping for category labels if needed, or just display raw
  const categoryLabels: Record<string, string> = {
    bw: "Black & White",
    pulse: "Pulse Waves",
    color: "Color Doppler",
    "4d": "4D Ultrasound",
    echo: "Echo",
  };

  return (
    <Card className="h-full flex flex-col group overflow-hidden border-card-border hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.imageUrl || "/placeholder-image.png"}
            alt={product.nameAr}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.isSoldOut ? 'grayscale' : ''}`}
          />
          {/* ✅ SOLD OUT OVERLAY */}
          {product.isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-6 py-2 rounded-md font-bold text-xl border-2 border-white transform -rotate-12 shadow-xl">
                SOLD OUT
              </span>
            </div>
          )}

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Badge variant="secondary" className="bg-white/90 hover:bg-white text-black backdrop-blur-sm shadow-sm">
              {categoryLabels[product.category] || product.category}
            </Badge>
            {product.type === "portable" && (
              <Badge variant="outline" className="bg-blue-500/90 text-white border-none backdrop-blur-sm shadow-sm">
                Portable
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs text-muted-foreground border-primary/20 bg-primary/5">
            {product.brand}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">{product.model}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {product.nameAr}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto">
        <Link href={`/products/${product.id}`} className="w-full">
          <Button 
            className="w-full gap-2 group-hover:bg-primary/90" 
            variant={product.isSoldOut ? "secondary" : "default"}
            disabled={product.isSoldOut} // Optional: Disable button if sold out
          >
            {product.isSoldOut ? "غير متوفر حالياً" : "عرض التفاصيل"}
            {!product.isSoldOut && <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}