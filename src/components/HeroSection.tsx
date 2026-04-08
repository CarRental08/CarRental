import heroBanner from "@/assets/hero-banner.jpg"; 
import { Button } from "@/components/ui/button"; 
import { ChevronDown, MapPin, Star, Shield } from "lucide-react"; 
interface HeroSectionProps { 
  onBrowse: () => void; 
} 
export default function HeroSection({ onBrowse }: HeroSectionProps) { 
  return ( 
    <section id="hero" className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden"> 
      {/* ... existing content ... */} 
      <button onClick={onBrowse} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 animate-bounce md:hidden"> 
        <ChevronDown className="w-6 h-6" /> 
      </button> 
    </section> 
  ); 
}