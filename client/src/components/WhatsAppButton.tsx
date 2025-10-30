import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/201234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40"
      data-testid="button-whatsapp-float"
    >
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent border-accent-border"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </a>
  );
}
