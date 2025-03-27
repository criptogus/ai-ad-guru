
-- Create audience analysis cache table
CREATE TABLE IF NOT EXISTS public.audience_analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  platform TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add a unique constraint on url and platform combination
ALTER TABLE public.audience_analysis_cache
  ADD CONSTRAINT audience_analysis_cache_url_platform_key
  UNIQUE (url, platform);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS audience_analysis_cache_url_idx
  ON public.audience_analysis_cache(url);

-- Enable RLS on the table
ALTER TABLE public.audience_analysis_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow all operations for authenticated users
CREATE POLICY "Anyone can access audience analysis cache"
  ON public.audience_analysis_cache FOR ALL
  USING (true);
