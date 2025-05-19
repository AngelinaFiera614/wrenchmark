
-- Function to generate custom manual tags by file name patterns
CREATE OR REPLACE FUNCTION public.suggest_manual_tags_by_filename(filename text)
RETURNS text[] AS $$
DECLARE
    result text[];
BEGIN
    result := '{}';
    
    -- Check for common patterns and add appropriate tags
    IF filename ILIKE '%repair%' OR filename ILIKE '%service%' OR filename ILIKE '%maintenance%' THEN
        result := array_append(result, 'repair');
    END IF;
    
    IF filename ILIKE '%electrical%' OR filename ILIKE '%wiring%' OR filename ILIKE '%diagram%' THEN
        result := array_append(result, 'electrical');
    END IF;
    
    IF filename ILIKE '%parts%' OR filename ILIKE '%catalog%' OR filename ILIKE '%component%' THEN
        result := array_append(result, 'parts');
    END IF;
    
    IF filename ILIKE '%owner%' OR filename ILIKE '%manual%' OR filename ILIKE '%handbook%' THEN
        result := array_append(result, 'owner');
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
