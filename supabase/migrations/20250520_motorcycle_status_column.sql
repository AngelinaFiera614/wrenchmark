
-- Add status column to motorcycles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'motorcycles' 
                  AND column_name = 'status') THEN
        ALTER TABLE public.motorcycles ADD COLUMN status TEXT;
    END IF;
END
$$;

-- Add year_end column to motorcycles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'motorcycles' 
                  AND column_name = 'year_end') THEN
        ALTER TABLE public.motorcycles ADD COLUMN year_end INTEGER;
    END IF;
END
$$;

-- Rename year to year_start for clarity if not already done
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'motorcycles' 
              AND column_name = 'year') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'motorcycles' 
                      AND column_name = 'year_start') THEN
        
        -- Add year_start column
        ALTER TABLE public.motorcycles ADD COLUMN year_start INTEGER;
        
        -- Copy data from year to year_start
        UPDATE public.motorcycles SET year_start = year;
    END IF;
END
$$;
