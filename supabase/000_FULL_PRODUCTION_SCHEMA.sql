-- ============================================================================
-- SAKAN (سَكَن) — COMPLETE ALL-IN-ONE PRODUCTION DATABASE SCHEMA
-- Version: 1.0.0 (Production Release)
-- Target: Supabase Cloud / PostgreSQL 15+
-- Instructions: Run this script in your Supabase SQL Editor in one click.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PART 1: EXTENSIONS & TABLES DEFINITION
-- ----------------------------------------------------------------------------

create extension if not exists "uuid-ossp";

-- 1. Profiles (Extends Supabase auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    phone text,
    phone_verified boolean default false,
    avatar_url text,
    role_preference text check (role_preference in ('seeker', 'provider', 'both')) default 'both',
    bio text,
    is_suspended boolean default false,
    suspension_reason text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_profiles_phone on public.profiles(phone);
create index if not exists idx_profiles_suspended on public.profiles(is_suspended);

-- 2. User Roles
create table if not exists public.user_roles (
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null check (role in ('super_admin', 'admin', 'listing_moderator', 'complaint_reviewer', 'analyst')),
    assigned_by uuid references auth.users(id),
    created_at timestamptz default now() not null,
    primary key (user_id, role)
);

create index if not exists idx_user_roles_role on public.user_roles(role);

-- Helper role functions
create or replace function public.has_role(check_user_id uuid, check_role text)
returns boolean as $$
begin
    return exists (
        select 1 from public.user_roles
        where user_id = check_user_id and role = check_role
    );
end;
$$ language plpgsql security definer;

create or replace function public.is_staff(check_user_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 from public.user_roles
        where user_id = check_user_id
          and role in ('super_admin', 'admin', 'listing_moderator', 'complaint_reviewer', 'analyst')
    );
end;
$$ language plpgsql security definer;

-- 3. Listings
create table if not exists public.listings (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text not null,
    governorate text not null,
    area text not null,
    address_private text,
    housing_type text not null check (housing_type in ('room', 'shared_apartment', 'full_apartment', 'studio')),
    eligible_occupants text not null check (eligible_occupants in ('students', 'workers', 'both')) default 'both',
    gender_preference text not null check (gender_preference in ('any', 'male', 'female')) default 'any',
    monthly_rent numeric not null check (monthly_rent > 0),
    deposit numeric not null default 0 check (deposit >= 0),
    utilities_cost numeric not null default 0 check (utilities_cost >= 0),
    furnished boolean not null default false,
    available_from date not null default current_date,
    amenities text[] not null default '{}',
    status text not null check (status in ('draft', 'pending', 'published', 'paused', 'rejected', 'removed', 'rented')) default 'published',
    rejection_reason text,
    room_occupancy_type text check (room_occupancy_type in ('shared', 'private')),
    beds_count integer check (beds_count is null or beds_count >= 1),
    rooms_count integer check (rooms_count is null or rooms_count >= 1),
    bathrooms_count integer check (bathrooms_count is null or bathrooms_count >= 1),
    max_occupancy integer check (max_occupancy is null or max_occupancy >= 1),
    show_phone_publicly boolean not null default false,
    views_count integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_gov_area on public.listings(governorate, area);
create index if not exists idx_listings_housing_type on public.listings(housing_type);
create index if not exists idx_listings_rent on public.listings(monthly_rent);
create index if not exists idx_listings_owner on public.listings(owner_id);
create index if not exists idx_listings_created on public.listings(created_at desc);

-- 4. Listing Photos
create table if not exists public.listing_photos (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete cascade,
    photo_url text not null,
    order_index integer not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_listing_photos_listing on public.listing_photos(listing_id, order_index);

-- 5. Wanted Requests ("دوّرلي على سكن")
create table if not exists public.wanted_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    housing_type text,
    governorate text not null,
    area text,
    budget_max numeric check (budget_max is null or budget_max > 0),
    beds_count integer check (beds_count is null or beds_count >= 1),
    occupant_preference text check (occupant_preference is null or occupant_preference in ('students', 'workers', 'both')),
    move_in_date date,
    furnished_preference boolean,
    additional_requirements text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_wanted_requests_user on public.wanted_requests(user_id);
create index if not exists idx_wanted_requests_active on public.wanted_requests(is_active, governorate);

-- 6. Conversations
create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid references public.listings(id) on delete set null,
    seeker_id uuid not null references auth.users(id) on delete cascade,
    provider_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint unique_listing_conversation unique (listing_id, seeker_id, provider_id)
);

create index if not exists idx_conversations_seeker on public.conversations(seeker_id);
create index if not exists idx_conversations_provider on public.conversations(provider_id);
create index if not exists idx_conversations_listing on public.conversations(listing_id);

-- 7. Conversation Members
create table if not exists public.conversation_members (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    last_read_at timestamptz default now(),
    is_blocked boolean not null default false,
    created_at timestamptz not null default now(),
    constraint unique_conversation_member unique (conversation_id, user_id)
);

create index if not exists idx_convo_members_lookup on public.conversation_members(conversation_id, user_id);

-- 8. Messages
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    sender_id uuid not null references auth.users(id) on delete cascade,
    content text not null,
    is_system boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at asc);

-- 9. Message Attachments
create table if not exists public.message_attachments (
    id uuid primary key default gen_random_uuid(),
    message_id uuid not null references public.messages(id) on delete cascade,
    file_url text not null,
    file_type text not null,
    file_size integer not null,
    created_at timestamptz not null default now()
);

-- 10. Complaints & Anti-Brokerage
create table if not exists public.complaints (
    id uuid primary key default gen_random_uuid(),
    reporter_id uuid not null references auth.users(id) on delete cascade,
    reported_user_id uuid references auth.users(id) on delete set null,
    listing_id uuid references public.listings(id) on delete set null,
    conversation_id uuid references public.conversations(id) on delete set null,
    category text not null check (category in ('fake_listing', 'brokerage_commission', 'fraud_payment', 'incorrect_price', 'harassment', 'inaccurate_details', 'other')),
    description text not null,
    status text not null check (status in ('submitted', 'under_review', 'awaiting_info', 'resolved', 'rejected', 'escalated')) default 'submitted',
    resolution_notes text,
    reviewer_id uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_complaints_status on public.complaints(status);
create index if not exists idx_complaints_reported on public.complaints(reported_user_id);

-- 11. Complaint Evidence
create table if not exists public.complaint_evidence (
    id uuid primary key default gen_random_uuid(),
    complaint_id uuid not null references public.complaints(id) on delete cascade,
    file_url text not null,
    file_type text not null,
    created_at timestamptz not null default now()
);

-- 12. Complaint Internal Notes (Staff Only)
create table if not exists public.complaint_internal_notes (
    id uuid primary key default gen_random_uuid(),
    complaint_id uuid not null references public.complaints(id) on delete cascade,
    staff_id uuid not null references auth.users(id) on delete cascade,
    note text not null,
    created_at timestamptz not null default now()
);

-- 13. Notifications
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null check (type in ('match', 'message', 'listing_status', 'complaint_status', 'security')),
    title text not null,
    body text not null,
    link text,
    related_listing_id uuid references public.listings(id) on delete cascade,
    related_request_id uuid references public.wanted_requests(id) on delete cascade,
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications(user_id, is_read, created_at desc);

-- 14. Notification Preferences
create table if not exists public.notification_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    email_enabled boolean not null default true,
    push_enabled boolean not null default true,
    match_alerts boolean not null default true,
    message_alerts boolean not null default true,
    status_alerts boolean not null default true,
    updated_at timestamptz not null default now()
);

-- 15. Admin Audit Logs (Immutable)
create table if not exists public.admin_audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid not null references auth.users(id) on delete cascade,
    action text not null,
    target_type text not null,
    target_id text not null,
    metadata jsonb not null default '{}'::jsonb,
    ip_address text,
    created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor on public.admin_audit_logs(actor_id);
create index if not exists idx_audit_logs_action on public.admin_audit_logs(action, created_at desc);

-- 16. User Blocks
create table if not exists public.user_blocks (
    blocker_id uuid not null references auth.users(id) on delete cascade,
    blocked_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (blocker_id, blocked_id)
);

-- 17. Saved Listings
create table if not exists public.saved_listings (
    user_id uuid not null references auth.users(id) on delete cascade,
    listing_id uuid not null references public.listings(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, listing_id)
);


-- ----------------------------------------------------------------------------
-- PART 2: ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.wanted_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_evidence enable row level security;
alter table public.complaint_internal_notes enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.user_blocks enable row level security;
alter table public.saved_listings enable row level security;

-- Profiles RLS
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (is_suspended = false or auth.uid() = id or public.is_staff(auth.uid()));

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- User Roles RLS
create policy "Staff can view roles"
on public.user_roles for select
using (auth.uid() = user_id or public.is_staff(auth.uid()));

create policy "Only super_admin can modify roles"
on public.user_roles for all
using (public.has_role(auth.uid(), 'super_admin'))
with check (public.has_role(auth.uid(), 'super_admin'));

-- Listings RLS
create policy "Published listings are viewable by everyone"
on public.listings for select
using (status = 'published' or auth.uid() = owner_id or public.is_staff(auth.uid()));

create policy "Authenticated users can create listings"
on public.listings for insert
with check (auth.uid() = owner_id);

create policy "Owners and staff can update listings"
on public.listings for update
using (auth.uid() = owner_id or public.is_staff(auth.uid()));

create policy "Owners and staff can delete listings"
on public.listings for delete
using (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Listing Photos RLS
create policy "Photos are viewable if listing is viewable"
on public.listing_photos for select
using (
    exists (
        select 1 from public.listings l
        where l.id = listing_photos.listing_id
          and (l.status = 'published' or l.owner_id = auth.uid() or public.is_staff(auth.uid()))
    )
);

create policy "Listing owners can manage listing photos"
on public.listing_photos for all
using (
    exists (
        select 1 from public.listings l
        where l.id = listing_photos.listing_id
          and (l.owner_id = auth.uid() or public.is_staff(auth.uid()))
    )
);

-- Wanted Requests RLS
create policy "Active wanted requests are viewable by everyone"
on public.wanted_requests for select
using (is_active = true or auth.uid() = user_id or public.is_staff(auth.uid()));

create policy "Authenticated users can insert wanted requests"
on public.wanted_requests for insert
with check (auth.uid() = user_id);

create policy "Users can update their own wanted requests"
on public.wanted_requests for update
using (auth.uid() = user_id or public.is_staff(auth.uid()));

create policy "Users can delete their own wanted requests"
on public.wanted_requests for delete
using (auth.uid() = user_id or public.is_staff(auth.uid()));

-- Conversations & Messages RLS
create policy "Participants and staff can view conversations"
on public.conversations for select
using (auth.uid() = seeker_id or auth.uid() = provider_id or public.is_staff(auth.uid()));

create policy "Authenticated users can create conversations"
on public.conversations for insert
with check (auth.uid() = seeker_id or auth.uid() = provider_id);

create policy "Participants can view messages"
on public.messages for select
using (
    exists (
        select 1 from public.conversations c
        where c.id = messages.conversation_id
          and (c.seeker_id = auth.uid() or c.provider_id = auth.uid() or public.is_staff(auth.uid()))
    )
);

create policy "Participants can insert messages"
on public.messages for insert
with check (
    auth.uid() = sender_id
    and exists (
        select 1 from public.conversations c
        where c.id = messages.conversation_id
          and (c.seeker_id = auth.uid() or c.provider_id = auth.uid())
    )
);

-- Complaints RLS
create policy "Reporters, reported parties, and staff can view complaints"
on public.complaints for select
using (auth.uid() = reporter_id or auth.uid() = reported_user_id or public.is_staff(auth.uid()));

create policy "Authenticated users can submit complaints"
on public.complaints for insert
with check (auth.uid() = reporter_id);

create policy "Only complaint reviewers and admins can update complaints"
on public.complaints for update
using (public.has_role(auth.uid(), 'complaint_reviewer') or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Complaint Evidence RLS
create policy "Evidence viewable by reporter and staff"
on public.complaint_evidence for select
using (
    exists (
        select 1 from public.complaints c
        where c.id = complaint_evidence.complaint_id
          and (c.reporter_id = auth.uid() or public.is_staff(auth.uid()))
    )
);

create policy "Reporters can insert complaint evidence"
on public.complaint_evidence for insert
with check (
    exists (
        select 1 from public.complaints c
        where c.id = complaint_evidence.complaint_id
          and c.reporter_id = auth.uid()
    )
);

-- Notifications RLS
create policy "Users can view their own notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "Users can update their own notifications"
on public.notifications for update
using (auth.uid() = user_id);

-- Admin Audit Logs RLS
create policy "Staff can view audit logs"
on public.admin_audit_logs for select
using (public.is_staff(auth.uid()));

create policy "Staff can insert audit logs"
on public.admin_audit_logs for insert
with check (auth.uid() = actor_id and public.is_staff(auth.uid()));


-- ----------------------------------------------------------------------------
-- PART 3: STORAGE BUCKETS & STORAGE POLICIES
-- ----------------------------------------------------------------------------

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

create policy "Anyone can view listing photos"
on storage.objects for select
using (bucket_id = 'listing_photos');

create policy "Authenticated users can upload listing photos"
on storage.objects for insert
with check (bucket_id = 'listing_photos' and auth.role() = 'authenticated');

create policy "Anyone can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- ============================================================================
-- END OF ALL-IN-ONE SAKAN SCHEMA SETUP
-- ============================================================================
