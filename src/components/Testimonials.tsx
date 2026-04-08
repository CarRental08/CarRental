import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Maria Santos",
    location: "Manila, Philippines",
    rating: 5,
    text: "Best car rental experience in Palawan! The Fortuner was in pristine condition and the booking process was seamless.",
    avatar: "MS",
  },
  {
    name: "James Cooper",
    location: "Sydney, Australia",
    rating: 5,
    text: "Incredible service. We rented the HiAce for our group tour to El Nido. Everything was perfect from start to finish.",
    avatar: "JC",
  },
  {
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    rating: 5,
    text: "Very professional and reliable. The Jimny was perfect for exploring hidden beaches. Will definitely rent again!",
    avatar: "YT",
  },
];

export default function Testimonials() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div ref={headerRef} className={`text-center mb-12 scroll-hidden ${headerVisible ? "scroll-visible" : ""}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-4 tracking-wide uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Trusted by thousands of travelers exploring Palawan.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-6 hover-lift scroll-hidden ${gridVisible ? "scroll-visible" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-ocean flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
