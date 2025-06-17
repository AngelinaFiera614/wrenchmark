
-- Phase 1: Critical RLS Policy Implementation

-- 1. Create RLS policies for component tables (currently unprotected)
ALTER TABLE public.brake_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wheels ENABLE ROW LEVEL SECURITY;

-- Public read access for component tables
CREATE POLICY "Public can view brake systems" ON public.brake_systems
FOR SELECT USING (true);

CREATE POLICY "Public can view engines" ON public.engines
FOR SELECT USING (true);

CREATE POLICY "Public can view frames" ON public.frames
FOR SELECT USING (true);

CREATE POLICY "Public can view suspensions" ON public.suspensions
FOR SELECT USING (true);

CREATE POLICY "Public can view wheels" ON public.wheels
FOR SELECT USING (true);

-- Admin-only write access for component tables
CREATE POLICY "Admins can insert brake systems" ON public.brake_systems
FOR INSERT WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Admins can update brake systems" ON public.brake_systems
FOR UPDATE USING (public.current_user_is_admin());

CREATE POLICY "Admins can delete brake systems" ON public.brake_systems
FOR DELETE USING (public.current_user_is_admin());

CREATE POLICY "Admins can insert engines" ON public.engines
FOR INSERT WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Admins can update engines" ON public.engines
FOR UPDATE USING (public.current_user_is_admin());

CREATE POLICY "Admins can delete engines" ON public.engines
FOR DELETE USING (public.current_user_is_admin());

CREATE POLICY "Admins can insert frames" ON public.frames
FOR INSERT WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Admins can update frames" ON public.frames
FOR UPDATE USING (public.current_user_is_admin());

CREATE POLICY "Admins can delete frames" ON public.frames
FOR DELETE USING (public.current_user_is_admin());

CREATE POLICY "Admins can insert suspensions" ON public.suspensions
FOR INSERT WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Admins can update suspensions" ON public.suspensions
FOR UPDATE USING (public.current_user_is_admin());

CREATE POLICY "Admins can delete suspensions" ON public.suspensions
FOR DELETE USING (public.current_user_is_admin());

CREATE POLICY "Admins can insert wheels" ON public.wheels
FOR INSERT WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Admins can update wheels" ON public.wheels
FOR UPDATE USING (public.current_user_is_admin());

CREATE POLICY "Admins can delete wheels" ON public.wheels
FOR DELETE USING (public.current_user_is_admin());

-- 2. Secure model component assignments (admin-only)
ALTER TABLE public.model_component_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all component assignments" ON public.model_component_assignments
FOR SELECT USING (public.current_user_is_admin());

CREATE POLICY "Admins can insert component assignments" ON public.model_component_assignments
FOR INSERT WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Admins can update component assignments" ON public.model_component_assignments
FOR UPDATE USING (public.current_user_is_admin());

CREATE POLICY "Admins can delete component assignments" ON public.model_component_assignments
FOR DELETE USING (public.current_user_is_admin());

-- 3. Secure component usage stats
ALTER TABLE public.component_usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view component usage stats" ON public.component_usage_stats
FOR SELECT USING (true);

CREATE POLICY "Admins can modify component usage stats" ON public.component_usage_stats
FOR ALL USING (public.current_user_is_admin());

-- 4. Add enhanced password validation function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- 5. Add security audit logging for component operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  ip_address inet,
  user_agent text,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
FOR SELECT USING (public.current_user_is_admin());

CREATE POLICY "System can insert audit logs" ON public.security_audit_log
FOR INSERT WITH CHECK (true);

-- 6. Add function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_severity text DEFAULT 'medium',
  p_details jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
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
$$;
