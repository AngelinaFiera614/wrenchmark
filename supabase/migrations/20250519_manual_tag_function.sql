
-- Function to retrieve tags for a manual
CREATE OR REPLACE FUNCTION public.get_tags_for_manual(manual_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  color TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT mt.id, mt.name, mt.description, mt.color
  FROM manual_tags mt
  JOIN manual_tag_associations mta ON mt.id = mta.tag_id
  WHERE mta.manual_id = manual_id_param
  ORDER BY mt.name;
END;
$$ LANGUAGE plpgsql;
