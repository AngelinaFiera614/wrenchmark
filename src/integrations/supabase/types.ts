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
      brands: {
        Row: {
          country: string | null
          created_at: string
          founded: number | null
          id: string
          known_for: string[] | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          founded?: number | null
          id?: string
          known_for?: string[] | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          founded?: number | null
          id?: string
          known_for?: string[] | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      manuals: {
        Row: {
          created_at: string
          downloads: number
          file_size_mb: number | null
          file_url: string | null
          id: string
          manual_type: string | null
          motorcycle_id: string
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          created_at?: string
          downloads?: number
          file_size_mb?: number | null
          file_url?: string | null
          id?: string
          manual_type?: string | null
          motorcycle_id: string
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          created_at?: string
          downloads?: number
          file_size_mb?: number | null
          file_url?: string | null
          id?: string
          manual_type?: string | null
          motorcycle_id?: string
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "manuals_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycles"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycles: {
        Row: {
          brand_id: string
          category: string | null
          created_at: string
          difficulty_level: number | null
          engine: string | null
          fuel_capacity_l: number | null
          has_abs: boolean | null
          horsepower_hp: number | null
          id: string
          image_url: string | null
          is_placeholder: boolean
          model_name: string
          seat_height_mm: number | null
          slug: string
          summary: string | null
          tags: string[] | null
          top_speed_kph: number | null
          torque_nm: number | null
          updated_at: string
          weight_kg: number | null
          wheelbase_mm: number | null
          year: number | null
        }
        Insert: {
          brand_id: string
          category?: string | null
          created_at?: string
          difficulty_level?: number | null
          engine?: string | null
          fuel_capacity_l?: number | null
          has_abs?: boolean | null
          horsepower_hp?: number | null
          id?: string
          image_url?: string | null
          is_placeholder?: boolean
          model_name: string
          seat_height_mm?: number | null
          slug: string
          summary?: string | null
          tags?: string[] | null
          top_speed_kph?: number | null
          torque_nm?: number | null
          updated_at?: string
          weight_kg?: number | null
          wheelbase_mm?: number | null
          year?: number | null
        }
        Update: {
          brand_id?: string
          category?: string | null
          created_at?: string
          difficulty_level?: number | null
          engine?: string | null
          fuel_capacity_l?: number | null
          has_abs?: boolean | null
          horsepower_hp?: number | null
          id?: string
          image_url?: string | null
          is_placeholder?: boolean
          model_name?: string
          seat_height_mm?: number | null
          slug?: string
          summary?: string | null
          tags?: string[] | null
          top_speed_kph?: number | null
          torque_nm?: number | null
          updated_at?: string
          weight_kg?: number | null
          wheelbase_mm?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycles_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      repair_skills: {
        Row: {
          created_at: string
          difficulty: number | null
          id: string
          motorcycle_id: string | null
          safety_notes: string | null
          steps: Json | null
          title: string
          tools: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty?: number | null
          id?: string
          motorcycle_id?: string | null
          safety_notes?: string | null
          steps?: Json | null
          title: string
          tools?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: number | null
          id?: string
          motorcycle_id?: string | null
          safety_notes?: string | null
          steps?: Json | null
          title?: string
          tools?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_skills_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycles"
            referencedColumns: ["id"]
          },
        ]
      }
      riding_skills: {
        Row: {
          category: string
          created_at: string
          difficulty: number | null
          id: string
          image_url: string | null
          instructions: string
          level: string
          practice_layout: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          difficulty?: number | null
          id?: string
          image_url?: string | null
          instructions: string
          level: string
          practice_layout: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: number | null
          id?: string
          image_url?: string | null
          instructions?: string
          level?: string
          practice_layout?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_manual_downloads: {
        Args: { manual_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
