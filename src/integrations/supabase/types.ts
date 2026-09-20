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
      availability: {
        Row: {
          coach_id: string
          created_at: string
          day_of_week: number
          end_time: string | null
          id: string
          is_available: boolean
          start_time: string | null
        }
        Insert: {
          coach_id?: string
          created_at?: string
          day_of_week: number
          end_time?: string | null
          id?: string
          is_available?: boolean
          start_time?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string | null
          id?: string
          is_available?: boolean
          start_time?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          cancellation_note: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          coach_id: string
          created_at: string
          focus_area: string
          goals: string
          id: string
          program_interest_id: string | null
          status: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          cancellation_note?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          coach_id: string
          created_at?: string
          focus_area: string
          goals: string
          id?: string
          program_interest_id?: string | null
          status?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          cancellation_note?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          coach_id?: string
          created_at?: string
          focus_area?: string
          goals?: string
          id?: string
          program_interest_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_program_interest_id_fkey"
            columns: ["program_interest_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          coach_id: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          coach_id?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          coach_id?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      date_overrides: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          override_date: string
          reason: string | null
        }
        Insert: {
          coach_id?: string
          created_at?: string
          id?: string
          override_date: string
          reason?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          override_date?: string
          reason?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          booking_buffer_hours: number
          created_at: string
          full_name: string
          id: string
        }
        Insert: {
          booking_buffer_hours?: number
          created_at?: string
          full_name?: string
          id: string
        }
        Update: {
          booking_buffer_hours?: number
          created_at?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          coach_id: string
          created_at: string
          description: string
          display_order: number
          duration_label: string
          icon: string
          id: string
          is_active: boolean
          name: string
          who_its_for: string
        }
        Insert: {
          coach_id?: string
          created_at?: string
          description: string
          display_order?: number
          duration_label: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          who_its_for: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          description?: string
          display_order?: number
          duration_label?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          who_its_for?: string
        }
        Relationships: []
      }
    }
    Views: {
      site_owner: {
        Row: {
          booking_buffer_hours: number | null
          coach_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_owner_coach_id: { Args: never; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
