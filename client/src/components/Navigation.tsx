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
        {/* Main Flex Container */}
        <div className="flex items-center justify-between h-28">

          {/* 1. LOGO SECTION (Fixed) */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/">
              <img 
                src={logoUrl} 
                alt="Kayan Medical" 
                className="h-24 w-auto object-contain transition-all hover:scale-105" 
              />
            </Link>
          </div>

          {/* 2. NAVIGATION LINKS (Centered) */}
          {/* flex-1: takes all empty space, justify-center: centers the items inside */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    location === item.path
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          {/* 3. ACTION BUTTONS (Fixed) */}
          <div className="hidden md:flex items-center gap-3">
            <a href={settings?.whatsappLink || "https://wa.link/hn35ok"} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm" className="gap-2" data-testid="button-whatsapp">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden lg:inline">واتساب</span>
              </Button>
            </a>
            <a href={`tel:${settings?.mainPhone || "+201025253012"}`}>
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-phone">
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline" dir="ltr">{settings?.mainPhone || "+20 10 25253012"}</span>
              </Button>
            </a>
          </div>

          {/* MOBILE MENU TOGGLE (Small Screens Only) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-28 left-0 w-full bg-card border-b border-card-border shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
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
                <a href={`tel:${settings?.mainPhone || "+201025253012"}`}>
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