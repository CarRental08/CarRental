import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Booking } from "@/data/vehicles";
import { vehicles } from "@/data/vehicles";
import { sendTelegramNotification } from "@/lib/telegram";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBookings() {
  const queryClient = useQueryClient();

  // Fetch all bookings from Supabase
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }

      // Map database fields to our Booking interface
      return (data || []).map((b: any) => ({
        id: b.id,
        vehicleId: b.vehicle_id,
        customerName: b.customer_name,
        customerEmail: b.customer_email,
        customerPhone: b.customer_phone,
        pickupDate: b.pickup_date,
        returnDate: b.return_date,
        totalPrice: b.total_price,
        status: b.status,
        notes: b.notes,
        createdAt: b.created_at,
      })) as Booking[];
    },
    // Refetch every 10 seconds for a "real-time" feel in the dashboard
    refetchInterval: 10000,
  });

  // Mutation to add a new booking
  const addBookingMutation = useMutation({
    mutationFn: async (booking: Omit<Booking, "id" | "status" | "createdAt">) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            vehicle_id: booking.vehicleId,
            customer_name: booking.customerName,
            customer_email: booking.customerEmail,
            customer_phone: booking.customerPhone,
            pickup_date: booking.pickupDate,
            return_date: booking.returnDate,
            total_price: booking.totalPrice,
            notes: booking.notes,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Send Telegram Notification
      const vehicle = vehicles.find(v => v.id === booking.vehicleId);
      const message = `
🚗 <b>NEW BOOKING ALERT</b>

👤 <b>Customer Name:</b> ${booking.customerName}
📞 <b>Phone:</b> ${booking.customerPhone}
🚘 <b>Vehicle:</b> ${vehicle?.name || 'Unknown'}
📅 <b>Pickup Date:</b> ${booking.pickupDate}
📍 <b>Location:</b> Puerto Princesa, Palawan
💰 <b>Total Price:</b> ₱${booking.totalPrice.toLocaleString()}
      `.trim();
      sendTelegramNotification(message);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  // Mutation to update booking status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Booking["status"] }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Trigger Email Notification via Edge Function
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        const vehicle = vehicles.find(v => v.id === booking.vehicleId);
        await supabase.functions.invoke("send-booking-email", {
          body: {
            customerEmail: booking.customerEmail,
            customerName: booking.customerName,
            status: status,
            vehicleName: vehicle?.name || "Vehicle",
            pickupDate: booking.pickupDate,
            returnDate: booking.returnDate,
            totalPrice: booking.totalPrice
          }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const getBookedUnits = (vehicleId: string, pickupDate: string, returnDate: string) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    return bookings.filter(
      (b) =>
        b.vehicleId === vehicleId &&
        b.status !== "rejected" &&
        new Date(b.pickupDate) < returnD &&
        new Date(b.returnDate) > pickup
    ).length;
  };

  const getBookedUnitsOnDate = (vehicleId: string, date: string) => {
    const d = new Date(date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return bookings.filter(
      (b) =>
        b.vehicleId === vehicleId &&
        b.status !== "rejected" &&
        new Date(b.pickupDate) < nextDay &&
        new Date(b.returnDate) > d
    ).length;
  };

  const getCurrentAvailableUnits = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return 0;
    const today = new Date().toISOString().split("T")[0];
    const booked = getBookedUnitsOnDate(vehicleId, today);
    return Math.max(0, vehicle.fleetCount - booked);
  };

  const getAvailableUnits = (vehicleId: string, pickupDate: string, returnDate: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return 0;
    const bookedUnits = getBookedUnits(vehicleId, pickupDate, returnDate);
    return Math.max(0, vehicle.fleetCount - bookedUnits);
  };

  const hasConflict = (vehicleId: string, pickupDate: string, returnDate: string) => {
    return getAvailableUnits(vehicleId, pickupDate, returnDate) <= 0;
  };

  return { 
    bookings, 
    isLoading,
    addBooking: addBookingMutation.mutate, 
    updateBookingStatus: (id: string, status: Booking["status"]) => updateStatusMutation.mutateAsync({ id, status }), 
    hasConflict, 
    getAvailableUnits, 
    getBookedUnits, 
    getBookedUnitsOnDate, 
    getCurrentAvailableUnits 
  };
}