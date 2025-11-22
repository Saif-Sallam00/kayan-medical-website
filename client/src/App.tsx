import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import TradeIn from "@/pages/TradeIn";
import Maintenance from "@/pages/Maintenance";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Offers from "@/pages/Offers";
// ✅ NEW: Portfolio Page Import
import Portfolio from "@/pages/Portfolio";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/trade-in" component={TradeIn} />
      <Route path="/maintenance" component={Maintenance} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/offers" component={Offers} />
      {/* ✅ NEW: Portfolio Route */}
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;