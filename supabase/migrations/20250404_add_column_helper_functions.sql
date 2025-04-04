
-- Create a function to check if another function exists
CREATE OR REPLACE FUNCTION public.function_exists(function_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM pg_proc
    JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE pg_proc.proname = function_name
    AND pg_namespace.nspname = 'public'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to create the get_table_columns function
CREATE OR REPLACE FUNCTION public.create_get_columns_function()
RETURNS boolean AS $$
BEGIN
  -- Drop the function if it already exists
  DROP FUNCTION IF EXISTS public.get_table_columns;

  -- Create the function
  CREATE OR REPLACE FUNCTION public.get_table_columns(table_name text)
  RETURNS TABLE(column_name text, data_type text) AS $$
  BEGIN
    RETURN QUERY
    SELECT c.column_name::text, c.data_type::text
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = table_name
    ORDER BY c.ordinal_position;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to create get_table_columns
SELECT create_get_columns_function();
