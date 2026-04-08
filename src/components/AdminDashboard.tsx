import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useAdmin } from "@/hooks/useAdmin";
import { useVehicles } from "@/hooks/useVehicles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Clock, CheckCircle, XCircle, Car, TrendingUp, AlertCircle, CalendarDays, List, Settings2, BarChart3, Mail, Phone, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import BookingCalendar from "@/components/BookingCalendar";
import VehicleManagement from "@/components/VehicleManagement";
import AnalyticsCharts from "@/components/AnalyticsCharts";

interface AdminDashboardProps {
  onExit: () => void;
}

type AdminView = "list" | "calendar" | "vehicles" | "analytics";

export default function AdminDashboard({ onExit }: AdminDashboardProps) {
  const { bookings, isLoading, updateBookingStatus, deleteBooking } = useBookings();
  const { vehicles } = useVehicles();
  const { logout } = useAdmin();
  const [view, setView] = useState<AdminView>("list");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pending = bookings.filter((b) => b.status === "pending");
  const approved = bookings.filter((b) => b.status === "approved");
  const totalRevenue = approved.reduce((s, b) => s + b.totalPrice, 0);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await updateBookingStatus(id, "approved");
      toast.success("Booking approved! Notification email sent.");
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await updateBookingStatus(id, "rejected");
      toast.info("Booking rejected. Notification email sent.");
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking record?")) {
      deleteBooking(id);
      toast.success("Booking deleted.");
    }
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading dashboard data...</p>
          </div>
        ) : view === "calendar" ? (
          <BookingCalendar bookings={bookings} />
        ) : view === "vehicles" ? (
          <VehicleManagement />
        ) : view === "analytics" ? (
          <AnalyticsCharts bookings={bookings} />
        ) : (
          /* Bookings table */
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-foreground">All Bookings</h2>
              {pending.length > 0 && (
                <Badge variant="outline" className="text-warning border-warning/30 bg-warning/5">
                  {pending.length} Pending Approval
                </Badge>
              )}
            </div>

            {bookings.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">No bookings yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {[...bookings].map((b) => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-foreground truncate">{b.customerName}</p>
                        {statusBadge(b.status)}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Car className="w-3 h-3" /> {getVehicleName(b.vehicleId)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3" /> {b.pickupDate} → {b.returnDate}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {b.customerEmail}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> {b.customerPhone}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold text-foreground">₱{b.totalPrice.toLocaleString()}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(b.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {b.status === "pending" && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            disabled={processingId === b.id}
                            onClick={() => handleApprove(b.id)} 
                            className="bg-success text-success-foreground hover:bg-success/90 border-0 text-xs h-8 px-4"
                          >
                            {processingId === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            disabled={processingId === b.id}
                            onClick={() => handleReject(b.id)} 
                            className="text-xs h-8 px-4"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
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