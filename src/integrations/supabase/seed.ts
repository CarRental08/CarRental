"use client";

import { supabase } from "@/integrations/supabase/client";
import { vehicles } from "@/data/vehicles";

export async function seedVehicles() {
  for (const v of vehicles) {
    const { data, error } = await supabase.from("vehicles").insert([
      {
        id: v.id,
        name: v.name,
        brand: v.brand,
        type: v.type,
        transmission: v.transmission,
        seats: v.seats,
        price_per_day: v.pricePerDay,
        fuel_type: v.fuelType,
        engine_type: v.engineType,
        image: v.image,
        status: v.status,
        description: v.description,
        features: v.features,
        fleet_count: v.fleetCount,
      },
    ]);
    if (error) console.error("Error inserting vehicle", v.id, error);
  }
}