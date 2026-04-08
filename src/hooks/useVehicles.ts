import { useState, useEffect } from "react";
import { vehicles as defaultVehicles, type Vehicle } from "@/data/vehicles";

const VEHICLES_KEY = "palexpress_vehicles";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const stored = localStorage.getItem(VEHICLES_KEY);
      return stored ? JSON.parse(stored) : defaultVehicles;
    } catch {
      return defaultVehicles;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(VEHICLES_KEY);
        if (stored) setVehicles(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to sync vehicles from storage", e);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom events if we update within the same tab
    window.addEventListener("vehiclesUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("vehiclesUpdated", handleStorageChange);
    };
  }, []);

  const saveVehicles = (newVehicles: Vehicle[]) => {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(newVehicles));
    setVehicles(newVehicles);
    window.dispatchEvent(new Event("vehiclesUpdated"));
  };

  return { vehicles, saveVehicles };
}