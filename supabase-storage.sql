
-- This SQL will be run separately after this code implementation to create a storage bucket
insert into storage.buckets
  (id, name, public)
values
  ('profiles', 'profiles', true);

-- Set up access policies for the bucket
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'profiles' );

create policy "Users can upload their own avatar."
  on storage.objects for insert
  with check ( bucket_id = 'profiles' AND (storage.foldername(name))[1] = 'avatars' AND auth.uid()::text = substring(name, 9, 36) );

create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'profiles' AND auth.uid()::text = substring(name, 9, 36) );

create policy "Users can delete their own avatar."
  on storage.objects for delete
  using ( bucket_id = 'profiles' AND auth.uid()::text = substring(name, 9, 36) );
