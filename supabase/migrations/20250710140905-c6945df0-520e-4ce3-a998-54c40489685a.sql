-- Fix the unique constraint on model_component_assignments
-- The constraint should be on (model_id, component_type) not (model_id, component_type, component_id)
-- because a model should have only one component of each type

-- Drop the existing incorrect constraint
ALTER TABLE public.model_component_assignments 
DROP CONSTRAINT IF EXISTS unique_model_component;

-- Add the correct constraint
ALTER TABLE public.model_component_assignments 
ADD CONSTRAINT unique_model_component_type 
UNIQUE (model_id, component_type);