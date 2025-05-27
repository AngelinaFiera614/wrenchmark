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
      accessories: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          manufacturer: string | null
          name: string
          price_usd: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          name: string
          price_usd?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          name?: string
          price_usd?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      accessory_compatibility: {
        Row: {
          accessory_id: string
          configuration_id: string
          created_at: string
          id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          accessory_id: string
          configuration_id: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          accessory_id?: string
          configuration_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessory_compatibility_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessory_compatibility_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "model_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      brake_systems: {
        Row: {
          brake_type_front: string | null
          brake_type_rear: string | null
          created_at: string
          has_traction_control: boolean | null
          id: string
          notes: string | null
          type: string
          updated_at: string
        }
        Insert: {
          brake_type_front?: string | null
          brake_type_rear?: string | null
          created_at?: string
          has_traction_control?: boolean | null
          id?: string
          notes?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          brake_type_front?: string | null
          brake_type_rear?: string | null
          created_at?: string
          has_traction_control?: boolean | null
          id?: string
          notes?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          brand_history: string | null
          brand_type: string | null
          categories: string[] | null
          country: string | null
          created_at: string
          description: string | null
          founded: number | null
          founded_city: string | null
          headquarters: string | null
          id: string
          is_electric: boolean | null
          known_for: string[] | null
          logo_history: Json | null
          logo_url: string | null
          manufacturing_facilities: string[] | null
          media_gallery: Json | null
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
          brand_type?: string | null
          categories?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded?: number | null
          founded_city?: string | null
          headquarters?: string | null
          id?: string
          is_electric?: boolean | null
          known_for?: string[] | null
          logo_history?: Json | null
          logo_url?: string | null
          manufacturing_facilities?: string[] | null
          media_gallery?: Json | null
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
          brand_type?: string | null
          categories?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded?: number | null
          founded_city?: string | null
          headquarters?: string | null
          id?: string
          is_electric?: boolean | null
          known_for?: string[] | null
          logo_history?: Json | null
          logo_url?: string | null
          manufacturing_facilities?: string[] | null
          media_gallery?: Json | null
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
          created_at: string
          hex_code: string | null
          id: string
          image_url: string | null
          is_limited: boolean | null
          model_year_id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_limited?: boolean | null
          model_year_id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_limited?: boolean | null
          model_year_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "color_options_model_year_id_fkey"
            columns: ["model_year_id"]
            isOneToOne: false
            referencedRelation: "model_years"
            referencedColumns: ["id"]
          },
        ]
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
      engines: {
        Row: {
          cooling: string | null
          created_at: string
          cylinder_count: number | null
          displacement_cc: number
          engine_type: string | null
          id: string
          name: string
          power_hp: number | null
          torque_nm: number | null
          updated_at: string
          valve_count: number | null
        }
        Insert: {
          cooling?: string | null
          created_at?: string
          cylinder_count?: number | null
          displacement_cc: number
          engine_type?: string | null
          id?: string
          name: string
          power_hp?: number | null
          torque_nm?: number | null
          updated_at?: string
          valve_count?: number | null
        }
        Update: {
          cooling?: string | null
          created_at?: string
          cylinder_count?: number | null
          displacement_cc?: number
          engine_type?: string | null
          id?: string
          name?: string
          power_hp?: number | null
          torque_nm?: number | null
          updated_at?: string
          valve_count?: number | null
        }
        Relationships: []
      }
      frames: {
        Row: {
          created_at: string
          id: string
          material: string | null
          notes: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          material?: string | null
          notes?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          material?: string | null
          notes?: string | null
          type?: string
          updated_at?: string
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
      image_tag_associations: {
        Row: {
          image_id: string
          tag_id: string
        }
        Insert: {
          image_id: string
          tag_id: string
        }
        Update: {
          image_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_tag_associations_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_tag_associations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "image_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      image_tags: {
        Row: {
          category: string
          color_hex: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
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
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          glossary_terms: string[] | null
          id: string
          order: number
          published: boolean
          slug: string
          state_code: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          glossary_terms?: string[] | null
          id?: string
          order: number
          published?: boolean
          slug: string
          state_code?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          glossary_terms?: string[] | null
          id?: string
          order?: number
          published?: boolean
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
          motorcycle_id?: string | null
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
      model_configurations: {
        Row: {
          brake_system_id: string | null
          color_id: string | null
          created_at: string
          engine_id: string | null
          frame_id: string | null
          fuel_capacity_l: number | null
          ground_clearance_mm: number | null
          id: string
          image_url: string | null
          is_default: boolean | null
          market_region: string | null
          model_year_id: string
          name: string | null
          optional_equipment: string[] | null
          price_premium_usd: number | null
          seat_height_mm: number | null
          special_features: string[] | null
          suspension_id: string | null
          trim_level: string | null
          updated_at: string
          weight_kg: number | null
          wheel_id: string | null
          wheelbase_mm: number | null
        }
        Insert: {
          brake_system_id?: string | null
          color_id?: string | null
          created_at?: string
          engine_id?: string | null
          frame_id?: string | null
          fuel_capacity_l?: number | null
          ground_clearance_mm?: number | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          market_region?: string | null
          model_year_id: string
          name?: string | null
          optional_equipment?: string[] | null
          price_premium_usd?: number | null
          seat_height_mm?: number | null
          special_features?: string[] | null
          suspension_id?: string | null
          trim_level?: string | null
          updated_at?: string
          weight_kg?: number | null
          wheel_id?: string | null
          wheelbase_mm?: number | null
        }
        Update: {
          brake_system_id?: string | null
          color_id?: string | null
          created_at?: string
          engine_id?: string | null
          frame_id?: string | null
          fuel_capacity_l?: number | null
          ground_clearance_mm?: number | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          market_region?: string | null
          model_year_id?: string
          name?: string | null
          optional_equipment?: string[] | null
          price_premium_usd?: number | null
          seat_height_mm?: number | null
          special_features?: string[] | null
          suspension_id?: string | null
          trim_level?: string | null
          updated_at?: string
          weight_kg?: number | null
          wheel_id?: string | null
          wheelbase_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "model_configurations_brake_system_id_fkey"
            columns: ["brake_system_id"]
            isOneToOne: false
            referencedRelation: "brake_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_configurations_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "color_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_configurations_engine_id_fkey"
            columns: ["engine_id"]
            isOneToOne: false
            referencedRelation: "engines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_configurations_frame_id_fkey"
            columns: ["frame_id"]
            isOneToOne: false
            referencedRelation: "frames"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_configurations_model_year_id_fkey"
            columns: ["model_year_id"]
            isOneToOne: false
            referencedRelation: "model_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_configurations_suspension_id_fkey"
            columns: ["suspension_id"]
            isOneToOne: false
            referencedRelation: "suspensions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_configurations_wheel_id_fkey"
            columns: ["wheel_id"]
            isOneToOne: false
            referencedRelation: "wheels"
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
          market_regions: string[] | null
          marketing_tagline: string | null
          motorcycle_id: string
          msrp_usd: number | null
          production_numbers: number | null
          special_editions: string[] | null
          technical_updates: string | null
          updated_at: string
          year: number
        }
        Insert: {
          changes?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          market_regions?: string[] | null
          marketing_tagline?: string | null
          motorcycle_id: string
          msrp_usd?: number | null
          production_numbers?: number | null
          special_editions?: string[] | null
          technical_updates?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          changes?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          market_regions?: string[] | null
          marketing_tagline?: string | null
          motorcycle_id?: string
          msrp_usd?: number | null
          production_numbers?: number | null
          special_editions?: string[] | null
          technical_updates?: string | null
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
      motorcycle_images: {
        Row: {
          alt_text: string | null
          angle: string | null
          brand: string | null
          caption: string | null
          color: string | null
          configuration_id: string | null
          created_at: string | null
          file_name: string
          file_size_bytes: number | null
          file_url: string
          height_px: number | null
          id: string
          is_featured: boolean | null
          is_primary: boolean | null
          mime_type: string | null
          model: string | null
          model_year_id: string | null
          motorcycle_id: string | null
          replaced_by: string | null
          style: string | null
          updated_at: string | null
          version: number | null
          width_px: number | null
          year: number | null
        }
        Insert: {
          alt_text?: string | null
          angle?: string | null
          brand?: string | null
          caption?: string | null
          color?: string | null
          configuration_id?: string | null
          created_at?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_url: string
          height_px?: number | null
          id?: string
          is_featured?: boolean | null
          is_primary?: boolean | null
          mime_type?: string | null
          model?: string | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          replaced_by?: string | null
          style?: string | null
          updated_at?: string | null
          version?: number | null
          width_px?: number | null
          year?: number | null
        }
        Update: {
          alt_text?: string | null
          angle?: string | null
          brand?: string | null
          caption?: string | null
          color?: string | null
          configuration_id?: string | null
          created_at?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_url?: string
          height_px?: number | null
          id?: string
          is_featured?: boolean | null
          is_primary?: boolean | null
          mime_type?: string | null
          model?: string | null
          model_year_id?: string | null
          motorcycle_id?: string | null
          replaced_by?: string | null
          style?: string | null
          updated_at?: string | null
          version?: number | null
          width_px?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_images_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "model_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motorcycle_images_model_year_id_fkey"
            columns: ["model_year_id"]
            isOneToOne: false
            referencedRelation: "model_years"
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
      motorcycle_models: {
        Row: {
          base_description: string | null
          brand_id: string
          created_at: string
          default_image_url: string | null
          design_philosophy: string | null
          discontinuation_reason: string | null
          id: string
          model_history: string | null
          name: string
          predecessor_model_id: string | null
          production_end_year: number | null
          production_notes: string | null
          production_start_year: number | null
          production_status: string
          slug: string
          successor_model_id: string | null
          target_market: string | null
          type: string
          updated_at: string
        }
        Insert: {
          base_description?: string | null
          brand_id: string
          created_at?: string
          default_image_url?: string | null
          design_philosophy?: string | null
          discontinuation_reason?: string | null
          id?: string
          model_history?: string | null
          name: string
          predecessor_model_id?: string | null
          production_end_year?: number | null
          production_notes?: string | null
          production_start_year?: number | null
          production_status?: string
          slug: string
          successor_model_id?: string | null
          target_market?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          base_description?: string | null
          brand_id?: string
          created_at?: string
          default_image_url?: string | null
          design_philosophy?: string | null
          discontinuation_reason?: string | null
          id?: string
          model_history?: string | null
          name?: string
          predecessor_model_id?: string | null
          production_end_year?: number | null
          production_notes?: string | null
          production_start_year?: number | null
          production_status?: string
          slug?: string
          successor_model_id?: string | null
          target_market?: string | null
          type?: string
          updated_at?: string
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
      motorcycles: {
        Row: {
          abs: string | null
          brake_type: string | null
          brand_id: string
          category: string | null
          compression_ratio: string | null
          created_at: string
          difficulty_level: number | null
          displacement_cc: number | null
          engine: string | null
          fuel_capacity_gal: number | null
          fuel_capacity_l: number | null
          fuel_system: string | null
          ground_clearance_in: number | null
          ground_clearance_mm: number | null
          has_abs: boolean | null
          horsepower_hp: number | null
          id: string
          image_url: string | null
          instrumentation: string | null
          is_placeholder: boolean
          migration_status: string | null
          model_history: string | null
          model_name: string
          navigation_system: string | null
          notes: string | null
          seat_height_in: number | null
          seat_height_mm: number | null
          seat_type: string | null
          slug: string
          status: string | null
          summary: string | null
          suspension_front: string | null
          suspension_rear: string | null
          tags: string[] | null
          top_speed_kph: number | null
          top_speed_mph: number | null
          torque_nm: number | null
          transmission: string | null
          tyre_front: string | null
          tyre_rear: string | null
          updated_at: string
          weight_kg: number | null
          weight_lbs: number | null
          wheelbase_in: number | null
          wheelbase_mm: number | null
          wheels: string | null
          year: number | null
          year_end: number | null
        }
        Insert: {
          abs?: string | null
          brake_type?: string | null
          brand_id: string
          category?: string | null
          compression_ratio?: string | null
          created_at?: string
          difficulty_level?: number | null
          displacement_cc?: number | null
          engine?: string | null
          fuel_capacity_gal?: number | null
          fuel_capacity_l?: number | null
          fuel_system?: string | null
          ground_clearance_in?: number | null
          ground_clearance_mm?: number | null
          has_abs?: boolean | null
          horsepower_hp?: number | null
          id?: string
          image_url?: string | null
          instrumentation?: string | null
          is_placeholder?: boolean
          migration_status?: string | null
          model_history?: string | null
          model_name: string
          navigation_system?: string | null
          notes?: string | null
          seat_height_in?: number | null
          seat_height_mm?: number | null
          seat_type?: string | null
          slug: string
          status?: string | null
          summary?: string | null
          suspension_front?: string | null
          suspension_rear?: string | null
          tags?: string[] | null
          top_speed_kph?: number | null
          top_speed_mph?: number | null
          torque_nm?: number | null
          transmission?: string | null
          tyre_front?: string | null
          tyre_rear?: string | null
          updated_at?: string
          weight_kg?: number | null
          weight_lbs?: number | null
          wheelbase_in?: number | null
          wheelbase_mm?: number | null
          wheels?: string | null
          year?: number | null
          year_end?: number | null
        }
        Update: {
          abs?: string | null
          brake_type?: string | null
          brand_id?: string
          category?: string | null
          compression_ratio?: string | null
          created_at?: string
          difficulty_level?: number | null
          displacement_cc?: number | null
          engine?: string | null
          fuel_capacity_gal?: number | null
          fuel_capacity_l?: number | null
          fuel_system?: string | null
          ground_clearance_in?: number | null
          ground_clearance_mm?: number | null
          has_abs?: boolean | null
          horsepower_hp?: number | null
          id?: string
          image_url?: string | null
          instrumentation?: string | null
          is_placeholder?: boolean
          migration_status?: string | null
          model_history?: string | null
          model_name?: string
          navigation_system?: string | null
          notes?: string | null
          seat_height_in?: number | null
          seat_height_mm?: number | null
          seat_type?: string | null
          slug?: string
          status?: string | null
          summary?: string | null
          suspension_front?: string | null
          suspension_rear?: string | null
          tags?: string[] | null
          top_speed_kph?: number | null
          top_speed_mph?: number | null
          torque_nm?: number | null
          transmission?: string | null
          tyre_front?: string | null
          tyre_rear?: string | null
          updated_at?: string
          weight_kg?: number | null
          weight_lbs?: number | null
          wheelbase_in?: number | null
          wheelbase_mm?: number | null
          wheels?: string | null
          year?: number | null
          year_end?: number | null
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
          created_at: string
          front_type: string | null
          id: string
          rear_type: string | null
          updated_at: string
        }
        Insert: {
          adjustability?: string | null
          brand?: string | null
          created_at?: string
          front_type?: string | null
          id?: string
          rear_type?: string | null
          updated_at?: string
        }
        Update: {
          adjustability?: string | null
          brand?: string | null
          created_at?: string
          front_type?: string | null
          id?: string
          rear_type?: string | null
          updated_at?: string
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
          created_at: string
          front_size: string | null
          id: string
          notes: string | null
          rear_size: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          front_size?: string | null
          id?: string
          notes?: string | null
          rear_size?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          front_size?: string | null
          id?: string
          notes?: string | null
          rear_size?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_lesson: {
        Args: { lesson_id_param: string; quiz_score_param?: number }
        Returns: boolean
      }
      current_user_is_admin: {
        Args: Record<PropertyKey, never>
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
      get_course_progress: {
        Args: { course_id_param: string; user_id_param?: string }
        Returns: {
          total_lessons: number
          completed_lessons: number
          progress_percentage: number
        }[]
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
      increment_manual_downloads: {
        Args: { manual_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
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
        Args: { legacy_id: string }
        Returns: boolean
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
