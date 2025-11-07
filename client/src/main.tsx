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
