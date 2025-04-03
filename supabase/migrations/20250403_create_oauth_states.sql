
-- Create the oauth_states table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_oauth_states_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'oauth_states'
  ) THEN
    -- Create the oauth_states table
    CREATE TABLE public.oauth_states (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      state TEXT NOT NULL UNIQUE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      platform TEXT NOT NULL,
      redirect_uri TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    );
    
    -- Add RLS policies
    ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Service roles can do all" ON public.oauth_states
      USING (true)
      WITH CHECK (true);
      
    CREATE POLICY "Users can read their own states" ON public.oauth_states 
      FOR SELECT
      USING (auth.uid() = user_id);
      
    -- Grant access to authenticated users
    GRANT SELECT, INSERT, DELETE ON public.oauth_states TO authenticated;
    GRANT USAGE ON SEQUENCE oauth_states_id_seq TO authenticated;
  END IF;
END;
$$;
