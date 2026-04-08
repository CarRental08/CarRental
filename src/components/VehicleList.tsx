import { useState, useMemo } from "react";
import { type Vehicle, type VehicleType } from "@/data/vehicles";
import VehicleCard from "@/components/VehicleCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useVehicles } from "@/hooks/useVehicles";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface VehicleListProps {
  onSelectVehicle: (v: Vehicle) => void;
}

const types: VehicleType[] = ["SUV", "Sedan", "Van", "Compact"];

export default function VehicleList({ onSelectVehicle }: VehicleListProps) {
  const { vehicles } = useVehicles();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<VehicleType | "All">("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.05);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All" || v.type === typeFilter;
      const matchFav = !showFavoritesOnly || isFavorite(v.id);
      return matchSearch && matchType && matchFav;
    });
  }, [search, typeFilter, showFavoritesOnly, favorites, vehicles]);

  return (
    <section id="vehicles" className="py-20 px-4">
      <div className="container mx-auto">
        <div ref={headerRef} className={`text-center mb-10 scroll-hidden ${headerVisible ? "scroll-visible" : ""}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-4 tracking-wide uppercase">
            Our Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Choose Your Ride</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Choose from our premium selection of vehicles for your Palawan adventure.</p>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showFavoritesOnly
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-destructive" : ""}`} />
              <span className="hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="text-[10px] bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-sm text-muted-foreground"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Type filters */}
        <div className={`flex flex-wrap gap-2 justify-center mb-8 ${showFilters ? "" : "hidden sm:flex"}`}>
          {["All", ...types].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t as VehicleType | "All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                typeFilter === t
                  ? "gradient-ocean text-primary-foreground shadow-glow"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-2">
              {showFavoritesOnly ? "No favorite vehicles yet." : "No vehicles match your search."}
            </p>
            {showFavoritesOnly && (
              <button onClick={() => setShowFavoritesOnly(false)} className="text-sm text-primary hover:underline">
                Show all vehicles
              </button>
            )}
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v, i) => (
              <div
                key={v.id}
                className={`scroll-hidden ${gridVisible ? "scroll-visible" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <VehicleCard
                  vehicle={v}
                  onSelect={onSelectVehicle}
                  index={i}
                  isFavorite={isFavorite(v.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}