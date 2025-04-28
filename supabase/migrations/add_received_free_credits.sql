
-- First check if the column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'received_free_credits'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE public.profiles ADD COLUMN received_free_credits BOOLEAN DEFAULT FALSE;
  END IF;
END
$$;

-- Create a function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION public.add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
) RETURNS void AS $$
DECLARE
  column_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = $1 AND column_name = $2
  ) INTO column_exists;

  IF NOT column_exists THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s DEFAULT FALSE', $1, $2, $3);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
