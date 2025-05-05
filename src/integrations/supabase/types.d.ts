// src/integrations/supabase/types.d.ts - Type definitions for Supabase
// This is a declaration file so we don't need to update the auto-generated types.ts file
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
      // Updated profiles with new fields
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
      ai_results: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          input: string
          metadata: Json | null
          response: Json
          type: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          input: string
          metadata?: Json | null
          response: Json
          type: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          input?: string
          metadata?: Json | null
          response?: Json
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      app_prompts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          prompt: string
          read_only: boolean | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          prompt: string
          read_only?: boolean | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          prompt?: string
          read_only?: boolean | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      audience_analysis_cache: {
        Row: {
          analysis_result: Json
          created_at: string
          id: string
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          analysis_result: Json
          created_at?: string
          id?: string
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          analysis_result?: Json
          created_at?: string
          id?: string
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      campaign_performance: {
        Row: {
          campaign_id: string
          clicks: number | null
          created_at: string | null
          ctr: number | null
          date: string | null
          id: string
          impressions: number | null
          spend: number | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          clicks?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string | null
          id?: string
          impressions?: number | null
          spend?: number | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          clicks?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string | null
          id?: string
          impressions?: number | null
          spend?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_performance_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number
          budget_type: string
          created_at: string | null
          id: string
          name: string
          platform: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget?: number
          budget_type?: string
          created_at?: string | null
          id?: string
          name: string
          platform: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget?: number
          budget_type?: string
          created_at?: string | null
          id?: string
          name?: string
          platform?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_ledger: {
        Row: {
          change: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string
          ref_id: string | null
          user_id: string
        }
        Insert: {
          change: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason: string
          ref_id?: string | null
          user_id: string
        }
        Update: {
          change?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string
          ref_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      credit_logs: {
        Row: {
          action: string
          context: Json | null
          created_at: string | null
          credits_used: number
          id: string
          user_id: string
        }
        Insert: {
          action: string
          context?: Json | null
          created_at?: string | null
          credits_used: number
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          context?: Json | null
          created_at?: string | null
          credits_used?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          image_url: string
          prompt_used: string
          template_id: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          prompt_used: string
          template_id?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          prompt_used?: string
          template_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_states: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          platform: string
          redirect_uri: string
          user_id: string
        }
        Insert: {
          created_at: string
          expires_at: string
          id: string
          platform: string
          redirect_uri: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          platform?: string
          redirect_uri?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          editable: boolean
          id: string
          prompt_text: string
          title: string
          visibility: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          editable?: boolean
          id?: string
          prompt_text: string
          title: string
          visibility?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          editable?: boolean
          id?: string
          prompt_text?: string
          title?: string
          visibility?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          accepted: boolean | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invitation_token: string
          role: string
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invitation_token: string
          role: string
        }
        Update: {
          accepted?: boolean | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          role?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_active: string | null
          name: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_active?: string | null
          name?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_active?: string | null
          name?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          access_token: string
          account_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          platform: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          account_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          account_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          platform?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      website_analysis_cache: {
        Row: {
          analysis_result: Json
          created_at: string | null
          id: string
          language: string | null
          url: string
        }
        Insert: {
          analysis_result: Json
          created_at?: string | null
          id?: string
          language?: string | null
          url: string
        }
        Update: {
          analysis_result?: Json
          created_at?: string | null
          id?: string
          language?: string | null
          url?: string
        }
        Relationships: []
      }
      "Zero Digital Agency LLC": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      credit_balance: {
        Row: {
          total_credits: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
