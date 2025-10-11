-- Fix 1: Create user_roles table and has_role function (CRITICAL: prevents privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Migrate existing admin roles from profiles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::text::app_role FROM public.profiles WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Fix 2: Secure profiles table - restrict PII access
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 3: Secure bookings table - remove anonymous booking exposure
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings" 
ON public.bookings
FOR SELECT 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Admins can view all bookings including anonymous" 
ON public.bookings
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 4: Add policies to China EV Cars table
CREATE POLICY "China EV data viewable by everyone" 
ON public."China EV Cars"
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage China EV data" 
ON public."China EV Cars"
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Update existing admin policies to use has_role function
DROP POLICY IF EXISTS "Only admins can manage cars" ON public.cars;
CREATE POLICY "Only admins can manage cars" 
ON public.cars
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
CREATE POLICY "Only admins can manage products" 
ON public.products
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Leads viewable by admins" ON public.leads;
CREATE POLICY "Leads viewable by admins" 
ON public.leads
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Financing apps viewable by admins" ON public.financing_applications;
CREATE POLICY "Financing apps viewable by admins" 
ON public.financing_applications
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));