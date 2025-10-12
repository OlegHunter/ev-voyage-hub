-- ===================================================
-- Phase 1: Complete Database Setup with Updated Contacts
-- ===================================================

-- 1. Create new tables
CREATE TABLE IF NOT EXISTS public.calculator_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calculator_type text NOT NULL UNIQUE,
  formula_js text NOT NULL,
  formula_description text,
  variables jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image text,
  author text DEFAULT 'CarHunter Team',
  published_at timestamptz DEFAULT now(),
  seo jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  logo_url text,
  description text,
  country text,
  gallery jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brand_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES public.brands(id) ON DELETE CASCADE,
  model_name text NOT NULL,
  year_from integer,
  year_to integer,
  class text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  seo jsonb DEFAULT '{}',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  block_type text NOT NULL,
  content jsonb DEFAULT '{}',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.failed_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid,
  notification_type text NOT NULL,
  payload jsonb,
  error_message text,
  retry_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  next_retry_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.lead_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid,
  file_url text NOT NULL,
  file_type text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  icon text,
  price_from numeric,
  created_at timestamptz DEFAULT now()
);

-- 2. Update existing tables
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS specs_360_url text,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS slug text;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS compatible_cars jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS related_products jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS slug text;

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS lead_code text,
ADD COLUMN IF NOT EXISTS crm_id text,
ADD COLUMN IF NOT EXISTS telegram_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS telegram_response jsonb,
ADD COLUMN IF NOT EXISTS source_page text,
ADD COLUMN IF NOT EXISTS utm_params jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS type text DEFAULT 'general_inquiry';

-- 3. Enable RLS
ALTER TABLE public.calculator_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Calculator configs viewable by everyone" ON public.calculator_configs FOR SELECT USING (true);
CREATE POLICY "Only admins can manage calculator configs" ON public.calculator_configs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Published news viewable by everyone" ON public.news FOR SELECT USING (published_at <= now());
CREATE POLICY "Only admins can manage news" ON public.news FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Brands viewable by everyone" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Only admins can manage brands" ON public.brands FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Brand models viewable by everyone" ON public.brand_models FOR SELECT USING (true);
CREATE POLICY "Only admins can manage brand models" ON public.brand_models FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Published pages viewable by everyone" ON public.pages FOR SELECT USING (published = true);
CREATE POLICY "Only admins can manage pages" ON public.pages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Page blocks viewable by everyone" ON public.page_blocks FOR SELECT USING (true);
CREATE POLICY "Only admins can manage page blocks" ON public.page_blocks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Site settings viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can manage site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can view failed notifications" ON public.failed_notifications FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can manage failed notifications" ON public.failed_notifications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Lead attachments viewable by admins" ON public.lead_attachments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can create lead attachments" ON public.lead_attachments FOR INSERT WITH CHECK (true);

CREATE POLICY "Service types viewable by everyone" ON public.service_types FOR SELECT USING (true);
CREATE POLICY "Only admins can manage service types" ON public.service_types FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published_at);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_brand_models_brand ON public.brand_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_leads_code ON public.leads(lead_code);

-- 6. Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER calculator_configs_updated_at BEFORE UPDATE ON public.calculator_configs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 7. Insert Updated Site Settings with Contact Data
INSERT INTO public.site_settings (key, value) VALUES
('contact', '{
  "phones": ["+380932639262", "+380985155338", "+380936394429"],
  "email": "carhunterhub@gmail.com",
  "addresses": [
    "м. Одеса, пров. Катаєва 2а",
    "Київ ТРЦ Республіка"
  ]
}'::jsonb),
('currency_rates', '{
  "usd_to_uah": 41.5,
  "eur_to_uah": 44.8,
  "updated_at": "2025-01-20"
}'::jsonb),
('telegram', '{
  "bot_token": "8364176552:AAFj6-LPEDFY3Hax--6p4U3SAd-x1ge_Gr4",
  "chat_id": "1306265065"
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 8. Insert Sample Brands
INSERT INTO public.brands (slug, name, logo_url, description, country) VALUES
('tesla', 'Tesla', NULL, 'Американський виробник електромобілів преміум класу', 'США'),
('byd', 'BYD', NULL, 'Китайський лідер у виробництві електромобілів та акумуляторів', 'Китай'),
('nio', 'NIO', NULL, 'Преміум китайський бренд електромобілів', 'Китай'),
('xpeng', 'XPeng', NULL, 'Інноваційний китайський виробник smart EV', 'Китай'),
('volkswagen', 'Volkswagen', NULL, 'Німецький автовиробник з лінійкою ID', 'Німеччина')
ON CONFLICT (slug) DO NOTHING;

-- 9. Insert Calculator Configs
INSERT INTO public.calculator_configs (calculator_type, formula_js, formula_description, variables) VALUES
('customs', 'return (carPrice * 0.1) + (engineVolume * 100) + 500;', 'Базова формула розмитнення', '{"carPrice": "Вартість авто USD", "engineVolume": "Об''єм двигуна л"}'),
('credit', 'const monthlyRate = rate / 100 / 12; return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);', 'Розрахунок щомісячного платежу кредиту', '{"loanAmount": "Сума кредиту", "rate": "Річна ставка %", "termMonths": "Термін місяців"}'),
('leasing', 'return (carPrice - deposit) / termMonths + (carPrice * rate / 100 / 12);', 'Спрощений розрахунок лізингу', '{"carPrice": "Вартість авто", "deposit": "Перший внесок", "termMonths": "Термін", "rate": "Ставка %"}')
ON CONFLICT (calculator_type) DO NOTHING;

-- 10. Insert Sample News
INSERT INTO public.news (slug, title, excerpt, content, cover_image, published_at) VALUES
('top-5-ev-2024', 'ТОП-5 електромобілів 2024 року для України', 'Огляд найкращих EV моделей для українського ринку', '# ТОП-5 електромобілів 2024

Детальний огляд найпопулярніших моделей...

## 1. Tesla Model 3
## 2. BYD Dolphin
## 3. VW ID.4
## 4. NIO ET5
## 5. XPeng P7', NULL, now() - interval '5 days'),
('import-guide', 'Повний гайд з імпорту електромобіля з Китаю', 'Покрокова інструкція з розмитнення та доставки', '# Гайд з імпорту EV

Все що потрібно знати про імпорт електромобіля...', NULL, now() - interval '10 days')
ON CONFLICT (slug) DO NOTHING;

-- 11. Insert Service Types
INSERT INTO public.service_types (slug, title, description, price_from, icon) VALUES
('maintenance', 'Технічне обслуговування', 'Регулярне ТО електромобілів', 1500, 'Wrench'),
('repair', 'Ремонт та діагностика', 'Професійний ремонт EV', 2000, 'Settings'),
('ukrainization', 'Українізація авто', 'Переобладнання під українські стандарти', 5000, 'FileText'),
('warranty', 'Гарантійне обслуговування', 'Офіційна гарантія на всі роботи', 0, 'Shield')
ON CONFLICT (slug) DO NOTHING;

-- 12. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('lead-attachments', 'lead-attachments', false),
('car-media', 'car-media', true),
('page-media', 'page-media', true)
ON CONFLICT (id) DO NOTHING;

-- 13. Storage Policies
CREATE POLICY "Lead attachments accessible by admins" ON storage.objects 
FOR SELECT USING (bucket_id = 'lead-attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can upload lead attachments" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'lead-attachments');

CREATE POLICY "Car media publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'car-media');

CREATE POLICY "Admins can manage car media" ON storage.objects 
FOR ALL USING (bucket_id = 'car-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Page media publicly accessible" ON storage.objects 
FOR SELECT USING (bucket_id = 'page-media');

CREATE POLICY "Admins can manage page media" ON storage.objects 
FOR ALL USING (bucket_id = 'page-media' AND has_role(auth.uid(), 'admin'::app_role));