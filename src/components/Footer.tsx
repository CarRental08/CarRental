import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Lock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FooterProps {
  onSystemClick: () => void;
}

export default function Footer({ onSystemClick }: FooterProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <footer id="contact" className="bg-card border-t border-border py-12 px-4">
      <div className="container mx-auto" ref={ref}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 scroll-hidden ${isVisible ? "scroll-visible" : ""}`}>
          <div>
            <h3 className="font-bold text-foreground mb-3">PalExpress Car Rental</h3>
            <p className="text-sm text-muted-foreground mb-4">Your trusted partner for premium car rentals in the heart of Palawan.</p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +63 917 123 4567</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@palexpress.ph</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Puerto Princesa, Palawan</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Services</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="cursor-pointer hover:text-foreground transition-colors">Self-Drive Rentals</p>
              <p className="cursor-pointer hover:text-foreground transition-colors">Airport Pickup</p>
              <p className="cursor-pointer hover:text-foreground transition-colors">Group Tours</p>
              <p className="cursor-pointer hover:text-foreground transition-colors">Long-Term Leasing</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</p>
              <p className="cursor-pointer hover:text-foreground transition-colors">Privacy Policy</p>
              <p className="cursor-pointer hover:text-foreground transition-colors">FAQ</p>
              <p className="cursor-pointer hover:text-foreground transition-colors">Cancellation Policy</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">© 2026 PalExpress Car Rental Palawan. All rights reserved.</p>
          <button
            onClick={onSystemClick}
            className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/60 hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/5"
          >
            <Lock className="w-3 h-3" />
            SYSTEM ACCESS
          </button>
        </div>
      </div>
    </footer>
  );
}