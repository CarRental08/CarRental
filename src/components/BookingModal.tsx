import { useState, useMemo } from "react";
import type { Vehicle } from "@/data/vehicles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useBookings } from "@/hooks/useBookings";
import { CalendarDays, CheckCircle2, Car } from "lucide-react";

interface BookingModalProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
}

export default function BookingModal({ vehicle, open, onClose }: BookingModalProps) {
  const { addBooking, hasConflict, getAvailableUnits } = useBookings();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupDate: "",
    returnDate: "",
    notes: "",
  });

  const days = useMemo(() => {
    if (!form.pickupDate || !form.returnDate) return 0;
    const diff = new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [form.pickupDate, form.returnDate]);

  const discount = days >= 7 ? 0.1 : days >= 3 ? 0.05 : 0;
  const subtotal = (vehicle?.pricePerDay ?? 0) * days;
  const total = subtotal * (1 - discount);

  const availableUnits = useMemo(() => {
    if (!vehicle || !form.pickupDate || !form.returnDate) return vehicle?.fleetCount ?? 0;
    return getAvailableUnits(vehicle.id, form.pickupDate, form.returnDate);
  }, [vehicle, form.pickupDate, form.returnDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    if (hasConflict(vehicle.id, form.pickupDate, form.returnDate)) {
      toast.error("All units are booked for these dates. Please choose different dates.");
      return;
    }

    addBooking({
      vehicleId: vehicle.id,
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      pickupDate: form.pickupDate,
      returnDate: form.returnDate,
      totalPrice: total,
      notes: form.notes,
    });

    setSubmitted(true);
    toast.success("Booking request submitted! Waiting for admin approval.");
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ customerName: "", customerEmail: "", customerPhone: "", pickupDate: "", returnDate: "", notes: "" });
    onClose();
  };

  if (!vehicle) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-8 animate-scale-in">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Request Submitted!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your booking for <strong>{vehicle.name}</strong> is pending admin approval. We'll get back to you soon.
            </p>
            <Button onClick={handleClose} className="gradient-ocean text-primary-foreground border-0">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Book {vehicle.name}
              </DialogTitle>
              <DialogDescription>
                Fill in your details to submit a booking request.
              </DialogDescription>
            </DialogHeader>

            {/* Fleet availability badge */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent">
              <Car className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm text-accent-foreground">
                Fleet: <strong>{vehicle.fleetCount}</strong> units total
              </span>
              {form.pickupDate && form.returnDate && (
                <Badge className={`ml-auto text-xs border-0 ${availableUnits > 0 ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                  {availableUnits} available
                </Badge>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pickup" className="text-xs">Pickup Date</Label>
                  <Input
                    id="pickup"
                    type="date"
                    min={today}
                    value={form.pickupDate}
                    onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="return" className="text-xs">Return Date</Label>
                  <Input
                    id="return"
                    type="date"
                    min={form.pickupDate || today}
                    value={form.returnDate}
                    onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {days > 0 && (
                <div className="p-3 rounded-lg bg-accent text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">{days} day(s) × ₱{vehicle.pricePerDay.toLocaleString()}</span><span>₱{subtotal.toLocaleString()}</span></div>
                  {discount > 0 && <div className="flex justify-between text-success"><span>Discount ({discount * 100}%)</span><span>-₱{(subtotal * discount).toLocaleString()}</span></div>}
                  <div className="flex justify-between font-bold text-foreground border-t border-border pt-1"><span>Total</span><span>₱{total.toLocaleString()}</span></div>
                </div>
              )}

              <div>
                <Label htmlFor="name" className="text-xs">Full Name</Label>
                <Input id="name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input id="email" type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} required maxLength={255} />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs">Phone</Label>
                <Input id="phone" type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} required maxLength={20} />
              </div>
              <div>
                <Label htmlFor="notes" className="text-xs">Notes (optional)</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} maxLength={500} />
              </div>

              <Button
                type="submit"
                disabled={form.pickupDate && form.returnDate ? availableUnits <= 0 : false}
                className="w-full gradient-ocean text-primary-foreground border-0 hover:opacity-90"
              >
                {form.pickupDate && form.returnDate && availableUnits <= 0
                  ? "All Units Booked — Try Different Dates"
                  : "Submit Booking Request"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
