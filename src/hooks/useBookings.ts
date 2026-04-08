import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { Booking } from "@/data/vehicles";
import { useVehicles } from "@/hooks/useVehicles";
import { sendTelegramNotification } from "@/lib/telegram";
import { supabase } from "@/integrations/supabase/client";

export function useBookings() {
  const queryClient = useQueryClient();
  const { vehicles } = useVehicles();

  // Fetch all bookings from Supabase
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

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
    // Ensure data is fresh
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Real-time subscription
  useEffect(() => {
    // Use a unique channel name to avoid conflicts
    const channelId = `bookings-realtime-${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          // Force an immediate refetch of all booking data
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Pre-calculate current availability for all vehicles to ensure reactivity
  const currentAvailability = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const d = new Date(today);
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);

    const availabilityMap: Record<string, number> = {};

    vehicles.forEach((vehicle) => {
      const bookedCount = bookings.filter(
        (b) =>
          b.vehicleId === vehicle.id &&
          b.status === "approved" && // Only count approved bookings for the "Available Now" display
          new Date(b.pickupDate) < nextDay &&
          new Date(b.returnDate) > d
      ).length;

      availabilityMap[vehicle.id] = Math.max(0, vehicle.fleetCount - bookedCount);
    });

    return availabilityMap;
  }, [bookings, vehicles]);

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
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Booking["status"] }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

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
      // Immediately invalidate to trigger UI updates
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    }
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    }
  });

  const getAvailableUnits = (vehicleId: string, pickupDate: string, returnDate: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return 0;
    
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    
    const bookedUnits = bookings.filter(
      (b) =>
        b.vehicleId === vehicleId &&
        (b.status === "approved" || b.status === "pending") && // For new bookings, consider pending to prevent overbooking
        new Date(b.pickupDate) < returnD &&
        new Date(b.returnDate) > pickup
    ).length;
    
    return Math.max(0, vehicle.fleetCount - bookedUnits);
  };

  const getCurrentAvailableUnits = (vehicleId: string) => {
    return currentAvailability[vehicleId] ?? 0;
  };

  const hasConflict = (vehicleId: string, pickupDate: string, returnDate: string) => {
    return getAvailableUnits(vehicleId, pickupDate, returnDate) <= 0;
  };

  return { 
    bookings, 
    isLoading,
    addBooking: addBookingMutation.mutate, 
    updateBookingStatus: (id: string, status: Booking["status"]) => updateStatusMutation.mutateAsync({ id, status }), 
    deleteBooking: deleteBookingMutation.mutate,
    getAvailableUnits, 
    getCurrentAvailableUnits,
    hasConflict
  };
}