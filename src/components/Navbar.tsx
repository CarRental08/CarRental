import { Sun, Moon, Car, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onScrollTo: (section: string) => void;
}

export default function Navbar({ onScrollTo }: NavbarProps) {
  const { isDark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", section: "hero" },
    { label: "Vehicles", section: "vehicles" },
    { label: "How It Works", section: "how-it-works" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <button onClick={() => onScrollTo("hero")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-ocean flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-foreground text-sm leading-none">PalExpress</span>
            <span className="block text-[10px] text-muted-foreground leading-none">Car Rental Palawan</span>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.section}
              onClick={() => onScrollTo(l.section)}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button
            onClick={() => onScrollTo("vehicles")}
            size="sm"
            className="hidden sm:flex gradient-ocean text-primary-foreground border-0 hover:opacity-90"
          >
            Browse Cars
          </Button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-card border-t animate-fade-in px-4 pb-4">
          {links.map((l) => (
            <button
              key={l.section}
              onClick={() => { onScrollTo(l.section); setMenuOpen(false); }}
              className="block w-full text-left px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
