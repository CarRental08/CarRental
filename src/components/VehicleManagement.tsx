import { useState } from "react";
import { vehicles as defaultVehicles, type Vehicle, type VehicleType, type Transmission, type AvailabilityStatus } from "@/data/vehicles";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Car, Search } from "lucide-react";
import { toast } from "sonner";

const VEHICLES_KEY = "palexpress_vehicles";

function getStoredVehicles(): Vehicle[] {
  try {
    const stored = localStorage.getItem(VEHICLES_KEY);
    return stored ? JSON.parse(stored) : defaultVehicles;
  } catch {
    return defaultVehicles;
  }
}

function saveVehicles(v: Vehicle[]) {
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(v));
}

const emptyVehicle: Omit<Vehicle, "id"> = {
  name: "",
  brand: "",
  type: "Sedan",
  transmission: "Automatic",
  seats: 5,
  pricePerDay: 2000,
  fuelType: "Gasoline",
  engineType: "",
  image: "",
  status: "Available",
  description: "",
  features: [],
  fleetCount: 1,
};

export default function VehicleManagement() {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(getStoredVehicles);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyVehicle);
  const [featuresInput, setFeaturesInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { getCurrentAvailableUnits } = useBookings();

  const filtered = vehicleList.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingVehicle(null);
    setForm(emptyVehicle);
    setFeaturesInput("");
    setModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({ ...v });
    setFeaturesInput(v.features.join(", "));
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.brand) {
      toast.error("Name and brand are required.");
      return;
    }
    const features = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingVehicle) {
      const updated = vehicleList.map((v) =>
        v.id === editingVehicle.id ? { ...v, ...form, features } : v
      );
      setVehicleList(updated);
      saveVehicles(updated);
      toast.success("Vehicle updated!");
    } else {
      const newVehicle: Vehicle = {
        ...form,
        features,
        id: crypto.randomUUID(),
      };
      const updated = [...vehicleList, newVehicle];
      setVehicleList(updated);
      saveVehicles(updated);
      toast.success("Vehicle added!");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = vehicleList.filter((v) => v.id !== id);
    setVehicleList(updated);
    saveVehicles(updated);
    setDeleteConfirm(null);
    toast.success("Vehicle deleted.");
  };

  const vehicleTypes: VehicleType[] = ["SUV", "Sedan", "Van", "Compact"];
  const transmissions: Transmission[] = ["Automatic", "Manual"];
  const statuses: AvailabilityStatus[] = ["Available", "Booked", "Maintenance"];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Car className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Vehicle Management</h2>
          <Badge variant="secondary" className="text-xs">{vehicleList.length} models</Badge>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted border-0"
            />
          </div>
          <Button size="sm" onClick={openAdd} className="gradient-ocean text-primary-foreground border-0 gap-1.5">
            <Plus className="w-4 h-4" /> Add Vehicle
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="p-8 text-center text-muted-foreground">No vehicles found.</p>
      ) : (
        <div className="divide-y divide-border">
          {filtered.map((v) => {
            const availableNow = getCurrentAvailableUnits(v.id);
            const bookedNow = v.fleetCount - availableNow;
            const dynamicStatus = availableNow === 0 ? "Fully Booked" : availableNow < v.fleetCount ? "Partially Booked" : "All Available";
            const dynamicStatusColor =
              availableNow === 0
                ? "bg-destructive text-destructive-foreground"
                : availableNow < v.fleetCount
                ? "bg-warning text-warning-foreground"
                : "bg-success text-success-foreground";

            return (
              <div key={v.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {v.image ? (
                    <img src={v.image} alt={v.name} className="w-14 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.brand} · {v.type} · {v.seats} seats · ₱{v.pricePerDay.toLocaleString()}/day
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Dynamic fleet status */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-xs">
                    <span className="text-muted-foreground">Fleet:</span>
                    <span className="font-bold text-success">{availableNow}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-medium text-foreground">{v.fleetCount}</span>
                    {bookedNow > 0 && (
                      <span className="text-muted-foreground">
                        ({bookedNow} booked)
                      </span>
                    )}
                  </div>
                  <Badge className={`${dynamicStatusColor} border-0 text-xs`}>
                    {dynamicStatus}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => openEdit(v)} className="h-7 w-7 p-0">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteConfirm(v.id)}
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
            <DialogDescription>
              {editingVehicle ? "Update vehicle details below." : "Fill in the details to add a new vehicle."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Toyota Fortuner" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand *</label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Toyota" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as VehicleType })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Trans.</label>
                <select
                  value={form.transmission}
                  onChange={(e) => setForm({ ...form, transmission: e.target.value as Transmission })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Seats</label>
                <Input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: +e.target.value })} min={1} max={20} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Fleet #</label>
                <Input type="number" value={form.fleetCount} onChange={(e) => setForm({ ...form, fleetCount: +e.target.value })} min={1} max={50} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Price/Day (₱)</label>
                <Input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: +e.target.value })} min={0} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Fuel Type</label>
                <Input value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} placeholder="Diesel" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Engine</label>
              <Input value={form.engineType} onChange={(e) => setForm({ ...form, engineType: e.target.value })} placeholder="2.4L Turbo" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Image URL</label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                placeholder="Short description..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Features (comma-separated)</label>
              <Input value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} placeholder="4WD, Bluetooth, USB Charging" />
            </div>
            <Button onClick={handleSave} className="w-full gradient-ocean text-primary-foreground border-0">
              {editingVehicle ? "Save Changes" : "Add Vehicle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
