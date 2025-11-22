import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react"; // ✅ Added state
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, MessageCircle, CheckCircle2, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string>(""); // ✅ State for main image

  const { data: productData, isLoading, isError } = useQuery<{ success: boolean; data: Product }>({
    queryKey: [`/api/products/${params?.id}`],
    enabled: !!params?.id,
  });

  const product = productData?.data;

  // ✅ Effect to set initial image when product loads
  useEffect(() => {
    if (product?.imageUrl) {
      setSelectedImage(product.imageUrl);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
        <Link href="/products">
          <Button variant="outline">العودة للمنتجات</Button>
        </Link>
      </div>
    );
  }

  // ✅ Combine all images: Main + Additional
  const allImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean) as string[];

  // Helper for WhatsApp
  const whatsappMessage = encodeURIComponent(`مرحباً، أود الاستفسار عن جهاز: ${product.nameAr}`);
  const whatsappLink = `https://wa.me/+201025253012?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/products" className="hover:text-primary transition-colors">
            المنتجات
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.nameAr}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ✅ Product Gallery Section */}
          <div className="space-y-4">
            {/* Big Image */}
            <div className="aspect-[4/3] bg-white rounded-xl border border-border overflow-hidden shadow-sm">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.nameAr}
                  className="w-full h-full object-contain p-4 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  لا توجد صورة
                </div>
              )}
            </div>

            {/* Thumbnails Grid (Only if we have images) */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`
                      aspect-square rounded-lg border overflow-hidden cursor-pointer transition-all
                      ${selectedImage === img ? "ring-2 ring-primary border-primary" : "border-border hover:border-primary/50"}
                    `}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {/* If we have fewer than 5 images, the grid-cols-5 will naturally leave empty space. 
                   User requirement: "if 3 images only uploaded... 2 places will not appear".
                   This CSS grid handles that automatically by just not rendering children for empty slots.
                */}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-base px-3 py-1">
                  {product.category === 'hospital' ? 'مستشفى' : product.category === 'clinic' ? 'عيادة' : 'محمول'}
                </Badge>
                {product.brand && <Badge variant="secondary" className="text-base px-3 py-1">{product.brand}</Badge>}
                {product.model && <Badge variant="secondary" className="text-base px-3 py-1">{product.model}</Badge>}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-['Cairo'] leading-tight">
                {product.nameAr}
              </h1>
              <h2 className="text-xl text-muted-foreground font-['Inter']" dir="ltr">
                {product.nameEn}
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>{product.description}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">المواصفات الفنية:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4 p-6 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">السعر</p>
                  <p className="text-2xl font-bold text-primary">
                    {product.priceInfo || "تواصل معنا للسعر"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "تم نسخ الرابط" });
                  }}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="lg" className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white">
                    <MessageCircle className="w-5 h-5" />
                    اطلب عبر واتساب
                  </Button>
                </a>
                <a href="tel:+201025253012" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <Phone className="w-5 h-5" />
                    اتصال هاتفي
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}