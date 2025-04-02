
-- Create the company_info table
CREATE TABLE IF NOT EXISTS public.company_info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name text NOT NULL,
    website text,
    industry text,
    target_market text,
    language text DEFAULT 'English',
    tone_of_voice text DEFAULT 'Professional',
    custom_tone text,
    primary_color text DEFAULT '#0070f3',
    secondary_color text,
    logo_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company info" 
    ON public.company_info 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company info" 
    ON public.company_info 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company info" 
    ON public.company_info 
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- Add unique constraint to prevent multiple entries per user
CREATE UNIQUE INDEX company_info_user_id_idx ON public.company_info (user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_info_timestamp
BEFORE UPDATE ON public.company_info
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
