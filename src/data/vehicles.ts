import carFortuner from "@/assets/car-fortuner.jpg";
import carCivic from "@/assets/car-civic.jpg";
import carHiace from "@/assets/car-hiace.jpg";
import carMontero from "@/assets/car-montero.jpg";
import carVios from "@/assets/car-vios.jpg";
import carJimny from "@/assets/car-jimny.jpg";

export type VehicleType = "SUV" | "Sedan" | "Van" | "Compact";
export type Transmission = "Automatic" | "Manual";
export type AvailabilityStatus = "Available" | "Booked" | "Maintenance";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: VehicleType;
  transmission: Transmission;
  seats: number;
  pricePerDay: number;
  fuelType: string;
  engineType: string;
  image: string;
  status: AvailabilityStatus;
  description: string;
  features: string[];
  /** Total number of units of this model in the fleet */
  fleetCount: number;
}

export interface Booking {
  id: string;
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  status: "pending" | "approved" | "rejected";
  notes: string;
  createdAt: string;
}

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Fortuner",
    brand: "Toyota",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    pricePerDay: 3500,
    fuelType: "Diesel",
    engineType: "2.4L Turbodiesel",
    image: carFortuner,
    status: "Available",
    description: "Premium SUV perfect for island hopping adventures. Spacious interior with powerful diesel engine for any terrain in Palawan.",
    features: ["4WD", "Cruise Control", "Bluetooth", "Backup Camera", "Leather Seats", "USB Charging"],
    fleetCount: 3,
  },
  {
    id: "2",
    name: "Honda Civic",
    brand: "Honda",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 2500,
    fuelType: "Gasoline",
    engineType: "1.5L Turbo VTEC",
    image: carCivic,
    status: "Available",
    description: "Sleek and fuel-efficient sedan for comfortable city cruising and long drives around Puerto Princesa.",
    features: ["Lane Assist", "Apple CarPlay", "Sunroof", "Push Start", "LED Headlights"],
    fleetCount: 5,
  },
  {
    id: "3",
    name: "Toyota HiAce",
    brand: "Toyota",
    type: "Van",
    transmission: "Manual",
    seats: 15,
    pricePerDay: 5000,
    fuelType: "Diesel",
    engineType: "2.8L Diesel",
    image: carHiace,
    status: "Available",
    description: "Spacious van ideal for group tours and family trips. Perfect for El Nido and island tour groups.",
    features: ["AC Front & Rear", "Large Cargo Space", "Sliding Doors", "USB Ports"],
    fleetCount: 2,
  },
  {
    id: "4",
    name: "Mitsubishi Montero Sport",
    brand: "Mitsubishi",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    pricePerDay: 3200,
    fuelType: "Diesel",
    engineType: "2.4L MIVEC Diesel",
    image: carMontero,
    status: "Available",
    description: "Rugged yet refined SUV with excellent off-road capability. Conquer any road in Palawan with confidence.",
    features: ["4WD", "Hill Descent", "360° Camera", "Paddle Shifters", "Auto Climate"],
    fleetCount: 3,
  },
  {
    id: "5",
    name: "Toyota Vios",
    brand: "Toyota",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 1800,
    fuelType: "Gasoline",
    engineType: "1.3L Dual VVT-i",
    image: carVios,
    status: "Available",
    description: "Reliable and budget-friendly sedan. Great fuel economy for everyday city driving in Palawan.",
    features: ["ABS", "Airbags", "Bluetooth", "Touchscreen Display", "Keyless Entry"],
    fleetCount: 4,
  },
  {
    id: "6",
    name: "Suzuki Jimny",
    brand: "Suzuki",
    type: "Compact",
    transmission: "Manual",
    seats: 4,
    pricePerDay: 2200,
    fuelType: "Gasoline",
    engineType: "1.5L K15B",
    image: carJimny,
    status: "Available",
    description: "Compact 4x4 adventure machine. Perfect for exploring hidden beaches and off-road trails in Palawan.",
    features: ["4WD", "All-Terrain Tires", "Compact Size", "Hill Hold", "Fog Lamps"],
    fleetCount: 3,
  },
];
