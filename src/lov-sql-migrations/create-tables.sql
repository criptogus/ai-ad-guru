
-- Creating tables for media assets
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  campaigns TEXT[] DEFAULT '{}',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creating tables for copywriting assets
CREATE TABLE IF NOT EXISTS public.copywriting_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  platform TEXT NOT NULL,
  character_count INTEGER NOT NULL,
  campaign_id UUID,
  ad_type TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creating tables for customer data
CREATE TABLE IF NOT EXISTS public.customer_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  segment TEXT,
  list_name TEXT,
  import_batch TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creating tables for customer data imports
CREATE TABLE IF NOT EXISTS public.customer_data_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  list_name TEXT NOT NULL,
  record_count INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creating tables for company information
CREATE TABLE IF NOT EXISTS public.company_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  target_market TEXT,
  language TEXT,
  tone_of_voice TEXT,
  custom_tone TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for each table
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own media assets" ON public.media_assets
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.copywriting_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own copywriting assets" ON public.copywriting_assets
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.customer_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own customer data" ON public.customer_data
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.customer_data_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own customer data imports" ON public.customer_data_imports
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own company info" ON public.company_info
  FOR ALL USING (auth.uid() = user_id);
