
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create Supabase client with service key for admin access
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
