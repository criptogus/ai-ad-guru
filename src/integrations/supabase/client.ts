
// This file contains the Supabase client for database access
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://svnockyhgohttzgbgydo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bm9ja3loZ29odHR6Z2JneWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDEwMTEsImV4cCI6MjA1Nzg3NzAxMX0.wJ4kM_H0HR-X1u5LQecSzgEq0UuebZaeYUaI_uS2ah4";

// Type definitions for our Supabase database
export type Tables = {
  campaign_performance: any;
  campaigns: any;
  profiles: any;
  team_invitations: any;
  team_members: any;
  user_integrations: any;
  "Zero Digital Agency LLC": any;
  
  // Our custom tables with complete type definitions
  media_assets: {
    Row: {
      id: string;
      user_id: string;
      filename: string;
      file_path: string;
      file_size: number;
      file_type: string;
      campaigns: string[];
      metadata: Record<string, any> | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      filename: string;
      file_path: string;
      file_size: number;
      file_type: string;
      campaigns?: string[];
      metadata?: Record<string, any> | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      filename?: string;
      file_path?: string;
      file_size?: number;
      file_type?: string;
      campaigns?: string[];
      metadata?: Record<string, any> | null;
      created_at?: string;
      updated_at?: string;
    };
  };
  
  copywriting_assets: {
    Row: {
      id: string;
      user_id: string;
      text: string;
      platform: string;
      character_count: number;
      published_at: string;
      created_at: string;
      updated_at: string;
      campaign_id?: string;
      ad_type?: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      text: string;
      platform: string;
      character_count: number;
      published_at?: string;
      created_at?: string;
      updated_at?: string;
      campaign_id?: string;
      ad_type?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      text?: string;
      platform?: string;
      character_count?: number;
      published_at?: string;
      created_at?: string;
      updated_at?: string;
      campaign_id?: string;
      ad_type?: string;
    };
  };
  
  customer_data: {
    Row: {
      id: string;
      user_id: string;
      email: string;
      name?: string;
      segment?: string;
      created_at: string;
      updated_at: string;
      list_name?: string;
      import_batch?: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      email: string;
      name?: string;
      segment?: string;
      created_at?: string;
      updated_at?: string;
      list_name?: string;
      import_batch?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      email?: string;
      name?: string;
      segment?: string;
      created_at?: string;
      updated_at?: string;
      list_name?: string;
      import_batch?: string;
    };
  };
  
  customer_data_imports: {
    Row: {
      id: string;
      user_id: string;
      list_name: string;
      record_count: number;
      created_at: string;
      status: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      list_name: string;
      record_count: number;
      created_at?: string;
      status: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      list_name?: string;
      record_count?: number;
      created_at?: string;
      status?: string;
    };
  };
  
  company_info: {
    Row: {
      id: string;
      user_id: string;
      company_name: string;
      website?: string;
      industry?: string;
      target_market?: string;
      language?: string;
      tone_of_voice?: string;
      custom_tone?: string;
      primary_color?: string;
      secondary_color?: string;
      logo_url?: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      company_name: string;
      website?: string;
      industry?: string;
      target_market?: string;
      language?: string;
      tone_of_voice?: string;
      custom_tone?: string;
      primary_color?: string;
      secondary_color?: string;
      logo_url?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      company_name?: string;
      website?: string;
      industry?: string;
      target_market?: string;
      language?: string;
      tone_of_voice?: string;
      custom_tone?: string;
      primary_color?: string;
      secondary_color?: string;
      logo_url?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
};

// Modify the Database interface declaration for type augmentation
export interface Database {
  public: {
    Tables: Tables;
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string[];
    };
    CompositeTypes: {
      [key: string]: {
        [key: string]: unknown;
      };
    };
  };
}

// Create and export the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

