-- Check if there's a constraint or trigger preventing power_to_weight_ratio updates
-- Remove any problematic constraints and allow normal updates to power_to_weight_ratio

-- First, let's see what constraints exist on the motorcycle_models table
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'motorcycle_models'::regclass;

-- Drop any check constraints on power_to_weight_ratio that might be causing issues
DO $$ 
BEGIN
    -- Check if there are any constraints specifically on power_to_weight_ratio
    IF EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'motorcycle_models'
        AND pg_get_constraintdef(c.oid) LIKE '%power_to_weight_ratio%'
        AND c.contype = 'c'
    ) THEN
        -- Find and drop the constraint
        EXECUTE (
            SELECT 'ALTER TABLE motorcycle_models DROP CONSTRAINT ' || conname || ';'
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'motorcycle_models'
            AND pg_get_constraintdef(c.oid) LIKE '%power_to_weight_ratio%'
            AND c.contype = 'c'
            LIMIT 1
        );
    END IF;
END $$;

-- Ensure the power_to_weight_ratio column can be updated normally
-- Remove any DEFAULT-only constraints if they exist
ALTER TABLE motorcycle_models 
ALTER COLUMN power_to_weight_ratio DROP DEFAULT;