import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useAdmin } from "@/hooks/useAdmin";
import { vehicles } from "@/data/vehicles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Clock, CheckCircle, XCircle, Car, TrendingUp, AlertCircle, CalendarDays, List, Settings2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import BookingCalendar from "@/components/BookingCalendar";
import VehicleManagement from "@/components/VehicleManagement";
import AnalyticsCharts from "@/components/AnalyticsCharts";

interface AdminDashboardProps {
  onExit: () => void;
}

type AdminView = "list" | "calendar" | "vehicles" | "analytics";

export default function AdminDashboard({ onExit }: AdminDashboardProps) {
  const { bookings, updateBookingStatus } = useBookings();
  const { logout } = useAdmin();
  const [view, setView] = useState<AdminView>("list");

  const pending = bookings.filter((b) => b.status === "pending");
  const approved = bookings.filter((b) => b.status === "approved");
  const totalRevenue = approved.reduce((s, b) => s + b.totalPrice, 0);

  const handleApprove = (id: string) => {
    updateBookingStatus(id, "approved");
    toast.success("Booking approved!");
  };

  const handleReject = (id: string) => {
    updateBookingStatus(id, "rejected");
    toast.info("Booking rejected.");
  };

  const handleExit = () => {
    logout();
    onExit();
  };

  const getVehicleName = (id: string) => vehicles.find((v) => v.id === id)?.name ?? "Unknown";

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; icon: React.ReactNode }> = {
      pending: { class: "bg-warning text-warning-foreground", icon: <Clock className="w-3 h-3" /> },
      approved: { class: "bg-success text-success-foreground", icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { class: "bg-destructive text-destructive-foreground", icon: <XCircle className="w-3 h-3" /> },
    };
    const s = map[status];
    return <Badge className={`${s.class} border-0 gap-1 text-xs`}>{s.icon}{status}</Badge>;
  };

  const viewTabs: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: "list", label: "Bookings", icon: <List className="w-4 h-4" /> },
    { key: "calendar", label: "Calendar", icon: <CalendarDays className="w-4 h-4" /> },
    { key: "vehicles", label: "Vehicles", icon: <Settings2 className="w-4 h-4" /> },
    { key: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage bookings, vehicles, and analytics</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExit} className="gap-2">
            <LogOut className="w-4 h-4" /> Exit Admin
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: bookings.length, icon: Car, color: "text-primary" },
            { label: "Pending", value: pending.length, icon: AlertCircle, color: "text-warning" },
            { label: "Approved", value: approved.length, icon: CheckCircle, color: "text-success" },
            { label: "Est. Revenue", value: `₱${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-secondary" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-xl p-4 hover-lift">
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className="text-2xl font-extrabold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {viewTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                view === tab.key ? "gradient-ocean text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {view === "calendar" ? (
          <BookingCalendar bookings={bookings} />
        ) : view === "vehicles" ? (
          <VehicleManagement />
        ) : view === "analytics" ? (
          <AnalyticsCharts bookings={bookings} />
        ) : (
          /* Bookings table */
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-foreground">All Bookings</h2>
            </div>

            {bookings.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">No bookings yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{getVehicleName(b.vehicleId)} · {b.pickupDate} → {b.returnDate}</p>
                      <p className="text-xs text-muted-foreground">{b.customerEmail} · {b.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">₱{b.totalPrice.toLocaleString()}</span>
                      {statusBadge(b.status)}
                    </div>
                    {b.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(b.id)} className="bg-success text-success-foreground hover:bg-success/90 border-0 text-xs">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(b.id)} className="text-xs">
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
