import { Link } from "wouter";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import logoUrl from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-card border-t border-card-border mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <img src={logoUrl} alt="كيان ميديكال" className="h-12 sm:h-14 md:h-16 w-auto" />
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              كيان ميديكال - شريكك الموثوق في توفير أحدث أجهزة السونار الطبية مع خدمات صيانة متميزة
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" data-testid="link-footer-home">
                  <span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link href="/products" data-testid="link-footer-products">
                  <span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">المنتجات</span>
                </Link>
              </li>
              <li>
                <Link href="/maintenance" data-testid="link-footer-maintenance">
                  <span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">الصيانة</span>
                </Link>
              </li>
              <li>
                <Link href="/about" data-testid="link-footer-about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">من نحن</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-footer-contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">التواصل</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">معلومات التواصل</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">المقر الرئيسي</p>
                  <p>شيبين الكوم، المنوفية</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">المقر الثاني</p>
                  <p>الشيخ زايد، القاهرة</p>
                </div>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <a href="https://wa.link/hn35ok" target="_blank" rel="noopener noreferrer" className="font-['Inter'] hover:text-foreground transition-colors" dir="ltr">+20 10 25253012</a>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-['Inter']" dir="ltr">info@kayanmedical.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">تابعنا</h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-md bg-muted hover-elevate active-elevate-2"
                data-testid="link-facebook"
                aria-label="فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-md bg-muted hover-elevate active-elevate-2"
                data-testid="link-instagram"
                aria-label="إنستجرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} كيان ميديكال. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
