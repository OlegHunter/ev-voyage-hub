-- Create enum types
CREATE TYPE public.car_status AS ENUM ('InStock', 'OnTheWay', 'PreOrder', 'Sold');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.financing_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Users profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  locale TEXT DEFAULT 'ua',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Cars table
CREATE TABLE public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 2015 AND year <= 2025),
  trim TEXT,
  price_usd DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  mileage_km INTEGER,
  range_km INTEGER,
  status car_status DEFAULT 'InStock',
  source_country TEXT,
  gltf_url TEXT,
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cars are viewable by everyone" ON public.cars
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage cars" ON public.cars
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT,
  message TEXT,
  car_id UUID REFERENCES public.cars(id),
  calc_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leads viewable by admins" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can create leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_min INTEGER,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone" ON public.services
  FOR SELECT USING (true);

-- Service centers table
CREATE TABLE public.service_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.service_centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service centers viewable by everyone" ON public.service_centers
  FOR SELECT USING (true);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  service_id UUID REFERENCES public.services(id) NOT NULL,
  center_id UUID REFERENCES public.service_centers(id) NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  status booking_status DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Financing applications table
CREATE TABLE public.financing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id),
  car_id UUID REFERENCES public.cars(id),
  deposit_percent DECIMAL(5,2),
  term_months INTEGER,
  rate_pct DECIMAL(5,2),
  monthly_payment DECIMAL(10,2),
  status financing_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financing apps viewable by admins" ON public.financing_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can create financing applications" ON public.financing_applications
  FOR INSERT WITH CHECK (true);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stats counters table
CREATE TABLE public.stats_counters (
  key TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);

ALTER TABLE public.stats_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats viewable by everyone" ON public.stats_counters
  FOR SELECT USING (true);

-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials viewable by everyone" ON public.testimonials
  FOR SELECT USING (true);

-- Insert initial stats
INSERT INTO public.stats_counters (key, value) VALUES
  ('total_cars_delivered', 6500),
  ('service_centers', 10),
  ('satisfaction_rate', 98);

-- Insert service centers
INSERT INTO public.service_centers (name, city, address, phone) VALUES
  ('CarHunter Kyiv Center', 'Київ', 'вул. Хрещатик 22', '+380441234567'),
  ('CarHunter Odesa Center', 'Одеса', 'вул. Дерибасівська 10', '+380482345678');

-- Insert services
INSERT INTO public.services (title, description, duration_min, price) VALUES
  ('Battery Diagnostics', 'Комплексна діагностика батареї електромобіля', 60, 150.00),
  ('Home Charger Installation', 'Встановлення зарядної станції вдома', 180, 500.00),
  ('Pre-delivery Inspection', 'Передпродажна підготовка та огляд', 120, 200.00),
  ('Maintenance Package', 'Повне технічне обслуговування', 240, 800.00),
  ('Solar Panel Wash', 'Еко-мийка для власників електромобілів', 45, 50.00),
  ('High-altitude Window Service', 'Професійна обробка скла', 30, 75.00);

-- Seed 50 Chinese EV models (fixed JSON syntax)
INSERT INTO public.cars (brand, model, year, price_usd, mileage_km, range_km, status, source_country, images, specs) VALUES
  ('BYD', 'Han', 2023, 45000, 15000, 605, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=800'], '{"power_kw": 380, "battery_kwh": 85.4, "acceleration": 3.9}'::jsonb),
  ('BYD', 'Atto 3', 2024, 38000, 5000, 420, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'], '{"power_kw": 150, "battery_kwh": 60.5, "acceleration": 7.3}'::jsonb),
  ('BYD', 'Seal', 2024, 52000, 8000, 700, 'OnTheWay', 'China', ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'], '{"power_kw": 390, "battery_kwh": 82.5, "acceleration": 3.8}'::jsonb),
  ('NIO', 'ES8', 2023, 68000, 12000, 580, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'], '{"power_kw": 400, "battery_kwh": 100, "acceleration": 4.9}'::jsonb),
  ('NIO', 'ET5', 2024, 55000, 3000, 560, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=800'], '{"power_kw": 360, "battery_kwh": 75, "acceleration": 4.3}'::jsonb),
  ('Li Auto', 'Li One', 2023, 48000, 18000, 800, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=800'], '{"power_kw": 245, "battery_kwh": 40.5, "acceleration": 6.5}'::jsonb),
  ('Zeekr', '001', 2024, 58000, 7000, 712, 'OnTheWay', 'China', ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=800'], '{"power_kw": 400, "battery_kwh": 100, "acceleration": 3.8}'::jsonb),
  ('Xpeng', 'P7', 2023, 42000, 22000, 670, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'], '{"power_kw": 316, "battery_kwh": 80.9, "acceleration": 4.3}'::jsonb),
  ('Xpeng', 'G3', 2022, 32000, 35000, 520, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=800'], '{"power_kw": 145, "battery_kwh": 66, "acceleration": 8.6}'::jsonb),
  ('Great Wall', 'Ora Good Cat', 2023, 28000, 12000, 420, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'], '{"power_kw": 105, "battery_kwh": 59.1, "acceleration": 8.5}'::jsonb),
  ('Denza', 'N7', 2024, 62000, 4000, 630, 'PreOrder', 'China', ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'], '{"power_kw": 390, "battery_kwh": 91.3, "acceleration": 3.9}'::jsonb),
  ('Geely', 'Geometry A', 2022, 26000, 28000, 410, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=800'], '{"power_kw": 150, "battery_kwh": 61.9, "acceleration": 8.8}'::jsonb),
  ('SAIC', 'MG ZS EV', 2023, 29000, 15000, 440, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=800'], '{"power_kw": 115, "battery_kwh": 51, "acceleration": 8.5}'::jsonb),
  ('GAC', 'Aion S', 2023, 31000, 18000, 510, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=800'], '{"power_kw": 135, "battery_kwh": 59.8, "acceleration": 7.9}'::jsonb),
  ('Leapmotor', 'C11', 2024, 36000, 6000, 610, 'OnTheWay', 'China', ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'], '{"power_kw": 200, "battery_kwh": 90, "acceleration": 7.9}'::jsonb),
  ('Neta', 'V', 2023, 24000, 20000, 380, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=800'], '{"power_kw": 95, "battery_kwh": 40, "acceleration": 11.8}'::jsonb),
  ('BYD', 'Tang EV', 2023, 54000, 16000, 635, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'], '{"power_kw": 380, "battery_kwh": 86.4, "acceleration": 4.4}'::jsonb),
  ('Li Auto', 'L9', 2024, 72000, 2000, 1315, 'PreOrder', 'China', ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'], '{"power_kw": 330, "battery_kwh": 44.5, "acceleration": 5.3}'::jsonb),
  ('NIO', 'ES6', 2022, 58000, 32000, 510, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'], '{"power_kw": 320, "battery_kwh": 70, "acceleration": 5.6}'::jsonb),
  ('GAC', 'Aion LX', 2023, 44000, 14000, 650, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=800'], '{"power_kw": 300, "battery_kwh": 93, "acceleration": 3.9}'::jsonb),
  ('Leapmotor', 'T03', 2023, 18000, 25000, 403, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=800'], '{"power_kw": 80, "battery_kwh": 41, "acceleration": 12.6}'::jsonb),
  ('Changan', 'Eado EV', 2022, 27000, 30000, 405, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=800'], '{"power_kw": 120, "battery_kwh": 52.56, "acceleration": 10.5}'::jsonb),
  ('WM Motor', 'EX5', 2022, 29000, 28000, 460, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'], '{"power_kw": 160, "battery_kwh": 69, "acceleration": 8.3}'::jsonb),
  ('Baojun', 'E300', 2023, 15000, 18000, 305, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=800'], '{"power_kw": 40, "battery_kwh": 31.9, "acceleration": 16.8}'::jsonb),
  ('Lynk & Co', '01 PHEV', 2023, 38000, 22000, 55, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'], '{"power_kw": 180, "battery_kwh": 17.6, "acceleration": 7.3}'::jsonb),
  ('Hozon', 'Neta S', 2024, 41000, 8000, 715, 'OnTheWay', 'China', ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'], '{"power_kw": 340, "battery_kwh": 91, "acceleration": 3.9}'::jsonb),
  ('Chery', 'eQ', 2021, 16000, 42000, 301, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'], '{"power_kw": 30, "battery_kwh": 38, "acceleration": 20}'::jsonb),
  ('Zeekr', 'X', 2024, 48000, 3000, 560, 'PreOrder', 'China', ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=800'], '{"power_kw": 315, "battery_kwh": 66, "acceleration": 3.7}'::jsonb),
  ('Xpeng', 'G6', 2024, 46000, 5000, 755, 'OnTheWay', 'China', ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=800'], '{"power_kw": 350, "battery_kwh": 87.5, "acceleration": 4.0}'::jsonb),
  ('Dongfeng', 'Fengon E', 2022, 22000, 35000, 420, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=800'], '{"power_kw": 110, "battery_kwh": 55, "acceleration": 10.5}'::jsonb),
  ('BAIC', 'EU5', 2022, 24000, 32000, 416, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'], '{"power_kw": 120, "battery_kwh": 53.6, "acceleration": 10.0}'::jsonb),
  ('JAC', 'iEV7S', 2021, 19000, 38000, 350, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=800'], '{"power_kw": 85, "battery_kwh": 39, "acceleration": 11.0}'::jsonb),
  ('Seres', 'SF5', 2022, 34000, 28000, 180, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'], '{"power_kw": 255, "battery_kwh": 33, "acceleration": 4.8}'::jsonb),
  ('Huawei', 'AITO M5', 2024, 52000, 6000, 230, 'PreOrder', 'China', ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'], '{"power_kw": 272, "battery_kwh": 40, "acceleration": 4.4}'::jsonb),
  ('BYD', 'e6', 2019, 22000, 58000, 400, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'], '{"power_kw": 90, "battery_kwh": 82, "acceleration": 10.5}'::jsonb),
  ('WM Motor', 'W6', 2023, 33000, 16000, 520, 'InStock', 'China', ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=800'], '{"power_kw": 160, "battery_kwh": 69, "acceleration": 8.5}'::jsonb),
  ('Tesla', 'Model 3', 2023, 42000, 18000, 560, 'InStock', 'USA', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'], '{"power_kw": 258, "battery_kwh": 60, "acceleration": 5.3}'::jsonb),
  ('Tesla', 'Model Y', 2024, 52000, 8000, 525, 'InStock', 'USA', ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=800'], '{"power_kw": 324, "battery_kwh": 75, "acceleration": 5.0}'::jsonb),
  ('Nissan', 'Leaf', 2023, 28000, 22000, 385, 'InStock', 'Japan', ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=800'], '{"power_kw": 110, "battery_kwh": 40, "acceleration": 7.9}'::jsonb),
  ('Hyundai', 'Ioniq 5', 2024, 48000, 12000, 481, 'InStock', 'Korea', ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'], '{"power_kw": 225, "battery_kwh": 72.6, "acceleration": 7.4}'::jsonb),
  ('Kia', 'EV6', 2024, 49000, 10000, 528, 'InStock', 'Korea', ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=800'], '{"power_kw": 239, "battery_kwh": 77.4, "acceleration": 7.3}'::jsonb),
  ('Volkswagen', 'ID.4', 2023, 44000, 16000, 520, 'InStock', 'Germany', ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'], '{"power_kw": 150, "battery_kwh": 77, "acceleration": 8.5}'::jsonb),
  ('BMW', 'iX3', 2023, 58000, 14000, 460, 'InStock', 'Germany', ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'], '{"power_kw": 210, "battery_kwh": 80, "acceleration": 6.8}'::jsonb),
  ('Audi', 'e-tron', 2023, 72000, 18000, 436, 'InStock', 'Germany', ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'], '{"power_kw": 265, "battery_kwh": 95, "acceleration": 6.6}'::jsonb),
  ('Mercedes-Benz', 'EQC', 2023, 68000, 16000, 417, 'InStock', 'Germany', ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=800'], '{"power_kw": 300, "battery_kwh": 80, "acceleration": 5.1}'::jsonb),
  ('Polestar', '2', 2024, 54000, 9000, 476, 'InStock', 'Sweden', ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=800'], '{"power_kw": 300, "battery_kwh": 78, "acceleration": 4.7}'::jsonb),
  ('Rivian', 'R1T', 2024, 78000, 5000, 505, 'PreOrder', 'USA', ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=800'], '{"power_kw": 562, "battery_kwh": 135, "acceleration": 3.0}'::jsonb),
  ('Lucid', 'Air', 2024, 95000, 3000, 837, 'PreOrder', 'USA', ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'], '{"power_kw": 746, "battery_kwh": 118, "acceleration": 2.5}'::jsonb),
  ('Ford', 'Mustang Mach-E', 2023, 48000, 19000, 491, 'InStock', 'USA', ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=800'], '{"power_kw": 258, "battery_kwh": 91, "acceleration": 5.8}'::jsonb),
  ('Chevrolet', 'Bolt EV', 2023, 32000, 24000, 417, 'InStock', 'USA', ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'], '{"power_kw": 150, "battery_kwh": 66, "acceleration": 7.0}'::jsonb);

-- Insert 20 shop products
INSERT INTO public.products (sku, title, category, price, stock, images, specs) VALUES
  ('CHG-HOME-7', 'Home EV Charger 7kW', 'Chargers', 499.99, 25, ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400'], '{"power": "7kW", "cable_length": "5m", "connector": "Type 2"}'::jsonb),
  ('CHG-22', 'Fast Charger 22kW', 'Chargers', 1299.99, 12, ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400'], '{"power": "22kW", "cable_length": "7m", "connector": "Type 2"}'::jsonb),
  ('CBL-T2-5M', 'Type 2 Cable 5m', 'Cables', 89.99, 50, ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400'], '{"length": "5m", "connector": "Type 2", "current": "32A"}'::jsonb),
  ('PWR-2KWH', 'Mobile Power Station 2kWh', 'Power', 899.99, 15, ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=400'], '{"capacity": "2000Wh", "output": "2000W", "weight": "22kg"}'::jsonb),
  ('MAT-SEASON', 'All-season Floor Mats Set', 'Interior', 129.99, 40, ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=400'], '{"material": "TPE", "pieces": 4, "universal": true}'::jsonb),
  ('INF-PORT', 'Portable Tire Inflator', 'Tools', 69.99, 35, ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=400'], '{"max_psi": 150, "power": "12V DC", "auto_shutoff": true}'::jsonb),
  ('DIAG-BATT', 'EV Battery Diagnostic Tool', 'Tools', 349.99, 8, ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400'], '{"bluetooth": true, "app": "iOS/Android", "protocols": "OBD2"}'::jsonb),
  ('WB-MOUNT', 'Level 2 Wallbox Mount', 'Installation', 79.99, 30, ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=400'], '{"material": "Steel", "weight_capacity": "15kg", "adjustable": true}'::jsonb),
  ('ORG-TRUNK', 'Trunk Organizer', 'Interior', 49.99, 45, ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400'], '{"compartments": 6, "collapsible": true, "dimensions": "60x40x30cm"}'::jsonb),
  ('HOLD-MAG', 'Magnetic Phone Holder', 'Accessories', 24.99, 60, ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400'], '{"mount": "Dashboard/Vent", "rotation": "360°", "magsafe": true}'::jsonb),
  ('RACK-ROOF', 'Universal Roof Rack', 'Exterior', 299.99, 18, ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400'], '{"capacity": "75kg", "material": "Aluminum", "aerodynamic": true}'::jsonb),
  ('LED-KIT', 'LED Interior Kit', 'Lighting', 89.99, 32, ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=400'], '{"pieces": 12, "color": "RGB", "app_control": true}'::jsonb),
  ('ADP-EU-US', 'Charging Adapter EU→US', 'Adapters', 39.99, 55, ARRAY['https://images.unsplash.com/photo-1617704548623-340376564e68?w=400'], '{"input": "Type 2", "output": "J1772", "max_current": "32A"}'::jsonb),
  ('JUMP-EV', 'Portable Jump Starter (EV)', 'Emergency', 159.99, 22, ARRAY['https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=800'], '{"capacity": "20000mAh", "peak_amps": "2000A", "usb_ports": 2}'::jsonb),
  ('FILM-WIND', 'Windshield Protection Film', 'Protection', 199.99, 20, ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400'], '{"coverage": "Full windshield", "uv_block": "99%", "installation": "Professional"}'::jsonb),
  ('CVR-EV', 'Car Cover (EV specific)', 'Protection', 149.99, 28, ARRAY['https://images.unsplash.com/photo-1617654112368-307921291f3e?w=400'], '{"material": "Polyester", "waterproof": true, "breathable": true}'::jsonb),
  ('OBD-GPS', 'Smart OBD Tracker (GPS)', 'Electronics', 119.99, 25, ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400'], '{"gps": true, "4g": true, "app": "iOS/Android"}'::jsonb),
  ('CLN-ECO', 'EV Cleaning Kit (Eco)', 'Maintenance', 44.99, 50, ARRAY['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400'], '{"eco_friendly": true, "pieces": 8, "microfiber": true}'::jsonb),
  ('TPMS-SET', 'TPMS Sensors Set', 'Safety', 189.99, 16, ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400'], '{"sensors": 4, "battery_life": "5 years", "programmable": true}'::jsonb),
  ('SOLAR-CHG', 'Solar Trunk Charger', 'Solar', 249.99, 10, ARRAY['https://images.unsplash.com/photo-1614162692292-7ac56d7f2f55?w=400'], '{"power": "100W", "efficiency": "23%", "portable": true}'::jsonb);

-- Insert testimonials
INSERT INTO public.testimonials (user_name, user_avatar, text, rating) VALUES
  ('Олександр К.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 'Замовляв BYD Han з Китаю. Процес максимально прозорий, всі документи вчасно. Рекомендую!', 5),
  ('Марія Т.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', 'Чудовий сервіс! Допомогли з фінансуванням та доставкою NIO ES6. Дякую команді!', 5),
  ('Дмитро П.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry', 'Професійний підхід на всіх етапах. Tesla Model 3 отримав за 45 днів. Все ідеально!', 5);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, locale)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'locale', 'ua')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();