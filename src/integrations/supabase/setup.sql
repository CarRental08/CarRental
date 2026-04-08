-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE TO authenticated USING (auth.uid() = id);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  seats INTEGER NOT NULL,
  price_per_day INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  engine_type TEXT NOT NULL,
  image TEXT,
  status TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  fleet_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicles_select_policy" ON public.vehicles
FOR SELECT TO authenticated USING (true);

CREATE POLICY "vehicles_insert_policy" ON public.vehicles
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "vehicles_update_policy" ON public.vehicles
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "vehicles_delete_policy" ON public.vehicles
FOR DELETE TO authenticated USING (true);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_policy" ON public.bookings
FOR SELECT TO authenticated USING (true);

CREATE POLICY "bookings_insert_policy" ON public.bookings
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "bookings_update_policy" ON public.bookings
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "bookings_delete_policy" ON public.bookings
FOR DELETE TO authenticated USING (true);