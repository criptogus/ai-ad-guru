
-- Create ai-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-images', 'ai-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set bucket RLS policies
CREATE POLICY "Public Access to ai-images" ON storage.objects
FOR SELECT
USING (bucket_id = 'ai-images');

CREATE POLICY "Authenticated users can upload to ai-images" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ai-images');

CREATE POLICY "Owner can update objects in ai-images" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'ai-images' AND auth.uid() = owner);

CREATE POLICY "Owner can delete objects in ai-images" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'ai-images' AND auth.uid() = owner);
