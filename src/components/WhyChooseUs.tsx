import { Shield, Clock, Headphones, Sparkles, CreditCard, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  { icon: Shield, title: "Fully Insured", desc: "All vehicles come with comprehensive insurance coverage." },
  { icon: Clock, title: "24/7 Support", desc: "Round-the-clock roadside assistance and customer support." },
  { icon: Headphones, title: "Easy Booking", desc: "Simple online booking with instant confirmation." },
  { icon: Sparkles, title: "Well Maintained", desc: "Regularly serviced and sanitized vehicles for your safety." },
  { icon: CreditCard, title: "Best Prices", desc: "Competitive rates with discounts for longer rentals." },
  { icon: MapPin, title: "Free Delivery", desc: "Complimentary vehicle delivery to airport and hotels." },
];

export default function WhyChooseUs() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div ref={headerRef} className={`text-center mb-12 scroll-hidden ${headerVisible ? "scroll-visible" : ""}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-4 tracking-wide uppercase">
            Why PalExpress
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We go beyond just renting cars — we deliver unforgettable experiences.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`group flex items-start gap-4 p-5 rounded-2xl hover:bg-card hover:shadow-md transition-all duration-300 ${
                i % 2 === 0 ? "scroll-hidden-left" : "scroll-hidden-right"
              } ${gridVisible ? (i % 2 === 0 ? "scroll-visible-x" : "scroll-visible-x") : ""}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <r.icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
