import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react"; 
import { useScrollAnimation } from "@/hooks/useScrollAnimation"; 
interface FooterProps { 
  onSystemClick: () => void; 
} 
export default function Footer({ onSystemClick }: FooterProps) { 
  const { ref, isVisible } = useScrollAnimation(0.1); 
  return ( 
    <footer id="contact" className="bg-card border-t border-border py-12 px-4"> 
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 scroll-hidden ${isVisible ? "scroll-visible" : ""}`}> 
        {/* ... existing content ... */} 
      </div> 
      <div className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-sunset text-secondary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center`}> 
        <button onClick={onSystemClick} className="flex items-center justify-center w-full h-full"> 
          <MessageCircle className="w-5 h-5 text-primary-foreground" /> 
          <span className="text-xs text-muted-foreground ml-2">SYSTEM</span> 
        </button> 
      </div> 
    </footer> 
  ); 
}