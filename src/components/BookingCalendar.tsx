import { useMemo, useState } from "react";
import { vehicles } from "@/data/vehicles";
import type { Booking } from "@/data/vehicles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingCalendarProps {
  bookings: Booking[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [year, month]);

  const getBookingsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const date = new Date(dateStr);
    return bookings.filter((b) => {
      const pickup = new Date(b.pickupDate);
      const returnD = new Date(b.returnDate);
      return date >= pickup && date <= returnD && b.status !== "rejected";
    });
  };

  /** For a given day, compute available units per vehicle */
  const getFleetStatusForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const date = new Date(dateStr);
    const nextDay = new Date(dateStr);
    nextDay.setDate(nextDay.getDate() + 1);

    return vehicles.map((v) => {
      const booked = bookings.filter(
        (b) =>
          b.vehicleId === v.id &&
          b.status !== "rejected" &&
          new Date(b.pickupDate) < nextDay &&
          new Date(b.returnDate) > date
      ).length;
      return {
        vehicle: v,
        booked,
        available: Math.max(0, v.fleetCount - booked),
      };
    });
  };

  const getVehicleName = (id: string) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? v.name.split(" ").pop() ?? v.name : "Unknown";
  };

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null); };
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null); };
  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const statusColor: Record<string, string> = {
    pending: "bg-warning/20 text-warning border-warning/30",
    approved: "bg-success/20 text-success border-success/30",
  };

  const selectedFleetStatus = selectedDay ? getFleetStatusForDay(selectedDay) : null;
  const selectedDayBookings = selectedDay ? getBookingsForDay(selectedDay) : [];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-foreground">Booking Calendar</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground min-w-[140px] text-center">
            {MONTHS[month]} {year}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="min-h-[72px]" />;
            }

            const dayBookings = getBookingsForDay(day);
            const totalBooked = dayBookings.length;
            const isSelected = selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`min-h-[72px] rounded-lg p-1 text-xs border transition-colors cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : isToday(day)
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/50"
                }`}
              >
                <span
                  className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-[11px] font-medium mb-0.5 ${
                    isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {day}
                </span>
                <div className="space-y-0.5">
                  {dayBookings.slice(0, 2).map((b) => (
                    <div
                      key={b.id}
                      className={`text-[9px] px-1 py-0.5 rounded border truncate font-medium ${statusColor[b.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {getVehicleName(b.vehicleId)}
                    </div>
                  ))}
                  {totalBooked > 2 && (
                    <span className="text-[9px] text-muted-foreground pl-1">+{totalBooked - 2} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-warning/20 border border-warning/30" />
            <span className="text-[10px] text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-success/20 border border-success/30" />
            <span className="text-[10px] text-muted-foreground">Approved</span>
          </div>
          <span className="text-[10px] text-muted-foreground ml-auto">Click a day to see fleet availability</span>
        </div>
      </div>

      {/* Selected day detail panel */}
      {selectedDay && selectedFleetStatus && (
        <div className="border-t border-border p-4 bg-muted/20 animate-fade-in">
          <h3 className="font-bold text-foreground text-sm mb-3">
            Fleet Availability — {MONTHS[month]} {selectedDay}, {year}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {selectedFleetStatus.map(({ vehicle, booked, available }) => (
              <div key={vehicle.id} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
                {vehicle.image && (
                  <img src={vehicle.image} alt={vehicle.name} className="w-10 h-7 rounded object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{vehicle.name}</p>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-success font-medium">{available} avail</span>
                    <span className="text-muted-foreground">·</span>
                    <span className={`font-medium ${booked > 0 ? "text-warning" : "text-muted-foreground"}`}>{booked} booked</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{vehicle.fleetCount} total</span>
                  </div>
                </div>
                {/* Availability bar */}
                <div className="w-12 h-2 rounded-full bg-muted overflow-hidden shrink-0">
                  <div
                    className={`h-full rounded-full transition-all ${available === 0 ? "bg-destructive" : available < vehicle.fleetCount ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${(available / vehicle.fleetCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bookings for the day */}
          {selectedDayBookings.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Bookings on this day</h4>
              <div className="space-y-1">
                {selectedDayBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-2 text-xs p-1.5 rounded bg-card border border-border">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${b.status === "approved" ? "bg-success" : "bg-warning"}`} />
                    <span className="font-medium text-foreground">{b.customerName}</span>
                    <span className="text-muted-foreground">— {getVehicleName(b.vehicleId)}</span>
                    <span className="text-muted-foreground ml-auto">{b.pickupDate} → {b.returnDate}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${b.status === "approved" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
