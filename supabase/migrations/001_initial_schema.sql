-- SAKAN (سَكَن) Housing Marketplace
-- Migration 001: Initial Database Schema
-- Compatible with PostgreSQL 15+ and Supabase

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
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

-- Index on phone and suspended status
create index if not exists idx_profiles_phone on public.profiles(phone);
create index if not exists idx_profiles_suspended on public.profiles(is_suspended);

-- 2. USER ROLES (Explicit role-based access control)
create table if not exists public.user_roles (
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null check (role in ('super_admin', 'admin', 'listing_moderator', 'complaint_reviewer', 'analyst')),
    assigned_by uuid references auth.users(id),
    created_at timestamptz default now() not null,
    primary key (user_id, role)
);

create index if not exists idx_user_roles_role on public.user_roles(role);

-- Helper function: check if user has admin/moderator roles
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

-- 3. LISTINGS
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

-- Indexes for listings queries
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_gov_area on public.listings(governorate, area);
create index if not exists idx_listings_housing_type on public.listings(housing_type);
create index if not exists idx_listings_rent on public.listings(monthly_rent);
create index if not exists idx_listings_owner on public.listings(owner_id);
create index if not exists idx_listings_created on public.listings(created_at desc);

-- 4. LISTING PHOTOS
create table if not exists public.listing_photos (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings(id) on delete cascade,
    photo_url text not null,
    order_index integer not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_listing_photos_listing on public.listing_photos(listing_id, order_index);

-- 5. WANTED REQUESTS ("دوّرلي على سكن")
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

-- 6. CONVERSATIONS
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

-- 7. CONVERSATION MEMBERS
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

-- 8. MESSAGES
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    sender_id uuid not null references auth.users(id) on delete cascade,
    content text not null,
    is_system boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at asc);

-- 9. MESSAGE ATTACHMENTS
create table if not exists public.message_attachments (
    id uuid primary key default gen_random_uuid(),
    message_id uuid not null references public.messages(id) on delete cascade,
    file_url text not null,
    file_type text not null,
    file_size integer not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_message_attachments_message on public.message_attachments(message_id);

-- 10. COMPLAINTS & ANTI-COMMISSION
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
create index if not exists idx_complaints_reporter on public.complaints(reporter_id);
create index if not exists idx_complaints_reported on public.complaints(reported_user_id);
create index if not exists idx_complaints_listing on public.complaints(listing_id);

-- 11. COMPLAINT EVIDENCE
create table if not exists public.complaint_evidence (
    id uuid primary key default gen_random_uuid(),
    complaint_id uuid not null references public.complaints(id) on delete cascade,
    file_url text not null,
    file_type text not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_complaint_evidence_complaint on public.complaint_evidence(complaint_id);

-- 12. COMPLAINT INTERNAL NOTES (Staff Only)
create table if not exists public.complaint_internal_notes (
    id uuid primary key default gen_random_uuid(),
    complaint_id uuid not null references public.complaints(id) on delete cascade,
    staff_id uuid not null references auth.users(id) on delete cascade,
    note text not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_complaint_notes_complaint on public.complaint_internal_notes(complaint_id);

-- 13. NOTIFICATIONS
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

-- 14. NOTIFICATION PREFERENCES
create table if not exists public.notification_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    email_enabled boolean not null default true,
    push_enabled boolean not null default true,
    match_alerts boolean not null default true,
    message_alerts boolean not null default true,
    status_alerts boolean not null default true,
    updated_at timestamptz not null default now()
);

-- 15. ADMIN AUDIT LOGS (Immutable security log)
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

-- 16. USER BLOCKS
create table if not exists public.user_blocks (
    blocker_id uuid not null references auth.users(id) on delete cascade,
    blocked_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (blocker_id, blocked_id)
);

-- 17. SAVED LISTINGS
create table if not exists public.saved_listings (
    user_id uuid not null references auth.users(id) on delete cascade,
    listing_id uuid not null references public.listings(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, listing_id)
);

-- 18. AUTOMATIC MATCHING TRIGGER FOR WANTED REQUESTS
create or replace function public.match_new_listing_to_wanted_requests()
returns trigger as $$
declare
    match_record record;
begin
    -- Only trigger when listing transitions to 'published'
    if (TG_OP = 'INSERT' and new.status = 'published') or
       (TG_OP = 'UPDATE' and old.status <> 'published' and new.status = 'published') then
        
        for match_record in
            select wr.id as request_id, wr.user_id
            from public.wanted_requests wr
            where wr.is_active = true
              and wr.user_id <> new.owner_id
              and wr.governorate = new.governorate
              and (wr.housing_type is null or wr.housing_type = new.housing_type)
              and (wr.budget_max is null or new.monthly_rent <= wr.budget_max)
              and (wr.beds_count is null or new.beds_count is null or new.beds_count >= wr.beds_count)
              and (wr.furnished_preference is null or new.furnished = wr.furnished_preference)
              -- Avoid duplicate notifications for same request and listing
              and not exists (
                  select 1 from public.notifications n
                  where n.user_id = wr.user_id
                    and n.related_listing_id = new.id
                    and n.related_request_id = wr.id
              )
        loop
            -- Insert notification for matched seeker
            insert into public.notifications (
                user_id,
                type,
                title,
                body,
                link,
                related_listing_id,
                related_request_id
            ) values (
                match_record.user_id,
                'match',
                'سكن جديد يطابق طلبك!',
                'تم نشر سكن جديد في ' || new.governorate || ' بمبلغ ' || new.monthly_rent || ' ج.م يناسب مواصفات طلبك.',
                '/listings/' || new.id,
                new.id,
                match_record.request_id
            );
        end loop;
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_match_wanted_requests on public.listings;
create trigger trg_match_wanted_requests
after insert or update on public.listings
for each row execute function public.match_new_listing_to_wanted_requests();
