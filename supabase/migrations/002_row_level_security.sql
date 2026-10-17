-- SAKAN (سَكَن) Housing Marketplace
-- Migration 002: Row Level Security (RLS) Policies
-- Strict access control for anonymous visitors, authenticated users, and staff

-- Enable RLS on all tables
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

-- 1. PROFILES POLICIES
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (is_suspended = false or auth.uid() = id or public.is_staff(auth.uid()));

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update their own profile non-privileged fields"
on public.profiles for update
using (auth.uid() = id or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- Trigger to prevent normal users from modifying their own suspension
create or replace function public.protect_profile_suspension()
returns trigger as $$
begin
    if (new.is_suspended is distinct from old.is_suspended or new.suspension_reason is distinct from old.suspension_reason) then
        if not (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin')) then
            raise exception 'Unauthorized to alter suspension fields';
        end if;
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_protect_profile_suspension on public.profiles;
create trigger trg_protect_profile_suspension
before update on public.profiles
for each row execute function public.protect_profile_suspension();

-- 2. USER ROLES POLICIES
create policy "Staff can view roles"
on public.user_roles for select
using (auth.uid() = user_id or public.is_staff(auth.uid()));

create policy "Only super_admin can modify roles"
on public.user_roles for all
using (public.has_role(auth.uid(), 'super_admin'))
with check (public.has_role(auth.uid(), 'super_admin'));

-- 3. LISTINGS POLICIES
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

-- 4. LISTING PHOTOS POLICIES
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

-- 5. WANTED REQUESTS POLICIES
create policy "Users can view and manage their own wanted requests"
on public.wanted_requests for all
using (auth.uid() = user_id or public.is_staff(auth.uid()))
with check (auth.uid() = user_id);

-- 6. CONVERSATIONS POLICIES
create policy "Conversation participants can view their conversations"
on public.conversations for select
using (auth.uid() = seeker_id or auth.uid() = provider_id);

create policy "Seekers can initiate conversations"
on public.conversations for insert
with check (auth.uid() = seeker_id);

-- 7. CONVERSATION MEMBERS POLICIES
create policy "Members can view membership"
on public.conversation_members for select
using (auth.uid() = user_id or exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = conversation_members.conversation_id and cm.user_id = auth.uid()
));

create policy "Members can update their own state"
on public.conversation_members for update
using (auth.uid() = user_id);

create policy "Users can insert membership when invited or joining"
on public.conversation_members for insert
with check (auth.uid() = user_id);

-- 8. MESSAGES POLICIES
create policy "Participants can view conversation messages"
on public.messages for select
using (
    exists (
        select 1 from public.conversation_members cm
        where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
    ) or exists (
        select 1 from public.conversations c
        where c.id = messages.conversation_id and (c.seeker_id = auth.uid() or c.provider_id = auth.uid())
    )
);

create policy "Participants can send messages"
on public.messages for insert
with check (
    auth.uid() = sender_id and (
        exists (
            select 1 from public.conversation_members cm
            where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid() and cm.is_blocked = false
        ) or exists (
            select 1 from public.conversations c
            where c.id = messages.conversation_id and (c.seeker_id = auth.uid() or c.provider_id = auth.uid())
        )
    )
);

-- 9. MESSAGE ATTACHMENTS POLICIES
create policy "Message participants can view attachments"
on public.message_attachments for select
using (
    exists (
        select 1 from public.messages m
        join public.conversations c on c.id = m.conversation_id
        where m.id = message_attachments.message_id
          and (c.seeker_id = auth.uid() or c.provider_id = auth.uid())
    )
);

create policy "Message senders can insert attachments"
on public.message_attachments for insert
with check (
    exists (
        select 1 from public.messages m
        where m.id = message_attachments.message_id and m.sender_id = auth.uid()
    )
);

-- 10. COMPLAINTS POLICIES
create policy "Reporters can view their own complaints; staff can view all"
on public.complaints for select
using (auth.uid() = reporter_id or public.is_staff(auth.uid()));

create policy "Authenticated users can submit complaints"
on public.complaints for insert
with check (auth.uid() = reporter_id);

create policy "Only complaint reviewers and admins can update complaints"
on public.complaints for update
using (public.has_role(auth.uid(), 'complaint_reviewer') or public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'super_admin'));

-- 11. COMPLAINT EVIDENCE POLICIES
create policy "Reporters and reviewers can view complaint evidence"
on public.complaint_evidence for select
using (
    exists (
        select 1 from public.complaints c
        where c.id = complaint_evidence.complaint_id
          and (c.reporter_id = auth.uid() or public.is_staff(auth.uid()))
    )
);

create policy "Reporters can insert evidence"
on public.complaint_evidence for insert
with check (
    exists (
        select 1 from public.complaints c
        where c.id = complaint_evidence.complaint_id and c.reporter_id = auth.uid()
    )
);

-- 12. COMPLAINT INTERNAL NOTES POLICIES (Staff Only)
create policy "Only staff can view internal notes"
on public.complaint_internal_notes for select
using (public.is_staff(auth.uid()));

create policy "Only staff can insert internal notes"
on public.complaint_internal_notes for insert
with check (public.is_staff(auth.uid()) and auth.uid() = staff_id);

-- 13. NOTIFICATIONS POLICIES
create policy "Users can view and manage their own notifications"
on public.notifications for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 14. NOTIFICATION PREFERENCES POLICIES
create policy "Users can view and manage their preferences"
on public.notification_preferences for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 15. ADMIN AUDIT LOGS POLICIES
create policy "Only staff can view audit logs"
on public.admin_audit_logs for select
using (public.is_staff(auth.uid()));

create policy "System and staff can insert audit logs"
on public.admin_audit_logs for insert
with check (auth.uid() = actor_id or public.is_staff(auth.uid()));

-- 16. USER BLOCKS POLICIES
create policy "Users can manage their blocked list"
on public.user_blocks for all
using (auth.uid() = blocker_id)
with check (auth.uid() = blocker_id);

-- 17. SAVED LISTINGS POLICIES
create policy "Users can view and manage their saved listings"
on public.saved_listings for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
