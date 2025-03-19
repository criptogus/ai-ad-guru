
-- Create avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, '{image/png,image/jpeg,image/gif}')
ON CONFLICT (id) DO NOTHING;

-- Set up policies for the avatars bucket to allow authenticated users to upload their own avatars
INSERT INTO storage.policies (id, name, bucket_id, storage, definition)
VALUES 
  ('avatars_public_read', 'Allow public read access', 'avatars', 'SELECT', 'true'),
  ('avatars_authenticated_insert', 'Allow authenticated insert access', 'avatars', 'INSERT', 'auth.role() = ''authenticated'''),
  ('avatars_user_update', 'Allow users to update their own avatars', 'avatars', 'UPDATE', 'auth.uid()::text = (storage.foldername(name))[1]')
ON CONFLICT (id) DO NOTHING;
