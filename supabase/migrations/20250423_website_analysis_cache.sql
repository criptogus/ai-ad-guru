
-- Create a table to cache website analysis results
CREATE TABLE IF NOT EXISTS website_analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  analysis_data JSONB NOT NULL,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_website_analysis_cache_url ON website_analysis_cache(url);

-- No RLS policies needed since this is accessed only through edge functions
