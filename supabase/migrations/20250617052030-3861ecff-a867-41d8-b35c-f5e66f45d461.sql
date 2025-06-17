
-- First, let's populate missing model component assignments using the existing function
SELECT public.populate_model_component_defaults();

-- Then let's check what was created
SELECT 
  mca.model_id,
  mm.name as model_name,
  mca.component_type,
  mca.component_id,
  mca.is_default,
  mca.assignment_type
FROM model_component_assignments mca
JOIN motorcycle_models mm ON mca.model_id = mm.id
ORDER BY mm.name, mca.component_type;

-- Let's also verify we have components in each component table
SELECT 'engines' as table_name, COUNT(*) as count FROM engines
UNION ALL
SELECT 'brake_systems' as table_name, COUNT(*) as count FROM brake_systems
UNION ALL
SELECT 'frames' as table_name, COUNT(*) as count FROM frames
UNION ALL
SELECT 'suspensions' as table_name, COUNT(*) as count FROM suspensions
UNION ALL
SELECT 'wheels' as table_name, COUNT(*) as count FROM wheels;

-- Check configurations that currently have NULL component references
SELECT 
  mc.id,
  mc.name,
  my.year,
  mm.name as model_name,
  CASE WHEN mc.engine_id IS NULL THEN 'Missing Engine' ELSE 'Has Engine' END as engine_status,
  CASE WHEN mc.brake_system_id IS NULL THEN 'Missing Brakes' ELSE 'Has Brakes' END as brake_status,
  CASE WHEN mc.frame_id IS NULL THEN 'Missing Frame' ELSE 'Has Frame' END as frame_status,
  CASE WHEN mc.suspension_id IS NULL THEN 'Missing Suspension' ELSE 'Has Suspension' END as suspension_status,
  CASE WHEN mc.wheel_id IS NULL THEN 'Missing Wheels' ELSE 'Has Wheels' END as wheel_status
FROM model_configurations mc
JOIN model_years my ON mc.model_year_id = my.id
JOIN motorcycle_models mm ON my.motorcycle_id = mm.id
ORDER BY mm.name, my.year, mc.name;
