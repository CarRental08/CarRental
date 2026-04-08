import type { Vehicle } from "@/data/vehicles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Settings2, Heart, Car } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (v: Vehicle) => void;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function VehicleCard({ vehicle, onSelect, index, isFavorite, onToggleFavorite }: VehicleCardProps) {
  const { getCurrentAvailableUnits } = useBookings();
  const availableNow = getCurrentAvailableUnits(vehicle.id);

  const availabilityLabel =
    availableNow === 0
      ? "Fully Booked"
      : availableNow < vehicle.fleetCount
      ? `${availableNow}/${vehicle.fleetCount} Available`
      : "Available";

  const availabilityColor =
    availableNow === 0
      ? "bg-destructive text-destructive-foreground"
      : availableNow < vehicle.fleetCount
      ? "bg-warning text-warning-foreground"
      : "bg-success text-success-foreground";

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover-lift group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className={`absolute top-3 left-3 ${availabilityColor} border-0 text-xs`}>
          {availabilityLabel}
        </Badge>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(vehicle.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center hover:bg-card/80 transition-all hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFavorite ? "fill-destructive text-destructive" : "text-foreground"}`}
          />
        </button>
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-foreground/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="text-lg font-extrabold text-primary-foreground drop-shadow-md">₱{vehicle.pricePerDay.toLocaleString()}</span>
          <span className="text-[10px] text-primary-foreground/80 ml-1">/day</span>
        </div>
        {/* Fleet count badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-card/60 backdrop-blur-sm">
          <Car className="w-3 h-3 text-primary-foreground" />
          <span className="text-[10px] font-semibold text-primary-foreground">{availableNow}/{vehicle.fleetCount}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-foreground text-base">{vehicle.name}</h3>
          <p className="text-xs text-muted-foreground">{vehicle.brand} · {vehicle.type}</p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md"><Users className="w-3 h-3" />{vehicle.seats}</span>
          <span className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md"><Settings2 className="w-3 h-3" />{vehicle.transmission}</span>
          <span className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md"><Fuel className="w-3 h-3" />{vehicle.fuelType}</span>
        </div>

        <Button
          onClick={() => onSelect(vehicle)}
          className="w-full gradient-ocean text-primary-foreground border-0 hover:opacity-90 text-sm"
          size="sm"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
