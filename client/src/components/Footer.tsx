import { Link } from "wouter";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  const { data: settingsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  const settings = settingsData?.data;

  return (
    <footer className="bg-card border-t border-card-border mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12">
        {/* CHANGED: lg:grid-cols-3 (was 4) to merge the last two columns */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* 1. Company Info - Full width on mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-3 sm:space-y-4">
            <img src={logoUrl} alt="كيان ميديكال" className="h-12 sm:h-14 md:h-16 w-auto" />
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs">
              كيان ميديكال - شريكك الموثوق في توفير أحدث أجهزة السونار الطبية مع خدمات صيانة متميزة
            </p>
          </div>

          {/* 2. Quick Links - Column 1 on Mobile */}
          <div className="col-span-1">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/"><span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">الرئيسية</span></Link></li>
              <li><Link href="/products"><span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">المنتجات</span></Link></li>
              <li><Link href="/trade-in"><span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">شراء واستبدال</span></Link></li>
              <li><Link href="/maintenance"><span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">الصيانة</span></Link></li>
              <li><Link href="/about"><span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">من نحن</span></Link></li>
              <li><Link href="/contact"><span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">التواصل</span></Link></li>
            </ul>
          </div>

          {/* 3. Contact & Social - Column 2 on Mobile (Merged) */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* Contact Info Block */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">معلومات التواصل</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">المقر الرئيسي</p>
                    <p>{settings?.addressShebin || "شيبين الكوم، المنوفية"}</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">المقر الثاني</p>
                    <p>{settings?.addressZayed || "الشيخ زايد، القاهرة"}</p>
                  </div>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <a href={`tel:${settings?.mainPhone}`} className="font-['Inter'] hover:text-foreground" dir="ltr">{settings?.mainPhone || "+20 10 25253012"}</a>
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <a href={`mailto:${settings?.email}`} className="font-['Inter'] hover:text-foreground" dir="ltr">{settings?.email || "info@kayanmedical.com"}</a>
                </li>
              </ul>
            </div>

            {/* Social Media Block (Merged here to stay beside links) */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">تابعنا</h3>
              <div className="flex gap-3">
                <a href={settings?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-md bg-muted hover-elevate transition-all hover:bg-primary hover:text-primary-foreground">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={settings?.instagramUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-md bg-muted hover-elevate transition-all hover:bg-primary hover:text-primary-foreground">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} كيان ميديكال. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}