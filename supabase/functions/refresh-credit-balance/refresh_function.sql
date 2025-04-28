
-- Create a SQL function to refresh the materialized view
CREATE OR REPLACE FUNCTION public.refresh_materialized_view(view_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('REFRESH MATERIALIZED VIEW %I', view_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
