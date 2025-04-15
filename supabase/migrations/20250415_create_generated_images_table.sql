
-- Create a table to store generated images
CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  image_url TEXT NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  type VARCHAR(50) DEFAULT 'meta_ad',
  format VARCHAR(20),
  campaign_id UUID
);

-- Add RLS policies to secure the table
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own generated images
CREATE POLICY "Users can view their own generated images"
  ON public.generated_images 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own generated images
CREATE POLICY "Users can insert their own generated images"
  ON public.generated_images 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON public.generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_type ON public.generated_images(type);
