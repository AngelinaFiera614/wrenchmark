export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      brake_systems: {
        Row: {
          brake_brand: string | null
          caliper_type: string | null
          created_at: string | null
          front_disc_size_mm: string | null
          front_type: string | null
          has_abs: boolean | null
          has_traction_control: boolean | null
          id: string
          is_draft: boolean
          notes: string | null
          rear_disc_size_mm: string | null
          rear_type: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          brake_brand?: string | null
          caliper_type?: string | null
          created_at?: string | null
          front_disc_size_mm?: string | null
          front_type?: string | null
          has_abs?: boolean | null
          has_traction_control?: boolean | null
          id?: string
          is_draft?: boolean
          notes?: string | null
          rear_disc_size_mm?: string | null
          rear_type?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          brake_brand?: string | null
          caliper_type?: string | null
          created_at?: string | null
          front_disc_size_mm?: string | null
          front_type?: string | null
          has_abs?: boolean | null
          has_traction_control?: boolean | null
          id?: string
          is_draft?: boolean
          notes?: string | null
          rear_disc_size_mm?: string | null
          rear_type?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          brand_history: string | null
          categories: string[] | null
          country: string | null
          created_at: string
          description: string | null
          founded: number | null
          founded_city: string | null
          headquarters: string | null
          id: string
          known_for: string[] | null
          logo_url: string | null
          manufacturing_facilities: string[] | null
          milestones: Json | null
          name: string
          notable_models: Json | null
          notes: string | null
          slug: string
          status: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          brand_history?: string | null
          categories?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded?: number | null
          founded_city?: string | null
          headquarters?: string | null
          id?: string
          known_for?: string[] | null
          logo_url?: string | null
          manufacturing_facilities?: string[] | null
          milestones?: Json | null
          name: string
          notable_models?: Json | null
          notes?: string | null
          slug: string
          status?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          brand_history?: string | null
          categories?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded?: number | null
          founded_city?: string | null
          headquarters?: string | null
          id?: string
          known_for?: string[] | null
          logo_url?: string | null
          manufacturing_facilities?: string[] | null
          milestones?: Json | null
          name?: string
          notable_models?: Json | null
          notes?: string | null
          slug?: string
          status?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      color_options: {
        Row: {
          availability_status: string | null
          color_description: string | null
          color_family: string | null
          created_at: string
          finish_type: string | null
          hex_code: string | null
          id: string
          image_url: string | null
          is_limited: boolean | null
          model_year_id: string
          msrp_premium_usd: number | null
          name: string
          popularity_score: number | null
          production_years: unknown | null
          special_edition_name: string | null
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          color_description?: string | null
          color_family?: string | null
          created_at?: string
          finish_type?: string | null
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_limited?: boolean | null
          model_year_id: string
          msrp_premium_usd?: number | null
          name: string
          popularity_score?: number | null
          production_years?: unknown | null
          special_edition_name?: string | null
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          color_description?: string | null
          color_family?: string | null
          created_at?: string
          finish_type?: string | null
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_limited?: boolean | null
          model_year_id?: string
          msrp_premium_usd?: number | null
          name?: string
          popularity_score?: number | null
          production_years?: unknown | null
          special_edition_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      color_popularity_tracking: {
        Row: {
          color_option_id: string
          created_at: string | null
          id: string
          popularity_rank: number | null
          selection_percentage: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          color_option_id: string
          created_at?: string | null
          id?: string
          popularity_rank?: number | null
          selection_percentage?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          color_option_id?: string
          created_at?: string | null
          id?: string
          popularity_rank?: number | null
          selection_percentage?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "color_popularity_tracking_color_option_id_fkey"
            columns: ["color_option_id"]
            isOneToOne: false
            referencedRelation: "color_options"
            referencedColumns: ["id"]
          },
        ]
      }
      color_variants: {
        Row: {
          brand_id: string | null
          color_code: string
          created_at: string | null
          description: string | null
          hex_code: string | null
          id: string
          image_url: string | null
          is_matte: boolean | null
          is_metallic: boolean | null
          is_pearl: boolean | null
          name: string
          updated_at: string | null
          year_discontinued: number | null
          year_introduced: number | null
        }
        Insert: {
          brand_id?: string | null
          color_code: string
          created_at?: string | null
          description?: string | null
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_matte?: boolean | null
          is_metallic?: boolean | null
          is_pearl?: boolean | null
          name: string
          updated_at?: string | null
          year_discontinued?: number | null
          year_introduced?: number | null
        }
        Update: {
          brand_id?: string | null
          color_code?: string
          created_at?: string | null
          description?: string | null
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_matte?: boolean | null
          is_metallic?: boolean | null
          is_pearl?: boolean | null
          name?: string
          updated_at?: string | null
          year_discontinued?: number | null
          year_introduced?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "color_variants_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      component_usage_stats: {
        Row: {
          component_id: string
          component_type: string
          created_at: string | null
          id: string
          last_used_at: string | null
          model_count: number | null
          trim_count: number | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          component_id: string
          component_type: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          model_count?: number | null
          trim_count?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          component_id?: string
          component_type?: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          model_count?: number | null
          trim_count?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      content_block_types: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          schema: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          schema?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          schema?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_verification_log: {
        Row: {
          email: string
          expires_at: string
          id: string
          ip_address: unknown | null
          sent_at: string
          status: string
          user_agent: string | null
          user_id: string
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          email: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          sent_at?: string
          status?: string
          user_agent?: string | null
          user_id: string
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          sent_at?: string
          status?: string
          user_agent?: string | null
          user_id?: string
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      engines: {
        Row: {
          bore_mm: number | null
          compression_ratio: string | null
          cooling: string | null
          created_at: string | null
          cylinder_count: number | null
          displacement_cc: number
          engine_code: string | null
          engine_type: string | null
          fuel_system: string | null
          id: string
          ignition: string | null
          is_draft: boolean
          name: string
          notes: string | null
          power_hp: number | null
          power_rpm: number | null
          starter: string | null
          stroke_mm: number | null
          stroke_type: string | null
          torque_nm: number | null
          torque_rpm: number | null
          updated_at: string | null
          valve_count: number | null
          valve_train: string | null
          valves_per_cylinder: number | null
        }
        Insert: {
          bore_mm?: number | null
          compression_ratio?: string | null
          cooling?: string | null
          created_at?: string | null
          cylinder_count?: number | null
          displacement_cc: number
          engine_code?: string | null
          engine_type?: string | null
          fuel_system?: string | null
          id?: string
          ignition?: string | null
          is_draft?: boolean
          name: string
          notes?: string | null
          power_hp?: number | null
          power_rpm?: number | null
          starter?: string | null
          stroke_mm?: number | null
          stroke_type?: string | null
          torque_nm?: number | null
          torque_rpm?: number | null
          updated_at?: string | null
          valve_count?: number | null
          valve_train?: string | null
          valves_per_cylinder?: number | null
        }
        Update: {
          bore_mm?: number | null
          compression_ratio?: string | null
          cooling?: string | null
          created_at?: string | null
          cylinder_count?: number | null
          displacement_cc?: number
          engine_code?: string | null
          engine_type?: string | null
          fuel_system?: string | null
          id?: string
          ignition?: string | null
          is_draft?: boolean
          name?: string
          notes?: string | null
          power_hp?: number | null
          power_rpm?: number | null
          starter?: string | null
          stroke_mm?: number | null
          stroke_type?: string | null
          torque_nm?: number | null
          torque_rpm?: number | null
          updated_at?: string | null
          valve_count?: number | null
          valve_train?: string | null
          valves_per_cylinder?: number | null
        }
        Relationships: []
      }
      frames: {
        Row: {
          construction_method: string | null
          created_at: string | null
          id: string
          is_draft: boolean
          material: string | null
          mounting_type: string | null
          notes: string | null
          rake_degrees: number | null
          trail_mm: number | null
          type: string
          updated_at: string | null
          wheelbase_mm: number | null
        }
        Insert: {
          construction_method?: string | null
          created_at?: string | null
          id?: string
          is_draft?: boolean
          material?: string | null
          mounting_type?: string | null
          notes?: string | null
          rake_degrees?: number | null
          trail_mm?: number | null
          type: string
          updated_at?: string | null
          wheelbase_mm?: number | null
        }
        Update: {
          construction_method?: string | null
          created_at?: string | null
          id?: string
          is_draft?: boolean
          material?: string | null
          mounting_type?: string | null
          notes?: string | null
          rake_degrees?: number | null
          trail_mm?: number | null
          type?: string
          updated_at?: string | null
          wheelbase_mm?: number | null
        }
        Relationships: []
      }
      glossary_terms: {
        Row: {
          category: string[] | null
          created_at: string
          definition: string
          id: string
          image_url: string | null
          related_terms: string[] | null
          slug: string
          term: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string[] | null
          created_at?: string
          definition: string
          id?: string
          image_url?: string | null
          related_terms?: string[] | null
          slug: string
          term: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string[] | null
          created_at?: string
          definition?: string
          id?: string
          image_url?: string | null
          related_terms?: string[] | null
          slug?: string
          term?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      lesson_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          lesson_id: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          lesson_id: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          lesson_id?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_analytics_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_quizzes: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          passing_score: number
          questions: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          passing_score: number
          questions: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          passing_score?: number
          questions?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_skills: {
        Row: {
          lesson_id: string
          level: number
          skill_id: string
        }
        Insert: {
          lesson_id: string
          level?: number
          skill_id: string
        }
        Update: {
          lesson_id?: string
          level?: number
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_skills_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_templates: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_blocks: Json
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_blocks?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_blocks?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          content_blocks: Json | null
          course_id: string
          created_at: string
          difficulty_level: number | null
          estimated_time_minutes: number | null
          glossary_terms: string[] | null
          id: string
          order: number
          published: boolean
          skill_tags: string[] | null
          slug: string
          state_code: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          content_blocks?: Json | null
          course_id: string
          created_at?: string
          difficulty_level?: number | null
          estimated_time_minutes?: number | null
          glossary_terms?: string[] | null
          id?: string
          order: number
          published?: boolean
          skill_tags?: string[] | null
          slug: string
          state_code?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          content_blocks?: Json | null
          course_id?: string
          created_at?: string
          difficulty_level?: number | null
          estimated_time_minutes?: number | null
          glossary_terms?: string[] | null
          id?: string
          order?: number
          published?: boolean
          skill_tags?: string[] | null
          slug?: string
          state_code?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_state_code_fkey"
            columns: ["state_code"]
            isOneToOne: false
            referencedRelation: "state_rules"
            referencedColumns: ["state_code"]
          },
        ]
      }
      manual_tag_associations: {
        Row: {
          manual_id: string
          tag_id: string
        }
        Insert: {
          manual_id: string
          tag_id: string
        }
        Update: {
          manual_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_tag_associations_manual_id_fkey"
            columns: ["manual_id"]
            isOneToOne: false
            referencedRelation: "manuals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_tag_associations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "manual_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_tags: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
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
          make: string | null
          manual_type: string | null
          model: string | null
          model_id: string | null
          motorcycle_id: string | null
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
          make?: string | null
          manual_type?: string | null
          model?: string | null
          model_id?: string | null
          motorcycle_id?: string | null
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
          make?: string | null
          manual_type?: string | null
          model?: string | null
          model_id?: string | null
          motorcycle_id?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "manuals_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          created_by: string | null
          file_name: string
          file_size_bytes: number | null
          file_type: string
          file_url: string
          id: string
          mime_type: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          created_by?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_type: string
          file_url: string
          id?: string
          mime_type?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          created_by?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string
          file_url?: string
          id?: string
          mime_type?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      model_component_assignments: {
        Row: {
          assignment_type: string | null
          component_id: string
          component_type: string
          created_at: string | null
          effective_from_year: number | null
          effective_to_year: number | null
          id: string
          is_default: boolean | null
          model_id: string | null
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          assignment_type?: string | null
          component_id: string
          component_type: string
          created_at?: string | null
          effective_from_year?: number | null
          effective_to_year?: number | null
          id?: string
          is_default?: boolean | null
          model_id?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          assignment_type?: string | null
          component_id?: string
          component_type?: string
          created_at?: string | null
          effective_from_year?: number | null
          effective_to_year?: number | null
          id?: string
          is_default?: boolean | null
          model_id?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_component_assignments_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_configurations: {
        Row: {
          brake_system_id: string | null
          brake_system_override: boolean | null
          color_id: string | null
          created_at: string
          description: string | null
          engine_id: string | null
          engine_override: boolean | null
          frame_id: string | null
          frame_override: boolean | null
          fuel_capacity_l: number | null
          ground_clearance_mm: number | null
          id: string
          image_url: string | null
          is_default: boolean | null
          is_draft: boolean
          market_region: string | null
          model_year_id: string
          msrp_usd: number | null
          name: string | null
          notes: string | null
          optional_equipment: string[] | null
          price_premium_usd: number | null
          seat_height_mm: number | null
          special_features: string[] | null
          suspension_id: string | null
          suspension_override: boolean | null
          trim_level: string | null
          updated_at: string
          weight_kg: number | null
          wheel_id: string | null
          wheel_override: boolean | null
          wheelbase_mm: number | null
        }
        Insert: {
          brake_system_id?: string | null
          brake_system_override?: boolean | null
          color_id?: string | null
          created_at?: string
          description?: string | null
          engine_id?: string | null
          engine_override?: boolean | null
          frame_id?: string | null
          frame_override?: boolean | null
          fuel_capacity_l?: number | null
          ground_clearance_mm?: number | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          is_draft?: boolean
          market_region?: string | null
          model_year_id: string
          msrp_usd?: number | null
          name?: string | null
          notes?: string | null
          optional_equipment?: string[] | null
          price_premium_usd?: number | null
          seat_height_mm?: number | null
          special_features?: string[] | null
          suspension_id?: string | null
          suspension_override?: boolean | null
          trim_level?: string | null
          updated_at?: string
          weight_kg?: number | null
          wheel_id?: string | null
          wheel_override?: boolean | null
          wheelbase_mm?: number | null
        }
        Update: {
          brake_system_id?: string | null
          brake_system_override?: boolean | null
          color_id?: string | null
          created_at?: string
          description?: string | null
          engine_id?: string | null
          engine_override?: boolean | null
          frame_id?: string | null
          frame_override?: boolean | null
          fuel_capacity_l?: number | null
          ground_clearance_mm?: number | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          is_draft?: boolean
          market_region?: string | null
          model_year_id?: string
          msrp_usd?: number | null
          name?: string | null
          notes?: string | null
          optional_equipment?: string[] | null
          price_premium_usd?: number | null
          seat_height_mm?: number | null
          special_features?: string[] | null
          suspension_id?: string | null
          suspension_override?: boolean | null
          trim_level?: string | null
          updated_at?: string
          weight_kg?: number | null
          wheel_id?: string | null
          wheel_override?: boolean | null
          wheelbase_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_model_configurations_model_year"
            columns: ["model_year_id"]
            isOneToOne: false
            referencedRelation: "model_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_configurations_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "color_options"
            referencedColumns: ["id"]
          },
        ]
      }
      model_years: {
        Row: {
          changes: string | null
          created_at: string
          id: string
          image_url: string | null
          is_available: boolean | null
          is_draft: boolean
          marketing_tagline: string | null
          motorcycle_id: string
          msrp_usd: number | null
          updated_at: string
          year: number
        }
        Insert: {
          changes?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_draft?: boolean
          marketing_tagline?: string | null
          motorcycle_id: string
          msrp_usd?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          changes?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_draft?: boolean
          marketing_tagline?: string | null
          motorcycle_id?: string
          msrp_usd?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_years_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycle_documents: {
        Row: {
          created_at: string | null
          description: string | null
          document_type: string | null
          document_url: string
          download_count: number | null
          file_size_bytes: number | null
          id: string
          is_official: boolean | null
          language: string | null
          model_year_id: string | null
          motorcycle_id: string | null
          page_count: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          year_published: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          document_url: string
          download_count?: number | null
          file_size_bytes?: number | null
          id?: string
          is_official?: boolean | null
          language?: string | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          page_count?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          year_published?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          document_url?: string
          download_count?: number | null
          file_size_bytes?: number | null
          id?: string
          is_official?: boolean | null
          language?: string | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          page_count?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          year_published?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_documents_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycle_images: {
        Row: {
          alt_text: string | null
          angle: string | null
          brand: string | null
          caption: string | null
          color: string | null
          color_code: string | null
          configuration_id: string | null
          created_at: string | null
          document_url: string | null
          duration_seconds: number | null
          file_name: string
          file_size_bytes: number | null
          file_url: string
          height_px: number | null
          historical_significance: string | null
          id: string
          is_featured: boolean | null
          is_primary: boolean | null
          media_type: string | null
          mime_type: string | null
          model: string | null
          model_year_id: string | null
          motorcycle_id: string | null
          photo_context: string | null
          replaced_by: string | null
          style: string | null
          thumbnail_url: string | null
          updated_at: string | null
          version: number | null
          video_url: string | null
          width_px: number | null
          year: number | null
          year_captured: number | null
        }
        Insert: {
          alt_text?: string | null
          angle?: string | null
          brand?: string | null
          caption?: string | null
          color?: string | null
          color_code?: string | null
          configuration_id?: string | null
          created_at?: string | null
          document_url?: string | null
          duration_seconds?: number | null
          file_name: string
          file_size_bytes?: number | null
          file_url: string
          height_px?: number | null
          historical_significance?: string | null
          id?: string
          is_featured?: boolean | null
          is_primary?: boolean | null
          media_type?: string | null
          mime_type?: string | null
          model?: string | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          photo_context?: string | null
          replaced_by?: string | null
          style?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          version?: number | null
          video_url?: string | null
          width_px?: number | null
          year?: number | null
          year_captured?: number | null
        }
        Update: {
          alt_text?: string | null
          angle?: string | null
          brand?: string | null
          caption?: string | null
          color?: string | null
          color_code?: string | null
          configuration_id?: string | null
          created_at?: string | null
          document_url?: string | null
          duration_seconds?: number | null
          file_name?: string
          file_size_bytes?: number | null
          file_url?: string
          height_px?: number | null
          historical_significance?: string | null
          id?: string
          is_featured?: boolean | null
          is_primary?: boolean | null
          media_type?: string | null
          mime_type?: string | null
          model?: string | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          photo_context?: string | null
          replaced_by?: string | null
          style?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          version?: number | null
          video_url?: string | null
          width_px?: number | null
          year?: number | null
          year_captured?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_motorcycle_images_configuration"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "model_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_motorcycle_images_motorcycle"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_images_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "model_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_images_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_images_replaced_by_fkey"
            columns: ["replaced_by"]
            isOneToOne: false
            referencedRelation: "motorcycle_images"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycle_model_tags: {
        Row: {
          motorcycle_id: string
          tag_id: string
        }
        Insert: {
          motorcycle_id: string
          tag_id: string
        }
        Update: {
          motorcycle_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_model_tags_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_model_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycle_models: {
        Row: {
          base_description: string | null
          brand_id: string
          category: string | null
          cooling_system: string | null
          created_at: string
          default_image_url: string | null
          design_philosophy: string | null
          difficulty_level: number | null
          discontinuation_reason: string | null
          drive_type: string | null
          engine_size: number | null
          fuel_capacity_l: number | null
          ground_clearance_mm: number | null
          has_abs: boolean | null
          horsepower: number | null
          id: string
          ignore_autofill: boolean
          is_draft: boolean
          is_entry_level: boolean | null
          model_history: string | null
          name: string
          power_to_weight_ratio: number | null
          predecessor_model_id: string | null
          production_end_year: number | null
          production_notes: string | null
          production_start_year: number | null
          production_status: string
          recommended_license_level: string | null
          seat_height_mm: number | null
          slug: string
          status: string | null
          successor_model_id: string | null
          summary: string | null
          target_market: string | null
          top_speed_kph: number | null
          torque_nm: number | null
          transmission: string | null
          type: string
          updated_at: string
          use_cases: string[] | null
          weight_kg: number | null
          wet_weight_kg: number | null
          wheelbase_mm: number | null
        }
        Insert: {
          base_description?: string | null
          brand_id: string
          category?: string | null
          cooling_system?: string | null
          created_at?: string
          default_image_url?: string | null
          design_philosophy?: string | null
          difficulty_level?: number | null
          discontinuation_reason?: string | null
          drive_type?: string | null
          engine_size?: number | null
          fuel_capacity_l?: number | null
          ground_clearance_mm?: number | null
          has_abs?: boolean | null
          horsepower?: number | null
          id?: string
          ignore_autofill?: boolean
          is_draft?: boolean
          is_entry_level?: boolean | null
          model_history?: string | null
          name: string
          power_to_weight_ratio?: number | null
          predecessor_model_id?: string | null
          production_end_year?: number | null
          production_notes?: string | null
          production_start_year?: number | null
          production_status?: string
          recommended_license_level?: string | null
          seat_height_mm?: number | null
          slug: string
          status?: string | null
          successor_model_id?: string | null
          summary?: string | null
          target_market?: string | null
          top_speed_kph?: number | null
          torque_nm?: number | null
          transmission?: string | null
          type: string
          updated_at?: string
          use_cases?: string[] | null
          weight_kg?: number | null
          wet_weight_kg?: number | null
          wheelbase_mm?: number | null
        }
        Update: {
          base_description?: string | null
          brand_id?: string
          category?: string | null
          cooling_system?: string | null
          created_at?: string
          default_image_url?: string | null
          design_philosophy?: string | null
          difficulty_level?: number | null
          discontinuation_reason?: string | null
          drive_type?: string | null
          engine_size?: number | null
          fuel_capacity_l?: number | null
          ground_clearance_mm?: number | null
          has_abs?: boolean | null
          horsepower?: number | null
          id?: string
          ignore_autofill?: boolean
          is_draft?: boolean
          is_entry_level?: boolean | null
          model_history?: string | null
          name?: string
          power_to_weight_ratio?: number | null
          predecessor_model_id?: string | null
          production_end_year?: number | null
          production_notes?: string | null
          production_start_year?: number | null
          production_status?: string
          recommended_license_level?: string | null
          seat_height_mm?: number | null
          slug?: string
          status?: string | null
          successor_model_id?: string | null
          summary?: string | null
          target_market?: string | null
          top_speed_kph?: number | null
          torque_nm?: number | null
          transmission?: string | null
          type?: string
          updated_at?: string
          use_cases?: string[] | null
          weight_kg?: number | null
          wet_weight_kg?: number | null
          wheelbase_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_models_predecessor_model_id_fkey"
            columns: ["predecessor_model_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_models_successor_model_id_fkey"
            columns: ["successor_model_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycle_stats: {
        Row: {
          compression_ratio: string | null
          created_at: string
          cylinder_count: number | null
          displacement_cc: number | null
          dry_weight_kg: number | null
          engine_size_cc: number | null
          has_abs: boolean | null
          has_traction_control: boolean | null
          horsepower_hp: number | null
          id: string
          is_verified: boolean | null
          model_configuration_id: string
          notes: string | null
          override_engine_size: boolean | null
          override_horsepower: boolean | null
          override_torque: boolean | null
          override_weight: boolean | null
          power_to_weight_ratio: number | null
          source: string | null
          top_speed_kph: number | null
          top_speed_mph: number | null
          torque_nm: number | null
          torque_rpm: number | null
          updated_at: string
          weight_kg: number | null
          wet_weight_kg: number | null
        }
        Insert: {
          compression_ratio?: string | null
          created_at?: string
          cylinder_count?: number | null
          displacement_cc?: number | null
          dry_weight_kg?: number | null
          engine_size_cc?: number | null
          has_abs?: boolean | null
          has_traction_control?: boolean | null
          horsepower_hp?: number | null
          id?: string
          is_verified?: boolean | null
          model_configuration_id: string
          notes?: string | null
          override_engine_size?: boolean | null
          override_horsepower?: boolean | null
          override_torque?: boolean | null
          override_weight?: boolean | null
          power_to_weight_ratio?: number | null
          source?: string | null
          top_speed_kph?: number | null
          top_speed_mph?: number | null
          torque_nm?: number | null
          torque_rpm?: number | null
          updated_at?: string
          weight_kg?: number | null
          wet_weight_kg?: number | null
        }
        Update: {
          compression_ratio?: string | null
          created_at?: string
          cylinder_count?: number | null
          displacement_cc?: number | null
          dry_weight_kg?: number | null
          engine_size_cc?: number | null
          has_abs?: boolean | null
          has_traction_control?: boolean | null
          horsepower_hp?: number | null
          id?: string
          is_verified?: boolean | null
          model_configuration_id?: string
          notes?: string | null
          override_engine_size?: boolean | null
          override_horsepower?: boolean | null
          override_torque?: boolean | null
          override_weight?: boolean | null
          power_to_weight_ratio?: number | null
          source?: string | null
          top_speed_kph?: number | null
          top_speed_mph?: number | null
          torque_nm?: number | null
          torque_rpm?: number | null
          updated_at?: string
          weight_kg?: number | null
          wet_weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_stats_model_configuration_id_fkey"
            columns: ["model_configuration_id"]
            isOneToOne: true
            referencedRelation: "model_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycle_tags: {
        Row: {
          category: string
          color_hex: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      motorcycle_videos: {
        Row: {
          configuration_id: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          is_featured: boolean | null
          model_year_id: string | null
          motorcycle_id: string | null
          quality: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_type: string | null
          video_url: string
          view_count: number | null
          year_captured: number | null
        }
        Insert: {
          configuration_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_featured?: boolean | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          quality?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_type?: string | null
          video_url: string
          view_count?: number | null
          year_captured?: number | null
        }
        Update: {
          configuration_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_featured?: boolean | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          quality?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_type?: string | null
          video_url?: string
          view_count?: number | null
          year_captured?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_videos_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "model_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_videos_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      production_sweep_results: {
        Row: {
          completeness_basic: number | null
          completeness_components: number | null
          completeness_dimensions: number | null
          completeness_overall: number | null
          config_id: string | null
          created_at: string
          created_by: string | null
          id: string
          model_id: string
          model_year: number | null
          raw: Json | null
          updated_at: string
          vpic_matched_name: string | null
          vpic_status: string | null
          vpic_total: number | null
          vpic_url: string | null
        }
        Insert: {
          completeness_basic?: number | null
          completeness_components?: number | null
          completeness_dimensions?: number | null
          completeness_overall?: number | null
          config_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          model_id: string
          model_year?: number | null
          raw?: Json | null
          updated_at?: string
          vpic_matched_name?: string | null
          vpic_status?: string | null
          vpic_total?: number | null
          vpic_url?: string | null
        }
        Update: {
          completeness_basic?: number | null
          completeness_components?: number | null
          completeness_dimensions?: number | null
          completeness_overall?: number | null
          config_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          model_id?: string
          model_year?: number | null
          raw?: Json | null
          updated_at?: string
          vpic_matched_name?: string | null
          vpic_status?: string | null
          vpic_total?: number | null
          vpic_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_sweep_results_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email_verified: boolean | null
          email_verified_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_verified?: boolean | null
          email_verified_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email_verified?: boolean | null
          email_verified_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      repair_skills: {
        Row: {
          created_at: string
          difficulty: number | null
          id: string
          model_id: string | null
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
          model_id?: string | null
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
          model_id?: string | null
          motorcycle_id?: string | null
          safety_notes?: string | null
          steps?: Json | null
          title?: string
          tools?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_skills_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
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
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      state_rules: {
        Row: {
          created_at: string
          helmet_required: boolean
          link_to_dmv: string | null
          permit_age_min: number | null
          road_test_required: boolean
          special_rules: string | null
          state_code: string
          state_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          helmet_required?: boolean
          link_to_dmv?: string | null
          permit_age_min?: number | null
          road_test_required?: boolean
          special_rules?: string | null
          state_code: string
          state_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          helmet_required?: boolean
          link_to_dmv?: string | null
          permit_age_min?: number | null
          road_test_required?: boolean
          special_rules?: string | null
          state_code?: string
          state_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      suspensions: {
        Row: {
          adjustability: string | null
          brand: string | null
          created_at: string | null
          damping_system: string | null
          front_travel_mm: number | null
          front_type: string | null
          id: string
          is_draft: boolean
          notes: string | null
          rear_travel_mm: number | null
          rear_type: string | null
          updated_at: string | null
        }
        Insert: {
          adjustability?: string | null
          brand?: string | null
          created_at?: string | null
          damping_system?: string | null
          front_travel_mm?: number | null
          front_type?: string | null
          id?: string
          is_draft?: boolean
          notes?: string | null
          rear_travel_mm?: number | null
          rear_type?: string | null
          updated_at?: string | null
        }
        Update: {
          adjustability?: string | null
          brand?: string | null
          created_at?: string | null
          damping_system?: string | null
          front_travel_mm?: number | null
          front_type?: string | null
          id?: string
          is_draft?: boolean
          notes?: string | null
          rear_travel_mm?: number | null
          rear_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trim_color_assignments: {
        Row: {
          color_option_id: string
          configuration_id: string
          created_at: string
          id: string
          is_default: boolean | null
          updated_at: string
        }
        Insert: {
          color_option_id: string
          configuration_id: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
        }
        Update: {
          color_option_id?: string
          configuration_id?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trim_color_assignments_color_option_id_fkey"
            columns: ["color_option_id"]
            isOneToOne: false
            referencedRelation: "color_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trim_color_assignments_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "model_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_comparison_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          motorcycle_ids: string[]
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          motorcycle_ids?: string[]
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          motorcycle_ids?: string[]
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_glossary_terms: {
        Row: {
          id: string
          is_learned: boolean
          learned_at: string | null
          term_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          is_learned?: boolean
          learned_at?: string | null
          term_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          is_learned?: boolean
          learned_at?: string | null
          term_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_glossary_terms_term_slug_fkey"
            columns: ["term_slug"]
            isOneToOne: false
            referencedRelation: "glossary_terms"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_motorcycle_favorites: {
        Row: {
          created_at: string
          id: string
          motorcycle_id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          motorcycle_id: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          motorcycle_id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_motorcycle_favorites_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          measurement_unit: string | null
          notifications_enabled: boolean | null
          privacy_level: string | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          measurement_unit?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          measurement_unit?: string | null
          notifications_enabled?: boolean | null
          privacy_level?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string
          lesson_id: string
          quiz_score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          lesson_id: string
          quiz_score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          lesson_id?: string
          quiz_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          level: number
          skill_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          level?: number
          skill_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          level?: number
          skill_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      wheels: {
        Row: {
          created_at: string | null
          front_size: string | null
          front_tire_size: string | null
          id: string
          is_draft: boolean
          notes: string | null
          rear_size: string | null
          rear_tire_size: string | null
          rim_material: string | null
          tubeless: boolean | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          front_size?: string | null
          front_tire_size?: string | null
          id?: string
          is_draft?: boolean
          notes?: string | null
          rear_size?: string | null
          rear_tire_size?: string | null
          rim_material?: string | null
          tubeless?: boolean | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          front_size?: string | null
          front_tire_size?: string | null
          id?: string
          is_draft?: boolean
          notes?: string | null
          rear_size?: string | null
          rear_tire_size?: string | null
          rim_material?: string | null
          tubeless?: boolean | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_configuration_completeness: {
        Args: { config_id: string }
        Returns: Json
      }
      cleanup_expired_suggestions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_verification_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      complete_lesson: {
        Args: { lesson_id_param: string; quiz_score_param?: number }
        Returns: boolean
      }
      current_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      delete_motorcycle_model_cascade: {
        Args: { model_id_param: string }
        Returns: boolean
      }
      generate_course_slug: {
        Args: Record<PropertyKey, never> | { title_input: string }
        Returns: string
      }
      generate_lesson_slug: {
        Args: Record<PropertyKey, never> | { title_input: string }
        Returns: string
      }
      generate_slug: {
        Args: { "": string }
        Returns: string
      }
      generate_slug_fixed: {
        Args: { input_text: string }
        Returns: string
      }
      get_content_block_template: {
        Args: { block_type_param: string }
        Returns: Json
      }
      get_course_progress: {
        Args: { course_id_param: string; user_id_param?: string }
        Returns: {
          total_lessons: number
          completed_lessons: number
          progress_percentage: number
        }[]
      }
      get_effective_components: {
        Args: { config_id: string }
        Returns: {
          engine_id: string
          brake_system_id: string
          frame_id: string
          suspension_id: string
          wheel_id: string
          engine_inherited: boolean
          brake_system_inherited: boolean
          frame_inherited: boolean
          suspension_inherited: boolean
          wheel_inherited: boolean
        }[]
      }
      get_motorcycle_model_relations: {
        Args: Record<PropertyKey, never> | { model_id_param: string }
        Returns: undefined
      }
      get_tags_for_manual: {
        Args: { manual_id_param: string }
        Returns: {
          id: string
          name: string
          description: string
          color: string
        }[]
      }
      get_user_glossary_stats: {
        Args: { user_id_param?: string }
        Returns: {
          total_terms: number
          learned_terms: number
          learning_percentage: number
        }[]
      }
      get_user_learned_terms: {
        Args: { limit_param?: number; user_id_param?: string }
        Returns: {
          term_slug: string
          term: string
          learned_at: string
        }[]
      }
      get_user_top_skills: {
        Args: { limit_param?: number; user_id_param?: string }
        Returns: {
          skill_id: string
          skill_name: string
          skill_category: string
          skill_icon: string
          level: number
        }[]
      }
      get_year_components_with_inheritance: {
        Args: { year_id: string }
        Returns: {
          component_type: string
          component_id: string
          component_name: string
          is_inherited: boolean
          source: string
        }[]
      }
      increment_manual_downloads: {
        Args: { manual_id: string }
        Returns: undefined
      }
      increment_template_usage: {
        Args: { template_id_param: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_severity?: string
          p_details?: Json
        }
        Returns: undefined
      }
      log_security_violation: {
        Args: { violation_type: string; details?: Json }
        Returns: undefined
      }
      log_user_activity: {
        Args: {
          p_action: string
          p_resource_type?: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
      mark_term_as_learned: {
        Args: { term_slug_param: string }
        Returns: boolean
      }
      mark_term_as_unlearned: {
        Args: { term_slug_param: string }
        Returns: boolean
      }
      migrate_all_legacy_motorcycles: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      migrate_legacy_motorcycle: {
        Args: Record<PropertyKey, never> | { legacy_id: string }
        Returns: boolean
      }
      populate_model_component_defaults: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      validate_component_compatibility: {
        Args: {
          engine_id_param?: string
          brake_system_id_param?: string
          frame_id_param?: string
          suspension_id_param?: string
          wheel_id_param?: string
        }
        Returns: Json
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: Json
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
