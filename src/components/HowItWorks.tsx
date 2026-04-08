import { Car, Shield, CreditCard, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  { icon: Car, title: "Choose Your Ride", desc: "Browse our fleet and pick the perfect vehicle for your trip.", num: "01" },
  { icon: Shield, title: "Submit Request", desc: "Fill in your details and dates. We'll check availability instantly.", num: "02" },
  { icon: CreditCard, title: "Get Approved & Drive", desc: "Our team reviews your request and you're ready to go!", num: "03" },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto text-center" ref={ref}>
        <div className={`scroll-hidden ${isVisible ? "scroll-visible" : ""}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 tracking-wide uppercase">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">How It Works</h2>
          <p className="text-muted-foreground mb-12 max-w-md mx-auto">Renting a car in Palawan has never been easier.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`relative flex flex-col items-center scroll-hidden-scale ${isVisible ? "scroll-visible-scale" : ""}`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-3xl gradient-ocean flex items-center justify-center shadow-glow">
                  <s.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                  {s.num}
                </span>
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[240px]">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden sm:block absolute top-10 -right-4 w-5 h-5 text-muted-foreground/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
