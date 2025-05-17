
-- Create storage bucket for glossary images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'glossary-images',
  'Glossary Images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Set RLS policies for the glossary-images bucket
CREATE POLICY "Anyone can view glossary images"
ON storage.objects FOR SELECT
USING (bucket_id = 'glossary-images');

CREATE POLICY "Admins can manage glossary images"
ON storage.objects
USING (
  bucket_id = 'glossary-images' AND
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
);
