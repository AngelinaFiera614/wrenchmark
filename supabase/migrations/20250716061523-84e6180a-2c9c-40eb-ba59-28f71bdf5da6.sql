-- Phase 1: Fix SQL injection vulnerabilities by setting search_path for all functions
-- This prevents malicious code from hijacking function execution

-- Fix migrate_legacy_motorcycle function
CREATE OR REPLACE FUNCTION public.migrate_legacy_motorcycle(legacy_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    legacy_motorcycle RECORD;
    model_id UUID;
    year_id UUID;
    config_id UUID;
    engine_id UUID;
    brake_id UUID;
BEGIN
    -- Get the legacy motorcycle data
    SELECT * INTO legacy_motorcycle 
    FROM motorcycles 
    WHERE id = legacy_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Create or find the motorcycle model
    INSERT INTO motorcycle_models (
        brand_id, name, type, base_description, 
        production_start_year, production_status, 
        default_image_url, slug
    ) VALUES (
        legacy_motorcycle.brand_id,
        legacy_motorcycle.model_name,
        COALESCE(legacy_motorcycle.category, 'Standard'),
        legacy_motorcycle.summary,
        legacy_motorcycle.year,
        COALESCE(legacy_motorcycle.status, 'active'),
        legacy_motorcycle.image_url,
        legacy_motorcycle.slug
    )
    ON CONFLICT (slug) DO UPDATE SET updated_at = now()
    RETURNING id INTO model_id;
    
    -- Create the model year
    INSERT INTO model_years (
        motorcycle_id, year, changes, image_url
    ) VALUES (
        model_id,
        legacy_motorcycle.year,
        'Legacy migration',
        legacy_motorcycle.image_url
    )
    ON CONFLICT (motorcycle_id, year) DO UPDATE SET updated_at = now()
    RETURNING id INTO year_id;
    
    -- Create basic engine if displacement exists
    IF legacy_motorcycle.displacement_cc IS NOT NULL THEN
        INSERT INTO engines (
            name, displacement_cc, power_hp, torque_nm
        ) VALUES (
            COALESCE(legacy_motorcycle.engine, legacy_motorcycle.displacement_cc::text || 'cc Engine'),
            legacy_motorcycle.displacement_cc,
            legacy_motorcycle.horsepower_hp,
            legacy_motorcycle.torque_nm
        )
        RETURNING id INTO engine_id;
    END IF;
    
    -- Create basic brake system
    INSERT INTO brake_systems (
        type, has_traction_control
    ) VALUES (
        CASE WHEN legacy_motorcycle.has_abs THEN 'ABS Brakes' ELSE 'Standard Brakes' END,
        false
    )
    RETURNING id INTO brake_id;
    
    -- Create the configuration
    INSERT INTO model_configurations (
        model_year_id, name, engine_id, brake_system_id,
        seat_height_mm, weight_kg, wheelbase_mm,
        fuel_capacity_l, ground_clearance_mm,
        image_url, is_default
    ) VALUES (
        year_id,
        'Standard',
        engine_id,
        brake_id,
        legacy_motorcycle.seat_height_mm,
        legacy_motorcycle.weight_kg,
        legacy_motorcycle.wheelbase_mm,
        legacy_motorcycle.fuel_capacity_l,
        legacy_motorcycle.ground_clearance_mm,
        legacy_motorcycle.image_url,
        true
    )
    RETURNING id INTO config_id;
    
    -- Update migration status
    UPDATE motorcycles 
    SET migration_status = 'migrated'
    WHERE id = legacy_id;
    
    RETURN TRUE;
END;
$function$;

-- Fix migrate_all_legacy_motorcycles function
CREATE OR REPLACE FUNCTION public.migrate_all_legacy_motorcycles()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    migrated_count INTEGER := 0;
    motorcycle_record RECORD;
BEGIN
    FOR motorcycle_record IN 
        SELECT id FROM motorcycles 
        WHERE migration_status != 'migrated' OR migration_status IS NULL
    LOOP
        IF migrate_legacy_motorcycle(motorcycle_record.id) THEN
            migrated_count := migrated_count + 1;
        END IF;
    END LOOP;
    
    RETURN migrated_count;
END;
$function$;

-- Fix log_user_activity function
CREATE OR REPLACE FUNCTION public.log_user_activity(p_action text, p_resource_type text DEFAULT NULL::text, p_resource_id text DEFAULT NULL::text, p_details jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO user_activity_log (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_details
    );
END;
$function$;

-- Fix cleanup_expired_verification_logs function
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_logs()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_verification_log 
    WHERE status = 'pending' AND expires_at < now();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$function$;

-- Fix validate_password_strength function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb := '{"valid": false, "errors": []}'::jsonb;
  errors text[] := '{}';
BEGIN
  -- Check minimum length (12 characters)
  IF length(password) < 12 THEN
    errors := array_append(errors, 'Password must be at least 12 characters long');
  END IF;
  
  -- Check for lowercase letter
  IF password !~ '[a-z]' THEN
    errors := array_append(errors, 'Password must contain at least one lowercase letter');
  END IF;
  
  -- Check for uppercase letter
  IF password !~ '[A-Z]' THEN
    errors := array_append(errors, 'Password must contain at least one uppercase letter');
  END IF;
  
  -- Check for digit
  IF password !~ '[0-9]' THEN
    errors := array_append(errors, 'Password must contain at least one number');
  END IF;
  
  -- Check for special character
  IF password !~ '[!@#$%^&*()_+\-=\[\]{};'':"\\|,.<>\/?]' THEN
    errors := array_append(errors, 'Password must contain at least one special character');
  END IF;
  
  -- Return result
  IF array_length(errors, 1) IS NULL THEN
    result := '{"valid": true, "errors": []}'::jsonb;
  ELSE
    result := jsonb_build_object('valid', false, 'errors', errors);
  END IF;
  
  RETURN result;
END;
$function$;

-- Fix log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(p_action text, p_resource_type text, p_resource_id text DEFAULT NULL::text, p_severity text DEFAULT 'medium'::text, p_details jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    severity,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_severity,
    p_details
  );
END;
$function$;

-- Fix increment_template_usage function
CREATE OR REPLACE FUNCTION public.increment_template_usage(template_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE lesson_templates
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE id = template_id_param;
END;
$function$;

-- Fix get_content_block_template function
CREATE OR REPLACE FUNCTION public.get_content_block_template(block_type_param text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  template_data JSONB;
BEGIN
  SELECT schema INTO template_data
  FROM content_block_types
  WHERE name = block_type_param;
  
  -- Return default template based on block type
  RETURN COALESCE(template_data, '{}'::jsonb);
END;
$function$;

-- Fix get_effective_components function
CREATE OR REPLACE FUNCTION public.get_effective_components(config_id uuid)
 RETURNS TABLE(engine_id uuid, brake_system_id uuid, frame_id uuid, suspension_id uuid, wheel_id uuid, engine_inherited boolean, brake_system_inherited boolean, frame_inherited boolean, suspension_inherited boolean, wheel_inherited boolean)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  config_record RECORD;
  model_id UUID;
BEGIN
  -- Get configuration details
  SELECT * INTO config_record 
  FROM model_configurations mc
  JOIN model_years my ON mc.model_year_id = my.id
  WHERE mc.id = config_id;
  
  model_id := config_record.motorcycle_id;
  
  RETURN QUERY
  SELECT 
    COALESCE(
      CASE WHEN config_record.engine_override THEN config_record.engine_id END,
      (SELECT component_id FROM model_component_assignments WHERE model_id = model_id AND component_type = 'engine')
    ) as engine_id,
    COALESCE(
      CASE WHEN config_record.brake_system_override THEN config_record.brake_system_id END,
      (SELECT component_id FROM model_component_assignments WHERE model_id = model_id AND component_type = 'brake_system')
    ) as brake_system_id,
    COALESCE(
      CASE WHEN config_record.frame_override THEN config_record.frame_id END,
      (SELECT component_id FROM model_component_assignments WHERE model_id = model_id AND component_type = 'frame')
    ) as frame_id,
    COALESCE(
      CASE WHEN config_record.suspension_override THEN config_record.suspension_id END,
      (SELECT component_id FROM model_component_assignments WHERE model_id = model_id AND component_type = 'suspension')
    ) as suspension_id,
    COALESCE(
      CASE WHEN config_record.wheel_override THEN config_record.wheel_id END,
      (SELECT component_id FROM model_component_assignments WHERE model_id = model_id AND component_type = 'wheel')
    ) as wheel_id,
    NOT COALESCE(config_record.engine_override, false) as engine_inherited,
    NOT COALESCE(config_record.brake_system_override, false) as brake_system_inherited,
    NOT COALESCE(config_record.frame_override, false) as frame_inherited,
    NOT COALESCE(config_record.suspension_override, false) as suspension_inherited,
    NOT COALESCE(config_record.wheel_override, false) as wheel_inherited;
END;
$function$;

-- Phase 2: Admin Role Protection - Prevent self-promotion and add audit logging

-- Create function to prevent users from promoting themselves to admin
CREATE OR REPLACE FUNCTION public.prevent_self_admin_promotion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- If updating is_admin from false to true
  IF TG_OP = 'UPDATE' AND OLD.is_admin = false AND NEW.is_admin = true THEN
    -- Check if user is trying to promote themselves
    IF NEW.user_id = auth.uid() THEN
      RAISE EXCEPTION 'Users cannot promote themselves to admin status';
    END IF;
    
    -- Verify the current user is already an admin
    IF NOT (SELECT is_admin FROM profiles WHERE user_id = auth.uid()) THEN
      RAISE EXCEPTION 'Only admins can promote users to admin status';
    END IF;
    
    -- Log the admin promotion for audit
    INSERT INTO admin_audit_log (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values
    ) VALUES (
      auth.uid(),
      'admin_promotion',
      'profiles',
      NEW.id,
      jsonb_build_object('is_admin', OLD.is_admin),
      jsonb_build_object('is_admin', NEW.is_admin)
    );
  END IF;
  
  -- If demoting admin (removing admin status)
  IF TG_OP = 'UPDATE' AND OLD.is_admin = true AND NEW.is_admin = false THEN
    -- Check if user is trying to demote themselves (prevent lockout)
    IF NEW.user_id = auth.uid() THEN
      RAISE EXCEPTION 'Users cannot remove their own admin status to prevent lockout';
    END IF;
    
    -- Verify the current user is an admin
    IF NOT (SELECT is_admin FROM profiles WHERE user_id = auth.uid()) THEN
      RAISE EXCEPTION 'Only admins can remove admin status from users';
    END IF;
    
    -- Log the admin demotion for audit
    INSERT INTO admin_audit_log (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values
    ) VALUES (
      auth.uid(),
      'admin_demotion',
      'profiles',
      NEW.id,
      jsonb_build_object('is_admin', OLD.is_admin),
      jsonb_build_object('is_admin', NEW.is_admin)
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add the trigger to profiles table
DROP TRIGGER IF EXISTS trigger_prevent_self_admin_promotion ON profiles;
CREATE TRIGGER trigger_prevent_self_admin_promotion
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_self_admin_promotion();

-- Phase 3: Clean up duplicate RLS policies - Remove overlapping policies on key tables

-- Clean up motorcycle_models policies (remove duplicates)
DROP POLICY IF EXISTS "models_admin_delete" ON motorcycle_models;
DROP POLICY IF EXISTS "models_admin_insert" ON motorcycle_models;
DROP POLICY IF EXISTS "models_admin_update" ON motorcycle_models;
DROP POLICY IF EXISTS "models_public_read" ON motorcycle_models;

-- Keep only the comprehensive admin and public policies
-- The existing "Admins can manage all motorcycle models" and "Public can read published motorcycle models" are sufficient

-- Clean up manuals policies (remove duplicates)
DROP POLICY IF EXISTS "Admins can create manuals" ON manuals;
DROP POLICY IF EXISTS "Admins can delete manuals" ON manuals;
DROP POLICY IF EXISTS "Admins can update manuals" ON manuals;
DROP POLICY IF EXISTS "Anyone can view manuals" ON manuals;
DROP POLICY IF EXISTS "Allow public read access to manuals" ON manuals;
DROP POLICY IF EXISTS "delete_manuals_policy" ON manuals;
DROP POLICY IF EXISTS "insert_manuals_policy" ON manuals;
DROP POLICY IF EXISTS "select_manuals_policy" ON manuals;
DROP POLICY IF EXISTS "update_manuals_policy" ON manuals;

-- Keep only the comprehensive policies
-- The existing "manuals_admin_all" and "manuals_public_read" are sufficient

-- Clean up color_options policies (remove duplicates)
DROP POLICY IF EXISTS "delete_color_options" ON color_options;
DROP POLICY IF EXISTS "insert_color_options" ON color_options;
DROP POLICY IF EXISTS "select_color_options" ON color_options;
DROP POLICY IF EXISTS "update_color_options" ON color_options;
DROP POLICY IF EXISTS "delete_color_options_policy" ON color_options;
DROP POLICY IF EXISTS "insert_color_options_policy" ON color_options;
DROP POLICY IF EXISTS "select_color_options_policy" ON color_options;
DROP POLICY IF EXISTS "update_color_options_policy" ON color_options;

-- Keep only the comprehensive policies
-- The existing "color_options_admin_all" and "color_options_public_read" are sufficient

-- Add security monitoring function
CREATE OR REPLACE FUNCTION public.log_security_violation(
  violation_type text,
  details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO security_audit_log (
    user_id,
    action,
    resource_type,
    severity,
    details
  ) VALUES (
    auth.uid(),
    violation_type,
    'security_violation',
    'high',
    details
  );
END;
$function$;