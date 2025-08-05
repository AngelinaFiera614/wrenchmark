-- Fix remaining function search path security issues

-- Update all remaining functions with mutable search paths
ALTER FUNCTION public.trigger_set_timestamp() SET search_path TO 'public';
ALTER FUNCTION public.populate_model_component_defaults() SET search_path TO 'public';
ALTER FUNCTION public.update_component_usage_stats() SET search_path TO 'public';
ALTER FUNCTION public.prevent_self_admin_promotion() SET search_path TO 'public';
ALTER FUNCTION public.generate_slug_fixed(text) SET search_path TO 'public';
ALTER FUNCTION public.generate_slug(text) SET search_path TO 'public';
ALTER FUNCTION public.validate_motorcycle_draft() SET search_path TO 'public';