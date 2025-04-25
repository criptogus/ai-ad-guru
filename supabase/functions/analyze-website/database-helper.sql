
-- SQL helper for website analysis cache

-- Create a function to create the website_analysis_cache table if it doesn't exist
CREATE OR REPLACE FUNCTION create_website_analysis_cache_table()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'website_analysis_cache'
  ) THEN
    -- Create the table
    CREATE TABLE public.website_analysis_cache (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      url TEXT NOT NULL,
      analysis_result JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    
    -- Create an index on the URL column for faster lookups
    CREATE INDEX website_analysis_cache_url_idx ON public.website_analysis_cache(url);
    
    -- Set up RLS
    ALTER TABLE public.website_analysis_cache ENABLE ROW LEVEL SECURITY;
    
    -- Create a policy that allows anyone to read the cache
    CREATE POLICY "Allow anyone to read website_analysis_cache" 
      ON public.website_analysis_cache 
      FOR SELECT 
      USING (true);
      
    -- Create a policy that allows service role to insert/update cache
    CREATE POLICY "Allow service_role to insert into website_analysis_cache" 
      ON public.website_analysis_cache 
      FOR INSERT 
      WITH CHECK (true);
      
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;
