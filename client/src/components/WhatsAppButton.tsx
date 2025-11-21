import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.link/hn35ok"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40"
      data-testid="button-whatsapp-float"
    >
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 border-green-600"
        aria-label="تواصل عبر واتساب"
      >
        <FaWhatsapp className="w-6 h-6" />
      </Button>
    </a>
  );
}