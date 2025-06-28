
-- Add missing columns to the engines table to align with the form fields
ALTER TABLE public.engines 
ADD COLUMN IF NOT EXISTS power_rpm integer,
ADD COLUMN IF NOT EXISTS torque_rpm integer,
ADD COLUMN IF NOT EXISTS valve_count integer,
ADD COLUMN IF NOT EXISTS valves_per_cylinder integer;
