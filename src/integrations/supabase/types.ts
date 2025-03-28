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
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          credits: number | null
          has_paid: boolean | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          credits?: number | null
          has_paid?: boolean | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          credits?: number | null
          has_paid?: boolean | null
          id?: string
          name?: string
          updated_at?: string | null
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
      [_ in never]: never
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
