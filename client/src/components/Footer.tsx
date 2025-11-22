import { Link } from "wouter";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  const { data: settingsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 60,
  });
  const settings = settingsData?.data;

  return (
    <footer className="bg-card border-t border-card-border mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12">

        {/* LAYOUT LOGIC:
           - Mobile: grid-cols-3 (To fit Links, Contact, Follow side-by-side)
           - Desktop (lg): grid-cols-4 (Standard layout)
        */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8">

          {/* 1. Company Info (Logo Only) */}
          {/* Mobile: col-span-3 (Full width on top). Desktop: col-span-1 (Left side) */}
          <div className="col-span-3 lg:col-span-1 flex justify-center lg:justify-start mb-6 lg:mb-0">
            <img 
              src={logoUrl} 
              alt="كيان ميديكال" 
              // ✅ Logo is much larger now
              className="h-20 sm:h-24 md:h-28 w-auto object-contain" 
            />
            {/* ❌ Removed the text paragraph as requested */}
          </div>

          {/* 2. Quick Links - Column 1 */}
          <div className="col-span-1">
            <h3 className="font-bold text-xs sm:text-base lg:text-lg mb-3 sm:mb-4 text-primary">روابط</h3>
            <ul className="space-y-2">
              <li><Link href="/"><span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] sm:text-sm cursor-pointer">الرئيسية</span></Link></li>
              <li><Link href="/products"><span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] sm:text-sm cursor-pointer">المنتجات</span></Link></li>
              <li><Link href="/trade-in"><span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] sm:text-sm cursor-pointer">استبدال</span></Link></li>
              <li><Link href="/maintenance"><span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] sm:text-sm cursor-pointer">الصيانة</span></Link></li>
              <li><Link href="/about"><span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] sm:text-sm cursor-pointer">من نحن</span></Link></li>
              <li><Link href="/contact"><span className="text-muted-foreground hover:text-foreground transition-colors text-[10px] sm:text-sm cursor-pointer">التواصل</span></Link></li>
            </ul>
          </div>

          {/* 3. Contact Info - Column 2 */}
          <div className="col-span-1">
            <h3 className="font-bold text-xs sm:text-base lg:text-lg mb-3 sm:mb-4 text-primary">تواصل</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-primary/70" />
                  <span className="font-medium text-foreground hidden sm:inline">المقر:</span>
                </div>
                <p className="leading-tight">{settings?.addressShebin || "المنوفية"}</p>
              </li>

              <li className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                 <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-primary/70" />
                  <span className="font-medium text-foreground hidden sm:inline">الفرع:</span>
                </div>
                <p className="leading-tight">{settings?.addressZayed || "الشيخ زايد"}</p>
              </li>

              <li className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-primary/70" />
                </div>
                <a href={`tel:${settings?.mainPhone}`} className="font-['Inter'] hover:text-foreground truncate max-w-full" dir="ltr">
                  {settings?.mainPhone || "2010..."}
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Follow Us - Column 3 */}
          <div className="col-span-1">
            <h3 className="font-bold text-xs sm:text-base lg:text-lg mb-3 sm:mb-4 text-primary">تابعنا</h3>
            <div className="flex flex-col gap-3">
              <a href={settings?.facebookUrl} target="_blank" className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-muted hover-elevate text-blue-600">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href={settings?.instagramUrl} target="_blank" className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-muted hover-elevate text-pink-600">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} كيان ميديكال. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}