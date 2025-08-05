-- Fix the final remaining function search path security issues

-- Update the last 3 functions with mutable search paths
ALTER FUNCTION public.cleanup_expired_suggestions() SET search_path TO 'public';
ALTER FUNCTION public.delete_motorcycle_model_cascade(uuid) SET search_path TO 'public';
ALTER FUNCTION public.get_motorcycle_model_relations(uuid) SET search_path TO 'public';