
-- Drop the table if it exists to avoid conflicts
DROP TABLE IF EXISTS public.oauth_states;

-- Create a new oauth_states table with all required fields
CREATE TABLE public.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 minutes'),
  
  -- Add index on state for faster lookups
  CONSTRAINT idx_oauth_states_state UNIQUE (state)
);

-- Set up Row Level Security
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert
CREATE POLICY "Anyone can insert oauth states" 
  ON public.oauth_states 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows service role to do anything
CREATE POLICY "Service roles can do all" 
  ON public.oauth_states
  USING (true)
  WITH CHECK (true);
  
-- Create policy that allows users to read their own states
CREATE POLICY "Users can read their own states" 
  ON public.oauth_states 
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own states
CREATE POLICY "Users can delete their own states" 
  ON public.oauth_states 
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.oauth_states TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.oauth_states TO anon;
GRANT USAGE ON SEQUENCE oauth_states_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE oauth_states_id_seq TO anon;

-- Create a function to periodically clean up expired states
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_states()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.oauth_states WHERE expires_at < now();
END;
$$;
