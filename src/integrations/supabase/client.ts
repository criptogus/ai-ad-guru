
// This file contains the Supabase client for database access
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://svnockyhgohttzgbgydo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bm9ja3loZ29odHR6Z2JneWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDEwMTEsImV4cCI6MjA1Nzg3NzAxMX0.wJ4kM_H0HR-X1u5LQecSzgEq0UuebZaeYUaI_uS2ah4";

// Type augmentation for Supabase client to recognize our custom tables
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        // Default tables from the database schema
        campaign_performance: any;
        campaigns: any;
        profiles: any;
        team_invitations: any;
        team_members: any;
        user_integrations: any;
        "Zero Digital Agency LLC": any;
        
        // Our custom tables
        media_assets: any;
        copywriting_assets: any;
        customer_data: any;
        customer_data_imports: any;
        company_info: any;
      };
    };
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
