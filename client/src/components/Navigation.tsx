import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoUrl from "@/assets/logo.png";
import { useQuery } from "@tanstack/react-query";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  // Fetch site settings for dynamic contact info
  const { data: settingsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["/api/settings"],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  const settings = settingsData?.data;

  const navItems = [
    { path: "/", label: "الرئيسية" },
    { path: "/products", label: "بيع" },
    { path: "/trade-in", label: "شراء واستبدال" },
    { path: "/maintenance", label: "صيانة" },
    { path: "/about", label: "من نحن" },
    { path: "/contact", label: "التواصل" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-card-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Right side for RTL */}
          <Link href="/" data-testid="link-home-logo">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2">
              <img src={logoUrl} alt="كيان ميديكال" className="h-12 w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link key={`${item.path}-${index}`} href={item.path} data-testid={`link-nav-${item.label}`}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className="text-base font-medium"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Contact Info - Left side for RTL */}
          <div className="hidden md:flex items-center gap-2">
            <a 
              href={settings?.whatsappLink || "https://wa.link/hn35ok"} 
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-phone"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-['Inter']" dir="ltr">{settings?.mainPhone || "+20 10 25253012"}</span>
            </a>
            <a
              href={settings?.whatsappLink || "https://wa.link/hn35ok"}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-whatsapp-header"
            >
              <Button variant="default" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover-elevate active-elevate-2 rounded-md"
            data-testid="button-menu-toggle"
            aria-label="القائمة"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border" data-testid="mobile-menu">
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link key={`${item.path}-${index}`} href={item.path}>
                  <Button
                    variant={location === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start text-base"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`link-mobile-${item.label}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <a href={settings?.whatsappLink || "https://wa.link/hn35ok"} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-mobile-phone">
                    <Phone className="w-4 h-4" />
                    <span className="font-['Inter']" dir="ltr">{settings?.mainPhone || "+20 10 25253012"}</span>
                  </Button>
                </a>
                <a href={settings?.whatsappLink || "https://wa.link/hn35ok"} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="w-full gap-2" data-testid="button-mobile-whatsapp">
                    <MessageCircle className="w-4 h-4" />
                    <span>تواصل عبر واتساب</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}