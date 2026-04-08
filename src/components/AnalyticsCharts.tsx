import { useMemo } from "react";
import type { Booking } from "@/data/vehicles";
import { vehicles } from "@/data/vehicles";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalyticsChartsProps {
  bookings: Booking[];
}

export default function AnalyticsCharts({ bookings }: AnalyticsChartsProps) {
  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; bookings: number; revenue: number }> = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months[key] = { month: label, bookings: 0, revenue: 0 };
    }

    bookings.forEach((b) => {
      const d = new Date(b.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (months[key]) {
        months[key].bookings += 1;
        if (b.status === "approved") {
          months[key].revenue += b.totalPrice;
        }
      }
    });

    return Object.values(months);
  }, [bookings]);

  const vehiclePopularity = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.vehicleId] = (counts[b.vehicleId] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        name: vehicles.find((v) => v.id === id)?.name ?? "Unknown",
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [bookings]);

  const statusBreakdown = useMemo(() => {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    bookings.forEach((b) => { counts[b.status] += 1; });
    return [
      { name: "Pending", value: counts.pending, color: "hsl(38, 92%, 50%)" },
      { name: "Approved", value: counts.approved, color: "hsl(152, 69%, 40%)" },
      { name: "Rejected", value: counts.rejected, color: "hsl(0, 84%, 60%)" },
    ].filter((s) => s.value > 0);
  }, [bookings]);

  if (bookings.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No booking data yet. Charts will appear once bookings are submitted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Booking Trends + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-bold text-foreground text-sm mb-4">Booking Trends (6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="bookings" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-bold text-foreground text-sm mb-4">Revenue Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`₱${value.toLocaleString()}`, "Revenue"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(25, 95%, 53%)" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Pie + Popular Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Pie */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-bold text-foreground text-sm mb-4">Booking Status Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            {statusBreakdown.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
                <span className="text-[11px] text-muted-foreground">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Vehicles */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-bold text-foreground text-sm mb-4">Most Popular Vehicles</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vehiclePopularity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="hsl(152, 69%, 40%)" radius={[0, 4, 4, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
