-- Fix security issues and optimize database for Enhanced Trim Form

-- 1. Fix function search path security issues
-- Update all functions with mutable search paths to set them properly

ALTER FUNCTION public.update_updated_at_column() SET search_path TO 'public';
ALTER FUNCTION public.get_motorcycle_model_relations() SET search_path TO 'public';
ALTER FUNCTION public.delete_motorcycle_model_cascade() SET search_path TO 'public';
ALTER FUNCTION public.update_workflow_timestamp() SET search_path TO 'public';
ALTER FUNCTION public.generate_lesson_slug() SET search_path TO 'public';
ALTER FUNCTION public.generate_course_slug() SET search_path TO 'public';
ALTER FUNCTION public.is_admin(uuid) SET search_path TO 'public';
ALTER FUNCTION public.migrate_legacy_motorcycle() SET search_path TO 'public';

-- 2. Clean up overlapping RLS policies
-- Remove duplicate/conflicting policies and keep the most comprehensive ones

-- Brands table - remove duplicate policies, keep the comprehensive ones
DROP POLICY IF EXISTS "brands_admin_delete" ON brands;
DROP POLICY IF EXISTS "brands_admin_insert" ON brands;
DROP POLICY IF EXISTS "brands_admin_update" ON brands;
-- Keep: brands_public_read (most permissive for public access)

-- Motorcycle models - clean up duplicate policies
DROP POLICY IF EXISTS "models_admin_read_all" ON motorcycle_models;
DROP POLICY IF EXISTS "models_public_read_published" ON motorcycle_models;
-- Keep: "Admins can manage all motorcycle models" and "Public can read published motorcycle models"

-- Model years - clean up duplicate policies  
DROP POLICY IF EXISTS "model_years_admin_all" ON model_years;
DROP POLICY IF EXISTS "model_years_public_read" ON model_years;
-- Keep: "Admins can manage all model years" and "Public can read published model years"

-- Model configurations - clean up duplicate policies
DROP POLICY IF EXISTS "configurations_admin_all" ON model_configurations;
DROP POLICY IF EXISTS "configurations_public_read" ON model_configurations;
-- Keep: "Admins can manage all model configurations" and "Public can read published model configurations"

-- Engines - remove duplicate/overlapping policies
DROP POLICY IF EXISTS "Admins can delete engines" ON engines;
DROP POLICY IF EXISTS "Admins can insert engines" ON engines;
DROP POLICY IF EXISTS "Admins can update engines" ON engines;
DROP POLICY IF EXISTS "Public can view engines" ON engines;
-- Keep: "Admins can manage all engines" and "Public can read published engines"

-- Brake systems - clean up duplicate policies
DROP POLICY IF EXISTS "Admins can delete brake systems" ON brake_systems;
DROP POLICY IF EXISTS "Admins can insert brake systems" ON brake_systems;
DROP POLICY IF EXISTS "Admins can update brake systems" ON brake_systems;
DROP POLICY IF EXISTS "Public can view brake systems" ON brake_systems;
-- Keep: "Admins can manage all brake_systems" and "Public can read published brake_systems"

-- Frames - clean up duplicate policies
DROP POLICY IF EXISTS "Admins can delete frames" ON frames;
DROP POLICY IF EXISTS "Admins can insert frames" ON frames;
DROP POLICY IF EXISTS "Admins can update frames" ON frames;
DROP POLICY IF EXISTS "Public can view frames" ON frames;
-- Keep: "Admins can manage all frames" and "Public can read published frames"

-- 3. Add missing indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_brand_id ON motorcycle_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_model_years_motorcycle_id ON model_years(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_model_configurations_model_year_id ON model_configurations(model_year_id);
CREATE INDEX IF NOT EXISTS idx_color_options_model_year_id ON color_options(model_year_id);
CREATE INDEX IF NOT EXISTS idx_model_component_assignments_model_id ON model_component_assignments(model_id);
CREATE INDEX IF NOT EXISTS idx_model_component_assignments_component_type ON model_component_assignments(component_type);

-- 4. Create optimized database functions for Enhanced Trim Form

-- Function to get year-specific components with inheritance
CREATE OR REPLACE FUNCTION public.get_year_components_with_inheritance(year_id uuid)
RETURNS TABLE(
  component_type text,
  component_id uuid,
  component_name text,
  is_inherited boolean,
  source text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  model_id_var uuid;
BEGIN
  -- Get model ID from year
  SELECT motorcycle_id INTO model_id_var 
  FROM model_years 
  WHERE id = year_id;
  
  RETURN QUERY
  SELECT 
    mca.component_type,
    mca.component_id,
    CASE 
      WHEN mca.component_type = 'engine' THEN e.name
      WHEN mca.component_type = 'brake_system' THEN bs.type
      WHEN mca.component_type = 'frame' THEN f.type
      WHEN mca.component_type = 'suspension' THEN s.type
      WHEN mca.component_type = 'wheel' THEN w.type
    END as component_name,
    true as is_inherited,
    'model_default' as source
  FROM model_component_assignments mca
  LEFT JOIN engines e ON mca.component_type = 'engine' AND mca.component_id = e.id
  LEFT JOIN brake_systems bs ON mca.component_type = 'brake_system' AND mca.component_id = bs.id
  LEFT JOIN frames f ON mca.component_type = 'frame' AND mca.component_id = f.id
  LEFT JOIN suspensions s ON mca.component_type = 'suspension' AND mca.component_id = s.id
  LEFT JOIN wheels w ON mca.component_type = 'wheel' AND mca.component_id = w.id
  WHERE mca.model_id = model_id_var;
END;
$$;

-- Function to get configuration completeness score
CREATE OR REPLACE FUNCTION public.calculate_configuration_completeness(config_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  config_record RECORD;
  basic_score numeric := 0;
  component_score numeric := 0;
  dimension_score numeric := 0;
  overall_score numeric := 0;
  total_fields integer;
  completed_fields integer;
BEGIN
  SELECT * INTO config_record FROM model_configurations WHERE id = config_id;
  
  IF NOT FOUND THEN
    RETURN '{"overall": 0, "basicInfo": 0, "components": 0, "dimensions": 0}'::jsonb;
  END IF;
  
  -- Calculate basic info completeness (name, description, msrp)
  total_fields := 3;
  completed_fields := 0;
  
  IF config_record.name IS NOT NULL AND config_record.name != '' THEN
    completed_fields := completed_fields + 1;
  END IF;
  
  IF config_record.description IS NOT NULL AND config_record.description != '' THEN
    completed_fields := completed_fields + 1;
  END IF;
  
  IF config_record.msrp_usd IS NOT NULL THEN
    completed_fields := completed_fields + 1;
  END IF;
  
  basic_score := (completed_fields::numeric / total_fields) * 100;
  
  -- Calculate component completeness (5 main component types)
  total_fields := 5;
  completed_fields := 0;
  
  IF config_record.engine_id IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.brake_system_id IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.frame_id IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.suspension_id IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.wheel_id IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  
  component_score := (completed_fields::numeric / total_fields) * 100;
  
  -- Calculate dimension completeness (5 main dimensions)
  total_fields := 5;
  completed_fields := 0;
  
  IF config_record.seat_height_mm IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.weight_kg IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.wheelbase_mm IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.fuel_capacity_l IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF config_record.ground_clearance_mm IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  
  dimension_score := (completed_fields::numeric / total_fields) * 100;
  
  -- Calculate overall score
  overall_score := (basic_score + component_score + dimension_score) / 3;
  
  RETURN jsonb_build_object(
    'overall', round(overall_score),
    'basicInfo', round(basic_score),
    'components', round(component_score),
    'dimensions', round(dimension_score)
  );
END;
$$;

-- Function to validate component compatibility
CREATE OR REPLACE FUNCTION public.validate_component_compatibility(
  engine_id_param uuid DEFAULT NULL,
  brake_system_id_param uuid DEFAULT NULL,
  frame_id_param uuid DEFAULT NULL,
  suspension_id_param uuid DEFAULT NULL,
  wheel_id_param uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  issues jsonb := '[]'::jsonb;
  engine_record RECORD;
  frame_record RECORD;
BEGIN
  -- Basic compatibility checks
  IF engine_id_param IS NOT NULL AND frame_id_param IS NOT NULL THEN
    SELECT * INTO engine_record FROM engines WHERE id = engine_id_param;
    SELECT * INTO frame_record FROM frames WHERE id = frame_id_param;
    
    -- Example: Check if engine displacement is compatible with frame type
    IF engine_record.displacement_cc > 1000 AND frame_record.type LIKE '%lightweight%' THEN
      issues := issues || jsonb_build_object(
        'type', 'warning',
        'message', 'Large displacement engine may not be optimal for lightweight frame',
        'components', array['engine', 'frame']
      );
    END IF;
  END IF;
  
  RETURN jsonb_build_object('issues', issues);
END;
$$;

-- 5. Add audit logging for configuration changes
CREATE OR REPLACE FUNCTION public.log_configuration_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log significant changes to configurations
    IF (OLD.engine_id IS DISTINCT FROM NEW.engine_id) OR
       (OLD.brake_system_id IS DISTINCT FROM NEW.brake_system_id) OR
       (OLD.frame_id IS DISTINCT FROM NEW.frame_id) OR
       (OLD.suspension_id IS DISTINCT FROM NEW.suspension_id) OR
       (OLD.wheel_id IS DISTINCT FROM NEW.wheel_id) THEN
      
      INSERT INTO admin_audit_log (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
      ) VALUES (
        auth.uid(),
        'configuration_component_change',
        'model_configurations',
        NEW.id::text,
        jsonb_build_object(
          'engine_id', OLD.engine_id,
          'brake_system_id', OLD.brake_system_id,
          'frame_id', OLD.frame_id,
          'suspension_id', OLD.suspension_id,
          'wheel_id', OLD.wheel_id
        ),
        jsonb_build_object(
          'engine_id', NEW.engine_id,
          'brake_system_id', NEW.brake_system_id,
          'frame_id', NEW.frame_id,
          'suspension_id', NEW.suspension_id,
          'wheel_id', NEW.wheel_id
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for configuration change logging
DROP TRIGGER IF EXISTS log_configuration_changes ON model_configurations;
CREATE TRIGGER log_configuration_changes
  AFTER UPDATE ON model_configurations
  FOR EACH ROW
  EXECUTE FUNCTION log_configuration_change();

-- 6. Add validation constraints for data integrity
-- Ensure model years are within reasonable range
ALTER TABLE model_years 
ADD CONSTRAINT check_reasonable_year 
CHECK (year >= 1885 AND year <= 2050);

-- Ensure positive values for dimensions
ALTER TABLE model_configurations
ADD CONSTRAINT check_positive_seat_height
CHECK (seat_height_mm IS NULL OR seat_height_mm > 0);

ALTER TABLE model_configurations
ADD CONSTRAINT check_positive_weight
CHECK (weight_kg IS NULL OR weight_kg > 0);

ALTER TABLE model_configurations
ADD CONSTRAINT check_positive_wheelbase
CHECK (wheelbase_mm IS NULL OR wheelbase_mm > 0);

ALTER TABLE model_configurations
ADD CONSTRAINT check_positive_fuel_capacity
CHECK (fuel_capacity_l IS NULL OR fuel_capacity_l > 0);

-- Ensure reasonable MSRP values
ALTER TABLE model_configurations
ADD CONSTRAINT check_reasonable_msrp
CHECK (msrp_usd IS NULL OR (msrp_usd >= 0 AND msrp_usd <= 1000000));

-- Grant necessary permissions for the new functions
GRANT EXECUTE ON FUNCTION public.get_year_components_with_inheritance(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_configuration_completeness(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_component_compatibility(uuid, uuid, uuid, uuid, uuid) TO authenticated;