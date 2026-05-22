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
      attic_artifacts: {
        Row: {
          artifact_type: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          observation: string | null
          user_id: string
        }
        Insert: {
          artifact_type?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          observation?: string | null
          user_id: string
        }
        Update: {
          artifact_type?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          observation?: string | null
          user_id?: string
        }
        Relationships: []
      }
      completed_experiences: {
        Row: {
          atmosphere_tags: string[] | null
          completed_at: string
          duration_min: number | null
          experience_slug: string
          id: string
          mood_after: string | null
          mood_before: string | null
          note: string | null
          photo_url: string | null
          resonance_score: number | null
          user_id: string
        }
        Insert: {
          atmosphere_tags?: string[] | null
          completed_at?: string
          duration_min?: number | null
          experience_slug: string
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          note?: string | null
          photo_url?: string | null
          resonance_score?: number | null
          user_id: string
        }
        Update: {
          atmosphere_tags?: string[] | null
          completed_at?: string
          duration_min?: number | null
          experience_slug?: string
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          note?: string | null
          photo_url?: string | null
          resonance_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_arcs: {
        Row: {
          arc_name: string
          ended_at: string | null
          id: string
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          arc_name: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          arc_name?: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      emotional_weather: {
        Row: {
          created_at: string | null
          id: string
          intensity: number
          triggered_by: string | null
          user_id: string
          weather_state: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          intensity?: number
          triggered_by?: string | null
          user_id: string
          weather_state: string
        }
        Update: {
          created_at?: string | null
          id?: string
          intensity?: number
          triggered_by?: string | null
          user_id?: string
          weather_state?: string
        }
        Relationships: []
      }
      journals: {
        Row: {
          ai_emotion: string | null
          ai_summary: string | null
          atmosphere_tags: string[] | null
          content: string
          created_at: string
          id: string
          mood: string | null
          prompt: string | null
          resonance_score: number | null
          user_id: string
        }
        Insert: {
          ai_emotion?: string | null
          ai_summary?: string | null
          atmosphere_tags?: string[] | null
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          prompt?: string | null
          resonance_score?: number | null
          user_id: string
        }
        Update: {
          ai_emotion?: string | null
          ai_summary?: string | null
          atmosphere_tags?: string[] | null
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          prompt?: string | null
          resonance_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "mood_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          current_mood: string | null
          display_name: string | null
          focus_areas: string[] | null
          id: string
          intentions: string[] | null
          onboarding_completed: boolean | null
          tone_preference: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_mood?: string | null
          display_name?: string | null
          focus_areas?: string[] | null
          id: string
          intentions?: string[] | null
          onboarding_completed?: boolean | null
          tone_preference?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_mood?: string | null
          display_name?: string | null
          focus_areas?: string[] | null
          id?: string
          intentions?: string[] | null
          onboarding_completed?: boolean | null
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
