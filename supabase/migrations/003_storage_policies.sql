-- SAKAN (سَكَن) Housing Marketplace
-- Migration 003: Storage Buckets and Storage Security Policies

-- Insert storage buckets if not exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
    ('listing_photos', 'listing_photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
    ('message_attachments', 'message_attachments', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
    ('complaint_evidence', 'complaint_evidence', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
    ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- 1. LISTING PHOTOS STORAGE POLICIES
create policy "Anyone can view listing photos"
on storage.objects for select
using (bucket_id = 'listing_photos');

create policy "Authenticated users can upload listing photos"
on storage.objects for insert
with check (
    bucket_id = 'listing_photos' 
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own uploaded photos"
on storage.objects for delete
using (
    bucket_id = 'listing_photos' 
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. AVATARS STORAGE POLICIES
create policy "Anyone can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own avatar"
on storage.objects for update
using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. MESSAGE ATTACHMENTS STORAGE POLICIES
create policy "Authenticated conversation participants can access attachments"
on storage.objects for select
using (
    bucket_id = 'message_attachments'
    and auth.role() = 'authenticated'
);

create policy "Authenticated users can upload attachments to their folder"
on storage.objects for insert
with check (
    bucket_id = 'message_attachments'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. COMPLAINT EVIDENCE STORAGE POLICIES
create policy "Evidence accessible by uploader and staff"
on storage.objects for select
using (
    bucket_id = 'complaint_evidence'
    and (
        (storage.foldername(name))[1] = auth.uid()::text
        or public.is_staff(auth.uid())
    )
);

create policy "Reporters can upload complaint evidence"
on storage.objects for insert
with check (
    bucket_id = 'complaint_evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
);
