
-- Phase 1: Database Structure & Performance Improvements

-- 1. Add is_draft column to tables that don't have it yet
ALTER TABLE engines ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;
ALTER TABLE brake_systems ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;
ALTER TABLE frames ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;
ALTER TABLE suspensions ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;
ALTER TABLE wheels ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;
ALTER TABLE model_years ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;
ALTER TABLE model_configurations ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false;

-- 2. Create motorcycle_stats table for performance data
CREATE TABLE IF NOT EXISTS motorcycle_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_configuration_id uuid NOT NULL REFERENCES model_configurations(id) ON DELETE CASCADE,
  
  -- Performance stats
  horsepower_hp numeric,
  torque_nm numeric,
  torque_rpm integer,
  top_speed_kph numeric,
  top_speed_mph numeric,
  power_to_weight_ratio numeric,
  
  -- Weight stats
  dry_weight_kg numeric,
  wet_weight_kg numeric,
  weight_kg numeric, -- for backward compatibility
  
  -- Engine stats (derived from components but can be overridden)
  engine_size_cc integer,
  displacement_cc integer,
  cylinder_count integer,
  compression_ratio text,
  
  -- Performance flags
  has_abs boolean DEFAULT false,
  has_traction_control boolean DEFAULT false,
  
  -- Override flags (when true, use these values instead of component-derived)
  override_horsepower boolean DEFAULT false,
  override_torque boolean DEFAULT false,
  override_weight boolean DEFAULT false,
  override_engine_size boolean DEFAULT false,
  
  -- Metadata
  source text DEFAULT 'component', -- 'component', 'manual', 'estimated'
  is_verified boolean DEFAULT false,
  notes text,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(model_configuration_id)
);

-- 3. Add critical performance indexes
-- Motorcycle models indexes (most frequently queried table)
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_brand_id ON motorcycle_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_type ON motorcycle_models(type);
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_is_draft ON motorcycle_models(is_draft);
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_production_status ON motorcycle_models(production_status);
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_production_start_year ON motorcycle_models(production_start_year);
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_slug ON motorcycle_models(slug);
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_name ON motorcycle_models(name);

-- Model years indexes
CREATE INDEX IF NOT EXISTS idx_model_years_motorcycle_id ON model_years(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_model_years_year ON model_years(year);
CREATE INDEX IF NOT EXISTS idx_model_years_is_draft ON model_years(is_draft);
CREATE INDEX IF NOT EXISTS idx_model_years_is_available ON model_years(is_available);

-- Model configurations indexes
CREATE INDEX IF NOT EXISTS idx_model_configurations_model_year_id ON model_configurations(model_year_id);
CREATE INDEX IF NOT EXISTS idx_model_configurations_is_draft ON model_configurations(is_draft);
CREATE INDEX IF NOT EXISTS idx_model_configurations_is_default ON model_configurations(is_default);
CREATE INDEX IF NOT EXISTS idx_model_configurations_engine_id ON model_configurations(engine_id);
CREATE INDEX IF NOT EXISTS idx_model_configurations_brake_system_id ON model_configurations(brake_system_id);

-- Component tables indexes
CREATE INDEX IF NOT EXISTS idx_engines_displacement_cc ON engines(displacement_cc);
CREATE INDEX IF NOT EXISTS idx_engines_is_draft ON engines(is_draft);
CREATE INDEX IF NOT EXISTS idx_engines_engine_type ON engines(engine_type);

CREATE INDEX IF NOT EXISTS idx_brake_systems_is_draft ON brake_systems(is_draft);
CREATE INDEX IF NOT EXISTS idx_brake_systems_has_abs ON brake_systems(has_abs);

CREATE INDEX IF NOT EXISTS idx_frames_is_draft ON frames(is_draft);
CREATE INDEX IF NOT EXISTS idx_frames_type ON frames(type);

CREATE INDEX IF NOT EXISTS idx_suspensions_is_draft ON suspensions(is_draft);
CREATE INDEX IF NOT EXISTS idx_wheels_is_draft ON wheels(is_draft);

-- Brands indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_country ON brands(country);
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);

-- Motorcycle stats indexes
CREATE INDEX IF NOT EXISTS idx_motorcycle_stats_model_configuration_id ON motorcycle_stats(model_configuration_id);
CREATE INDEX IF NOT EXISTS idx_motorcycle_stats_horsepower_hp ON motorcycle_stats(horsepower_hp);
CREATE INDEX IF NOT EXISTS idx_motorcycle_stats_engine_size_cc ON motorcycle_stats(engine_size_cc);
CREATE INDEX IF NOT EXISTS idx_motorcycle_stats_weight_kg ON motorcycle_stats(weight_kg);

-- Media and document indexes for faster loading
CREATE INDEX IF NOT EXISTS idx_motorcycle_images_motorcycle_id ON motorcycle_images(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_motorcycle_images_is_primary ON motorcycle_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_motorcycle_images_is_featured ON motorcycle_images(is_featured);

CREATE INDEX IF NOT EXISTS idx_motorcycle_videos_motorcycle_id ON motorcycle_videos(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_motorcycle_videos_is_featured ON motorcycle_videos(is_featured);

-- Component assignments indexes
CREATE INDEX IF NOT EXISTS idx_model_component_assignments_model_id ON model_component_assignments(model_id);
CREATE INDEX IF NOT EXISTS idx_model_component_assignments_component_type ON model_component_assignments(component_type);
CREATE INDEX IF NOT EXISTS idx_model_component_assignments_component_id ON model_component_assignments(component_id);
CREATE INDEX IF NOT EXISTS idx_model_component_assignments_is_default ON model_component_assignments(is_default);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_brand_type ON motorcycle_models(brand_id, type);
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_draft_status ON motorcycle_models(is_draft, production_status);
CREATE INDEX IF NOT EXISTS idx_model_years_motorcycle_year ON model_years(motorcycle_id, year);
CREATE INDEX IF NOT EXISTS idx_model_configurations_year_default ON model_configurations(model_year_id, is_default);

-- 4. Add updated_at triggers for new tables
CREATE TRIGGER update_motorcycle_stats_updated_at
    BEFORE UPDATE ON motorcycle_stats
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- 5. Add comments for documentation
COMMENT ON TABLE motorcycle_stats IS 'Performance and specification data for motorcycle configurations. Can be derived from components or manually overridden.';
COMMENT ON COLUMN motorcycle_stats.source IS 'Source of the data: component (derived), manual (user input), estimated (calculated)';
COMMENT ON COLUMN motorcycle_stats.override_horsepower IS 'When true, use horsepower_hp instead of engine component value';
