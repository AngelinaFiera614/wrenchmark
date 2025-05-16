
-- Create the increment function if it doesn't exist
CREATE OR REPLACE FUNCTION public.increment(row_id uuid, inc_amount integer)
RETURNS integer
LANGUAGE sql
AS $$
  UPDATE manuals
  SET downloads = downloads + inc_amount
  WHERE id = row_id
  RETURNING downloads;
$$;
