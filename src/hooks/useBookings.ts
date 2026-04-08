import { useState, useEffect } from "react";
import type { Booking } from "@/data/vehicles";
import { vehicles } from "@/data/vehicles";
import { sendTelegramNotification } from "@/lib/telegram";

const STORAGE_KEY = "palexpress_bookings";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Omit<Booking, "id" | "status" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    setBookings((prev) => [...prev, newBooking]);

    // Construct and send Telegram Notification
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

    // Trigger notification asynchronously so it doesn't block the UI
    sendTelegramNotification(message);

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

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

  return { bookings, addBooking, updateBookingStatus, hasConflict, getAvailableUnits, getBookedUnits, getBookedUnitsOnDate, getCurrentAvailableUnits };
}