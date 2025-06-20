
-- Phase 2: Database Relationship & RLS Optimization

-- 1. Clean up duplicate foreign key constraints
-- First, let's identify and remove the duplicate constraint
DO $$
BEGIN
    -- Check if the duplicate constraint exists and drop it
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_motorcycle_models_brand' 
        AND table_name = 'motorcycle_models'
    ) THEN
        ALTER TABLE motorcycle_models DROP CONSTRAINT fk_motorcycle_models_brand;
        RAISE NOTICE 'Dropped duplicate foreign key constraint fk_motorcycle_models_brand';
    END IF;
    
    -- Verify the standard constraint still exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'motorcycle_models_brand_id_fkey' 
        AND table_name = 'motorcycle_models'
    ) THEN
        -- Recreate the standard constraint if missing
        ALTER TABLE motorcycle_models 
        ADD CONSTRAINT motorcycle_models_brand_id_fkey 
        FOREIGN KEY (brand_id) REFERENCES brands(id);
        RAISE NOTICE 'Recreated standard foreign key constraint';
    END IF;
END $$;

-- 2. Add RLS policies for motorcycle_stats table
ALTER TABLE motorcycle_stats ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all motorcycle stats
CREATE POLICY "Admins can manage all motorcycle stats"
ON motorcycle_stats
FOR ALL
USING (current_user_is_admin())
WITH CHECK (current_user_is_admin());

-- Allow public to read stats for published motorcycles only
CREATE POLICY "Public can read published motorcycle stats"
ON motorcycle_stats
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM model_configurations mc
        JOIN model_years my ON mc.model_year_id = my.id
        JOIN motorcycle_models mm ON my.motorcycle_id = mm.id
        WHERE mc.id = motorcycle_stats.model_configuration_id
        AND mm.is_draft = false
        AND mc.is_draft = false
        AND my.is_draft = false
    )
);

-- 3. Optimize existing RLS policies for better performance
-- Add RLS to component tables if not already enabled
ALTER TABLE engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE brake_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wheels ENABLE ROW LEVEL SECURITY;

-- Component tables: Admins can manage all, public can read published only
CREATE POLICY "Admins can manage all engines" ON engines
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published engines" ON engines
FOR SELECT USING (is_draft = false OR current_user_is_admin());

CREATE POLICY "Admins can manage all brake_systems" ON brake_systems
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published brake_systems" ON brake_systems
FOR SELECT USING (is_draft = false OR current_user_is_admin());

CREATE POLICY "Admins can manage all frames" ON frames
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published frames" ON frames
FOR SELECT USING (is_draft = false OR current_user_is_admin());

CREATE POLICY "Admins can manage all suspensions" ON suspensions
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published suspensions" ON suspensions
FOR SELECT USING (is_draft = false OR current_user_is_admin());

CREATE POLICY "Admins can manage all wheels" ON wheels
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published wheels" ON wheels
FOR SELECT USING (is_draft = false OR current_user_is_admin());

-- 4. Ensure motorcycle_models and related tables have proper RLS
-- (These might already exist, but let's ensure they're optimal)
ALTER TABLE motorcycle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_configurations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them optimally
DROP POLICY IF EXISTS "Admins can manage all motorcycle models" ON motorcycle_models;
DROP POLICY IF EXISTS "Public can read published motorcycle models" ON motorcycle_models;

-- Recreate with optimized logic
CREATE POLICY "Admins can manage all motorcycle models" ON motorcycle_models
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published motorcycle models" ON motorcycle_models
FOR SELECT USING (is_draft = false OR current_user_is_admin());

-- Model years policies
DROP POLICY IF EXISTS "Admins can manage all model years" ON model_years;
DROP POLICY IF EXISTS "Public can read published model years" ON model_years;

CREATE POLICY "Admins can manage all model years" ON model_years
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published model years" ON model_years
FOR SELECT USING (
    is_draft = false OR current_user_is_admin()
);

-- Model configurations policies
DROP POLICY IF EXISTS "Admins can manage all model configurations" ON model_configurations;
DROP POLICY IF EXISTS "Public can read published model configurations" ON model_configurations;

CREATE POLICY "Admins can manage all model configurations" ON model_configurations
FOR ALL USING (current_user_is_admin()) WITH CHECK (current_user_is_admin());

CREATE POLICY "Public can read published model configurations" ON model_configurations
FOR SELECT USING (
    is_draft = false OR current_user_is_admin()
);

-- 5. Add indexes for RLS performance optimization
CREATE INDEX IF NOT EXISTS idx_motorcycle_models_is_draft_admin ON motorcycle_models(is_draft) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_model_years_is_draft_admin ON model_years(is_draft) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_model_configurations_is_draft_admin ON model_configurations(is_draft) WHERE is_draft = false;

-- Component table indexes for RLS
CREATE INDEX IF NOT EXISTS idx_engines_is_draft_published ON engines(is_draft) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_brake_systems_is_draft_published ON brake_systems(is_draft) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_frames_is_draft_published ON frames(is_draft) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_suspensions_is_draft_published ON suspensions(is_draft) WHERE is_draft = false;
CREATE INDEX IF NOT EXISTS idx_wheels_is_draft_published ON wheels(is_draft) WHERE is_draft = false;

-- 6. Add helpful comments
COMMENT ON POLICY "Public can read published motorcycle stats" ON motorcycle_stats IS 'Allows public access to motorcycle stats only for published motorcycles (non-draft)';
COMMENT ON POLICY "Admins can manage all motorcycle stats" ON motorcycle_stats IS 'Full admin access to all motorcycle stats including drafts';
