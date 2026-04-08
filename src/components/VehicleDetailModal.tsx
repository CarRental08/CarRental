import type { Vehicle } from "@/data/vehicles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Settings2, Gauge, Check, Car } from "lucide-react";

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  onBook: (v: Vehicle) => void;
}

export default function VehicleDetailModal({ vehicle, open, onClose, onBook }: VehicleDetailModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Image */}
        <div className="relative aspect-video">
          <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">{vehicle.name}</DialogTitle>
                <DialogDescription>{vehicle.brand} · {vehicle.type}</DialogDescription>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-primary">₱{vehicle.pricePerDay.toLocaleString()}</span>
                <span className="block text-xs text-muted-foreground">/day</span>
              </div>
            </div>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">{vehicle.description}</p>

          {/* Fleet info */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent mb-4">
            <Car className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm text-accent-foreground">
              <strong>{vehicle.fleetCount}</strong> units in fleet
            </span>
            <Badge className="ml-auto bg-success text-success-foreground border-0 text-xs">
              Available
            </Badge>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { icon: Users, label: "Seats", value: `${vehicle.seats} passengers` },
              { icon: Settings2, label: "Transmission", value: vehicle.transmission },
              { icon: Fuel, label: "Fuel", value: vehicle.fuelType },
              { icon: Gauge, label: "Engine", value: vehicle.engineType },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Icon className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <p className="text-xs font-semibold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((f) => (
                <Badge key={f} variant="secondary" className="text-xs gap-1">
                  <Check className="w-3 h-3" /> {f}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={() => onBook(vehicle)}
            className="w-full gradient-ocean text-primary-foreground border-0 hover:opacity-90"
          >
            Book This Vehicle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
