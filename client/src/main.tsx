import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// CRITICAL: Force unregister any old service workers that may be caching stale code
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      console.log('Unregistering old service worker:', registration);
      registration.unregister();
    }
  });
}

// Force clear any stale caches
if ('caches' in window) {
  caches.keys().then(names => {
    for (const name of names) {
      console.log('Deleting cache:', name);
      caches.delete(name);
    }
  });
}

console.log('App version: 2024-11-07-v2 - Login fix with session verification');

createRoot(document.getElementById("root")!).render(<App />);

// WhatsApp Purchase Tracking
// Event Delegation — captures all WhatsApp links: wa.me, api.whatsapp.com, whatsapp://
// Fires before navigation, works for dynamically rendered and future buttons automatically
document.addEventListener("click", function (e) {
  const target = (e.target as Element).closest("a");
  if (!target) return;

  const href = target.getAttribute("href") || "";
  const isWhatsApp =
    href.startsWith("https://wa.me/") ||
    href.startsWith("https://api.whatsapp.com/") ||
    href.startsWith("whatsapp://");

  if (!isWhatsApp) return;

  // GTM Purchase Event — push before navigation
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: "whatsapp_" + Date.now(),
      value: 1,
      currency: "EGP",
      items: [
        {
          item_name: "WhatsApp Lead",
          item_category: "Lead",
          quantity: 1,
        },
      ],
    },
  });

  // Prevent immediate navigation, wait ~200ms for GTM to process the event, then navigate
  const href_final = target.href;
  const target_attr = target.getAttribute("target");
  e.preventDefault();
  setTimeout(function () {
    if (target_attr === "_blank") {
      window.open(href_final, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href_final;
    }
  }, 200);
}, true);
