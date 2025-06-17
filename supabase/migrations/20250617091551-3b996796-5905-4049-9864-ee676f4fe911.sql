
-- Create storage bucket for media library
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-library', 'media-library', true);

-- Set up access policies for the media library bucket
CREATE POLICY "Public can view media library files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-library');

CREATE POLICY "Authenticated users can upload to media library"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media-library' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update media library files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media-library' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete media library files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media-library' 
    AND auth.role() = 'authenticated'
  );

-- Create services for lesson templates and content blocks
CREATE OR REPLACE FUNCTION public.increment_template_usage(template_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE lesson_templates
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE id = template_id_param;
END;
$$;

-- Add content block template function
CREATE OR REPLACE FUNCTION public.get_content_block_template(block_type_param TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  template_data JSONB;
BEGIN
  SELECT schema INTO template_data
  FROM content_block_types
  WHERE name = block_type_param;
  
  -- Return default template based on block type
  RETURN COALESCE(template_data, '{}'::jsonb);
END;
$$;
