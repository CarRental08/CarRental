import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, Star, Shield } from "lucide-react";

interface HeroSectionProps {
  onBrowse: () => void;
}

export default function HeroSection({ onBrowse }: HeroSectionProps) {
  return (
    <section id="hero" className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroBanner}
        alt="Luxury car on a Palawan coastal road"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Overlay */}
      <div className="absolute inset-0 gradient-hero-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-md border border-card/20 text-primary-foreground text-xs font-medium mb-6">
          <MapPin className="w-3 h-3" />
          Puerto Princesa, Palawan
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
          Explore Palawan
          <span className="block text-secondary">Your Way</span>
        </h1>
        <p className="text-primary-foreground/80 text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Premium car rentals for unforgettable island adventures. Drive through paradise with PalExpress.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Button
            size="lg"
            onClick={onBrowse}
            className="gradient-ocean text-primary-foreground border-0 hover:opacity-90 px-8 text-base shadow-glow"
          >
            Browse Vehicles
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onBrowse}
            className="bg-card/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-card/20 hover:text-primary-foreground"
          >
            View Rates
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-primary-foreground/60 text-xs">
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-warning text-warning" /> 4.9 Rating</span>
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Fully Insured</span>
          <span className="flex items-center gap-1">🚗 50+ Cars</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onBrowse}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}
