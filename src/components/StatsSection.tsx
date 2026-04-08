import { Car, Users, MapPin, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { icon: Car, value: "50+", label: "Vehicles Available", color: "text-primary" },
  { icon: Users, value: "10K+", label: "Happy Customers", color: "text-secondary" },
  { icon: MapPin, value: "25+", label: "Destinations Covered", color: "text-success" },
  { icon: Award, value: "5★", label: "Average Rating", color: "text-warning" },
];

export default function StatsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto" ref={ref}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`text-center scroll-hidden-scale ${isVisible ? "scroll-visible-scale" : ""}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-3 shadow-sm">
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
