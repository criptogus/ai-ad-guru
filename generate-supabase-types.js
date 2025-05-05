
// generate-supabase-types.js
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
      oauth_states: {
        Row: {
          id: string
          user_id: string 
          platform: string
          redirect_uri: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id: string
          user_id: string
          platform: string
          redirect_uri: string
          created_at: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          redirect_uri?: string
          created_at?: string
          expires_at?: string
        }
        Relationships: []
      }
      app_prompts: {
        Row: {
          id: string
          key: string
          prompt: string
          description: string | null
          version: number | null
          read_only: boolean | null
          created_at: string | null
          updated_at: string | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          key: string
          prompt: string
          description?: string | null
          version?: number | null
          read_only?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          key?: string
          prompt?: string
          description?: string | null
          version?: number | null
          read_only?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          is_active?: boolean | null
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          id: string
          user_id: string
          platform: string
          access_token: string
          refresh_token: string | null
          account_id: string | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          access_token: string
          refresh_token?: string | null
          account_id?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          access_token?: string
          refresh_token?: string | null
          account_id?: string | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      // Include other tables here if needed
    }
    Views: {
      credit_balance: {
        Row: {
          total_credits: number | null
          user_id: string | null
        }
      }
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
