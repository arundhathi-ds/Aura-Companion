export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      completed_creativity: {
        Row: {
          category: string
          completed_at: string
          content: string | null
          id: string
          photo_url: string | null
          prompt: string
          reflection: string | null
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string
          content?: string | null
          id?: string
          photo_url?: string | null
          prompt: string
          reflection?: string | null
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string
          content?: string | null
          id?: string
          photo_url?: string | null
          prompt?: string
          reflection?: string | null
          user_id?: string
        }
        Relationships: []
      }
      completed_experiences: {
        Row: {
          completed_at: string
          duration_min: number | null
          experience_slug: string
          id: string
          mood_after: string | null
          mood_before: string | null
          note: string | null
          photo_url: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          duration_min?: number | null
          experience_slug: string
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          note?: string | null
          photo_url?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          duration_min?: number | null
          experience_slug?: string
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          note?: string | null
          photo_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journals: {
        Row: {
          ai_emotion: string | null
          ai_summary: string | null
          content: string
          created_at: string
          id: string
          mood: string | null
          prompt: string | null
          user_id: string
        }
        Insert: {
          ai_emotion?: string | null
          ai_summary?: string | null
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          prompt?: string | null
          user_id: string
        }
        Update: {
          ai_emotion?: string | null
          ai_summary?: string | null
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          prompt?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          energy: number | null
          id: string
          logged_at: string
          mood: string
          note: string | null
          user_id: string
        }
        Insert: {
          energy?: number | null
          id?: string
          logged_at?: string
          mood: string
          note?: string | null
          user_id: string
        }
        Update: {
          energy?: number | null
          id?: string
          logged_at?: string
          mood?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_mood: string | null
          display_name: string | null
          focus_areas: string[] | null
          id: string
          intentions: string[] | null
          onboarding_completed: boolean
          tone_preference: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_mood?: string | null
          display_name?: string | null
          focus_areas?: string[] | null
          id: string
          intentions?: string[] | null
          onboarding_completed?: boolean
          tone_preference?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_mood?: string | null
          display_name?: string | null
          focus_areas?: string[] | null
          id?: string
          intentions?: string[] | null
          onboarding_completed?: boolean
          tone_preference?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_experiences: {
        Row: {
          experience_slug: string
          id: string
          note: string | null
          saved_at: string
          user_id: string
        }
        Insert: {
          experience_slug: string
          id?: string
          note?: string | null
          saved_at?: string
          user_id: string
        }
        Update: {
          experience_slug?: string
          id?: string
          note?: string | null
          saved_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          id: string
          key: string
          updated_at: string
          user_id: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          user_id: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          user_id?: string
          value?: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
