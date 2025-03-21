
-- Create the storage bucket for banner images
INSERT INTO storage.buckets (id, name, public)
VALUES ('banner-images', 'Banner Images', true);

-- Create policy to allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own banner images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banner-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to select their own images
CREATE POLICY "Users can select their own banner images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'banner-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to update their own images
CREATE POLICY "Users can update their own banner images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banner-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to delete their own images
CREATE POLICY "Users can delete their own banner images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banner-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to banner images
CREATE POLICY "Public access to banner images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'banner-images'
);
