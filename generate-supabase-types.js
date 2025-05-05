
// generate-supabase-types.js
// This script generates TypeScript types for Supabase tables
import fs from 'fs';

console.log('Generating Supabase types...');

const typeDefinitions = `
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ad_spend_fees: {
        Row: {
          id: string
          user_id: string
          campaign_id: string
          spend_amount: number
          fee_amount: number
          date: string
          stripe_usage_record_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_id: string
          spend_amount: number
          fee_amount: number
          date: string
          stripe_usage_record_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_id?: string
          spend_amount?: number
          fee_amount?: number
          date?: string
          stripe_usage_record_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_spend_fees_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_spend_fees_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          }
        ]
      }
      company_info: {
        Row: {
          id: string
          user_id: string
          company_name: string
          website: string | null
          industry: string | null
          target_market: string | null
          language: string | null
          tone_of_voice: string | null
          custom_tone: string | null
          primary_color: string | null
          secondary_color: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          website?: string | null
          industry?: string | null
          target_market?: string | null
          language?: string | null
          tone_of_voice?: string | null
          custom_tone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          website?: string | null
          industry?: string | null
          target_market?: string | null
          language?: string | null
          tone_of_voice?: string | null
          custom_tone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_info_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          name: string
          avatar: string | null
          credits: number | null
          has_paid: boolean | null
          created_at: string | null
          updated_at: string | null
          onboarding_completed: boolean | null
          welcome_credits_seen: boolean | null
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          name: string
          avatar?: string | null
          credits?: number | null
          has_paid?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          onboarding_completed?: boolean | null
          welcome_credits_seen?: boolean | null
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatar?: string | null
          credits?: number | null
          has_paid?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          onboarding_completed?: boolean | null
          welcome_credits_seen?: boolean | null
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // Include other tables here if needed
    }
    Views: {
      // Define views if needed
    }
    Functions: {
      // Define functions if needed
    }
    Enums: {
      // Define enums if needed
    }
  }
}
`;

// Write types definition to a file
fs.writeFileSync('./src/integrations/supabase/types.d.ts', typeDefinitions);
console.log('Supabase types generated successfully!');
