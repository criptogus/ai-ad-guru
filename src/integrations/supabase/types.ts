export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_contents: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          credits_used: number
          dalle_prompt: string | null
          description: string | null
          gpt_prompt: string | null
          headline: string | null
          id: string
          image_url: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          credits_used?: number
          dalle_prompt?: string | null
          description?: string | null
          gpt_prompt?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          credits_used?: number
          dalle_prompt?: string | null
          description?: string | null
          gpt_prompt?: string | null
          headline?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ad_optimizations: {
        Row: {
          action: string
          ad_id: string
          applied_at: string | null
          campaign_id: string | null
          created_at: string | null
          id: string
          reason: string
          status: string
        }
        Insert: {
          action: string
          ad_id: string
          applied_at?: string | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          reason: string
          status?: string
        }
        Update: {
          action?: string
          ad_id?: string
          applied_at?: string | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string
          status?: string
        }
        Relationships: []
      }
      ad_performance: {
        Row: {
          ad_id: string
          campaign_id: string | null
          clicks: number
          conversions: number
          cost_micros: number
          created_at: string | null
          date: string
          id: string
          impressions: number
        }
        Insert: {
          ad_id: string
          campaign_id?: string | null
          clicks?: number
          conversions?: number
          cost_micros?: number
          created_at?: string | null
          date: string
          id?: string
          impressions?: number
        }
        Update: {
          ad_id?: string
          campaign_id?: string | null
          clicks?: number
          conversions?: number
          cost_micros?: number
          created_at?: string | null
          date?: string
          id?: string
          impressions?: number
        }
        Relationships: []
      }
      billing_transactions: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          id: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          status: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          company_description: string
          competitors: string[]
          country: string
          created_at: string
          currency: string
          daily_budget: number
          google_ads: Json | null
          id: string
          image_generated_at: string | null
          image_prompt: string | null
          image_style: string | null
          image_url: string | null
          instagram_ads: Json | null
          keywords: string
          language: string
          language_tone: string
          name: string
          status: string
          target_audience: string
          updated_at: string
          user_id: string
          website_url: string
        }
        Insert: {
          company_description: string
          competitors?: string[]
          country: string
          created_at?: string
          currency: string
          daily_budget: number
          google_ads?: Json | null
          id?: string
          image_generated_at?: string | null
          image_prompt?: string | null
          image_style?: string | null
          image_url?: string | null
          instagram_ads?: Json | null
          keywords: string
          language: string
          language_tone: string
          name: string
          status?: string
          target_audience: string
          updated_at?: string
          user_id: string
          website_url: string
        }
        Update: {
          company_description?: string
          competitors?: string[]
          country?: string
          created_at?: string
          currency?: string
          daily_budget?: number
          google_ads?: Json | null
          id?: string
          image_generated_at?: string | null
          image_prompt?: string | null
          image_style?: string | null
          image_url?: string | null
          instagram_ads?: Json | null
          keywords?: string
          language?: string
          language_tone?: string
          name?: string
          status?: string
          target_audience?: string
          updated_at?: string
          user_id?: string
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      credits_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          transaction_type: Database["public"]["Enums"]["credit_transaction_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type: Database["public"]["Enums"]["credit_transaction_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: Database["public"]["Enums"]["credit_transaction_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      global_config: {
        Row: {
          created_at: string | null
          description: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      google_ads_config: {
        Row: {
          created_at: string | null
          customer_id: string
          developer_token: string
          id: string
          login_customer_id: string | null
          refresh_token: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          developer_token: string
          id?: string
          login_customer_id?: string | null
          refresh_token: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          developer_token?: string
          id?: string
          login_customer_id?: string | null
          refresh_token?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "google_ads_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_config: {
        Row: {
          created_at: string | null
          description: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          id: string
          stripe_customer_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_customer_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_prices: {
        Row: {
          active: boolean | null
          created_at: string | null
          credit_limit: number | null
          currency: string
          id: string
          interval: string | null
          interval_count: number | null
          stripe_id: string
          trial_period_days: number | null
          unit_amount: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          credit_limit?: number | null
          currency: string
          id?: string
          interval?: string | null
          interval_count?: number | null
          stripe_id: string
          trial_period_days?: number | null
          unit_amount: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          credit_limit?: number | null
          currency?: string
          id?: string
          interval?: string | null
          interval_count?: number | null
          stripe_id?: string
          trial_period_days?: number | null
          unit_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_products: {
        Row: {
          active: boolean | null
          created_at: string | null
          currency: string
          description: string | null
          features: Json | null
          id: string
          interval: string
          name: string
          price: number
          price_id: string
          stripe_product_id: string
          trial_days: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          name: string
          price: number
          price_id: string
          stripe_product_id: string
          trial_days?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          name?: string
          price?: number
          price_id?: string
          stripe_product_id?: string
          trial_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_price_id: string
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status: string
          stripe_price_id: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_price_id?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_runs: {
        Row: {
          created_at: string | null
          duration: number | null
          error: string | null
          id: string
          request: Json
          response: Json | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          error?: string | null
          id?: string
          request?: Json
          response?: Json | null
          status: string
          type: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          error?: string | null
          id?: string
          request?: Json
          response?: Json | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          available_credits: number | null
          avatar_url: string | null
          created_at: string | null
          credit_balance: number | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          last_login: string | null
          phone_number: string | null
          role: string | null
          stripe_customer_id: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          available_credits?: number | null
          avatar_url?: string | null
          created_at?: string | null
          credit_balance?: number | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone_number?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          available_credits?: number | null
          avatar_url?: string | null
          created_at?: string | null
          credit_balance?: number | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone_number?: string | null
          role?: string | null
          stripe_customer_id?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          data: Json
          error: string | null
          id: string
          processed: boolean | null
          processed_at: string | null
          stripe_event_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          error?: string | null
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          stripe_event_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          error?: string | null
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          stripe_event_id?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_user_credits: {
        Args: {
          user_id_param: string
          amount_param: number
          description_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      campaign_status: "draft" | "active" | "paused" | "completed"
      credit_transaction_type: "purchase" | "usage" | "refund"
      platform_type: "google" | "facebook" | "instagram"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
