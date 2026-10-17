-- ============================================================================
-- SAKAN (سَكَن) — Master Administrative & Operational SQL Suite
-- Version: 1.0.0 (Production Master Control)
-- Description: Comprehensive SQL operations for platform owners and super-admins
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SECTION 1: EXECUTIVE DASHBOARD & PLATFORM HEALTH KPIS
-- ----------------------------------------------------------------------------

-- 1.1 Platform Summary KPI Overview (Single Row Metrics)
SELECT 
    (SELECT COUNT(*) FROM public.profiles) AS total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE is_suspended = false) AS active_users,
    (SELECT COUNT(*) FROM public.profiles WHERE is_suspended = true) AS banned_users,
    (SELECT COUNT(*) FROM public.listings) AS total_listings,
    (SELECT COUNT(*) FROM public.listings WHERE status = 'published') AS active_listings,
    (SELECT COUNT(*) FROM public.listings WHERE status = 'rented') AS rented_listings,
    (SELECT COUNT(*) FROM public.listings WHERE status = 'rejected') AS rejected_listings,
    (SELECT COUNT(*) FROM public.complaints) AS total_complaints,
    (SELECT COUNT(*) FROM public.complaints WHERE status IN ('submitted', 'under_review')) AS pending_complaints,
    (SELECT COUNT(*) FROM public.wanted_requests WHERE is_active = true) AS active_wanted_requests,
    (SELECT COUNT(*) FROM public.conversations) AS total_conversations,
    (SELECT COUNT(*) FROM public.messages) AS total_chat_messages;

-- 1.2 Governorate Marketplace Distribution (Supply vs Demand)
SELECT 
    g.governorate,
    COUNT(DISTINCT l.id) AS published_listings_count,
    ROUND(AVG(l.monthly_rent), 0) AS avg_monthly_rent_egp,
    MIN(l.monthly_rent) AS min_rent_egp,
    MAX(l.monthly_rent) AS max_rent_egp,
    COUNT(DISTINCT wr.id) AS wanted_requests_count
FROM (
    SELECT DISTINCT governorate FROM public.listings
    UNION
    SELECT DISTINCT governorate FROM public.wanted_requests
) g
LEFT JOIN public.listings l ON l.governorate = g.governorate AND l.status = 'published'
LEFT JOIN public.wanted_requests wr ON wr.governorate = g.governorate AND wr.is_active = true
GROUP BY g.governorate
ORDER BY published_listings_count DESC;

-- 1.3 Housing Type & Student/Worker Breakdown
SELECT 
    housing_type,
    eligible_occupants,
    COUNT(*) AS listings_count,
    ROUND(AVG(monthly_rent), 0) AS avg_rent_egp,
    ROUND(AVG(deposit), 0) AS avg_deposit_egp
FROM public.listings
WHERE status = 'published'
GROUP BY housing_type, eligible_occupants
ORDER BY listings_count DESC;


-- ----------------------------------------------------------------------------
-- SECTION 2: USER GOVERNANCE, EMERGENCY BAN & PRIVILEGE SUITE
-- ----------------------------------------------------------------------------

-- 2.1 Find User by Normalized Phone Number or Name or UUID
-- Replace '01012345678' with target phone or name
SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.phone_verified,
    p.role_preference,
    p.is_suspended,
    p.suspension_reason,
    p.created_at,
    (SELECT STRING_AGG(ur.role, ', ') FROM public.user_roles ur WHERE ur.user_id = p.id) AS assigned_roles,
    (SELECT COUNT(*) FROM public.listings l WHERE l.owner_id = p.id) AS listings_count,
    (SELECT COUNT(*) FROM public.complaints c WHERE c.reported_user_id = p.id) AS complaints_against_count
FROM public.profiles p
WHERE p.phone LIKE '%01012345678%' 
   OR p.full_name ILIKE '%أحمد%' 
   OR p.id::text = '00000000-0000-0000-0000-000000000000';

-- 2.2 Immediate Account Suspension / Freeze (Banning a Malicious User / Broker)
-- Set TARGET_USER_ID and REASON
DO $$
DECLARE
    target_user_id uuid := '00000000-0000-0000-0000-000000000000';
    admin_id uuid := '00000000-0000-0000-0000-000000000001';
    ban_reason text := 'مخالفة ميثاق الأمان وطلب عمولة سمسرة من الطلاب';
BEGIN
    -- 1. Suspend the profile
    UPDATE public.profiles
    SET is_suspended = true,
        suspension_reason = ban_reason,
        updated_at = now()
    WHERE id = target_user_id;

    -- 2. Automatically pause / remove all active listings owned by this user
    UPDATE public.listings
    SET status = 'removed',
        rejection_reason = 'تم سحب الإعلان بسبب تجميد حساب المعلن لمخالفة القواعد',
        updated_at = now()
    WHERE owner_id = target_user_id AND status IN ('published', 'pending', 'paused');

    -- 3. Log to audit trail
    INSERT INTO public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (
        admin_id, 
        'user_suspended_and_listings_removed', 
        'user', 
        target_user_id::text, 
        jsonb_build_object('reason', ban_reason, 'timestamp', now())
    );
END $$;

-- 2.3 Unban / Restore Account
DO $$
DECLARE
    target_user_id uuid := '00000000-0000-0000-0000-000000000000';
    admin_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
    UPDATE public.profiles
    SET is_suspended = false,
        suspension_reason = NULL,
        updated_at = now()
    WHERE id = target_user_id;

    INSERT INTO public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (admin_id, 'user_restored', 'user', target_user_id::text, jsonb_build_object('restored_at', now()));
END $$;

-- 2.4 Grant Super Admin or Moderator Role to User
-- Supported roles: 'super_admin', 'admin', 'listing_moderator', 'complaint_reviewer', 'analyst'
INSERT INTO public.user_roles (user_id, role, assigned_by)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- User UUID
    'super_admin',                           -- Role
    '00000000-0000-0000-0000-000000000001'  -- Super Admin UUID who assigned
)
ON CONFLICT (user_id, role) DO NOTHING;

-- 2.5 Revoke Staff Role
DELETE FROM public.user_roles
WHERE user_id = '00000000-0000-0000-0000-000000000000' AND role = 'admin';

-- 2.6 Manually Verify Phone Number (Override for Egyptian Verified Numbers)
UPDATE public.profiles
SET phone_verified = true,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000';


-- ----------------------------------------------------------------------------
-- SECTION 3: LISTING MODERATION & EMERGENCY OVERRIDES
-- ----------------------------------------------------------------------------

-- 3.1 Force-Approve and Publish a Listing
UPDATE public.listings
SET status = 'published',
    rejection_reason = NULL,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000';

-- 3.2 Force-Reject a Fraudulent or Inaccurate Listing
UPDATE public.listings
SET status = 'rejected',
    rejection_reason = 'بيانات غير مطابقة لواقع العقار أو صور مضللة تم إبلاغها من المعاينين',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000';

-- 3.3 Force-Hide Provider Public Phone (Privacy Protection)
UPDATE public.listings
SET show_phone_publicly = false,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000';

-- 3.4 Mark Listing as Rented (Remove from Public Search)
UPDATE public.listings
SET status = 'rented',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000';

-- 3.5 Reassign Listing Owner (Administrative Ownership Transfer)
UPDATE public.listings
SET owner_id = '00000000-0000-0000-0000-000000000002', -- New owner
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000000';


-- ----------------------------------------------------------------------------
-- SECTION 4: ANTI-BROKER RADAR & FRAUD DETECTION
-- ----------------------------------------------------------------------------

-- 4.1 Broker Radar: Find Users with Abnormally High Listings Count
-- Legitimate Egyptian room hosts rarely post more than 3 distinct properties simultaneously
SELECT 
    p.id AS user_id,
    p.full_name,
    p.phone,
    COUNT(l.id) AS total_listings_count,
    COUNT(CASE WHEN l.status = 'published' THEN 1 END) AS active_listings_count,
    ARRAY_AGG(DISTINCT l.governorate) AS active_governorates,
    ARRAY_AGG(DISTINCT l.area) AS active_areas
FROM public.profiles p
JOIN public.listings l ON l.owner_id = p.id
WHERE p.is_suspended = false
GROUP BY p.id, p.full_name, p.phone
HAVING COUNT(l.id) >= 3
ORDER BY total_listings_count DESC;

-- 4.2 Broker Radar: Flag Accounts with Multiple Complaints Against Them
SELECT 
    p.id AS reported_user_id,
    p.full_name,
    p.phone,
    p.is_suspended,
    COUNT(c.id) AS complaints_count,
    STRING_AGG(DISTINCT c.category, ' | ') AS complaint_categories,
    MAX(c.created_at) AS latest_complaint_date
FROM public.profiles p
JOIN public.complaints c ON c.reported_user_id = p.id
GROUP BY p.id, p.full_name, p.phone, p.is_suspended
HAVING COUNT(c.id) >= 1
ORDER BY complaints_count DESC;

-- 4.3 Bulk Sanction: One-Click Strike on Verified Broker Ring
-- Takes an array of user IDs, bans them all, closes listings, and logs audit
DO $$
DECLARE
    broker_ids uuid[] := ARRAY[
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000011'::uuid
    ];
    admin_actor uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
    -- Ban profiles
    UPDATE public.profiles
    SET is_suspended = true,
        suspension_reason = 'شبكة سمسرة غير مرخصة تطلب عمولات من الباحثين عن سكن',
        updated_at = now()
    WHERE id = ANY(broker_ids);

    -- Remove all listings
    UPDATE public.listings
    SET status = 'removed',
        rejection_reason = 'مخالفة قواعد مكافحة السماسرة',
        updated_at = now()
    WHERE owner_id = ANY(broker_ids);

    -- Audit log
    INSERT INTO public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (
        admin_actor,
        'bulk_broker_ring_banned',
        'user_cluster',
        array_to_string(broker_ids, ','),
        jsonb_build_object('count', cardinality(broker_ids), 'timestamp', now())
    );
END $$;


-- ----------------------------------------------------------------------------
-- SECTION 5: COMPLAINT RESOLUTION WORKFLOW
-- ----------------------------------------------------------------------------

-- 5.1 Full Complaint Inspection Docket
SELECT 
    c.id AS complaint_id,
    c.category,
    c.status,
    c.description AS complaint_details,
    c.created_at,
    rep.full_name AS reporter_name,
    rep.phone AS reporter_phone,
    sus.id AS reported_user_id,
    sus.full_name AS reported_user_name,
    sus.phone AS reported_user_phone,
    sus.is_suspended AS is_reported_user_banned,
    l.id AS listing_id,
    l.title AS listing_title,
    l.monthly_rent,
    l.governorate,
    l.area,
    (SELECT STRING_AGG(ce.file_url, ' , ') FROM public.complaint_evidence ce WHERE ce.complaint_id = c.id) AS evidence_urls
FROM public.complaints c
JOIN public.profiles rep ON rep.id = c.reporter_id
LEFT JOIN public.profiles sus ON sus.id = c.reported_user_id
LEFT JOIN public.listings l ON l.id = c.listing_id
ORDER BY 
    CASE c.status 
        WHEN 'submitted' THEN 1 
        WHEN 'under_review' THEN 2 
        WHEN 'escalated' THEN 3 
        ELSE 4 
    END, 
    c.created_at DESC;

-- 5.2 Resolve Complaint: Prove Broker Violation & Ban Offender
DO $$
DECLARE
    target_complaint_id uuid := '00000000-0000-0000-0000-000000000100';
    reviewer_user_id uuid := '00000000-0000-0000-0000-000000000001';
    offender_id uuid;
    listing_target_id uuid;
BEGIN
    -- Get offender and listing
    SELECT reported_user_id, listing_id INTO offender_id, listing_target_id
    FROM public.complaints
    WHERE id = target_complaint_id;

    -- Update complaint status
    UPDATE public.complaints
    SET status = 'resolved',
        resolution_notes = 'تم مراجعة لقطات الشات ومحفظة فودافون كاش وثبوت طلب عمولة سمسرة. تم حظر الحساب وحذف الإعلانات.',
        reviewer_id = reviewer_user_id,
        updated_at = now()
    WHERE id = target_complaint_id;

    -- Add internal staff note
    INSERT INTO public.complaint_internal_notes (complaint_id, staff_id, note)
    VALUES (
        target_complaint_id, 
        reviewer_user_id, 
        'قرار إداري نهائي: تم التحقق الجنائي من طلب عمولة وتجميد الحساب نهائياً.'
    );

    -- Ban offender
    IF offender_id IS NOT NULL THEN
        UPDATE public.profiles
        SET is_suspended = true,
            suspension_reason = 'ثبوت طلب عمولة سمسرة بموجب البلاغ رقم ' || target_complaint_id::text,
            updated_at = now()
        WHERE id = offender_id;

        -- Remove listings
        UPDATE public.listings
        SET status = 'removed',
            updated_at = now()
        WHERE owner_id = offender_id;
    END IF;

    -- Audit log
    INSERT INTO public.admin_audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (reviewer_user_id, 'complaint_resolved_with_sanction', 'complaint', target_complaint_id::text, jsonb_build_object('offender_banned', offender_id));
END $$;


-- ----------------------------------------------------------------------------
-- SECTION 6: EXECUTIVE DATA EXPORTS (CSV / SPREADSHEET COMPATIBLE)
-- ----------------------------------------------------------------------------

-- 6.1 Master User Tracking Sheet Export
SELECT 
    p.id AS "كود المستخدم",
    p.full_name AS "الاسم الكامل",
    p.phone AS "رقم الهاتف",
    CASE WHEN p.phone_verified THEN 'نعم' ELSE 'لا' END AS "تأكيد الهاتف",
    p.role_preference AS "نوع الحساب",
    CASE WHEN p.is_suspended THEN 'محظور' ELSE 'نشط' END AS "حالة الحساب",
    COALESCE(p.suspension_reason, '-') AS "سبب الحظر",
    TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI') AS "تاريخ التسجيل",
    (SELECT COUNT(*) FROM public.listings l WHERE l.owner_id = p.id) AS "عدد الإعلانات",
    (SELECT COUNT(*) FROM public.complaints c WHERE c.reported_user_id = p.id) AS "عدد الشكاوى ضده"
FROM public.profiles p
ORDER BY p.created_at DESC;

-- 6.2 Master Listings Tracking Sheet Export
SELECT 
    l.id AS "كود الإعلان",
    l.title AS "عنوان الإعلان",
    p.full_name AS "اسم صاحب الإعلان",
    p.phone AS "هاتف صاحب الإعلان",
    l.governorate AS "المحافظة",
    l.area AS "المنطقة",
    l.housing_type AS "نوع السكن",
    l.monthly_rent AS "الإيجار الشهري (ج.م)",
    l.deposit AS "مبلغ التأمين (ج.م)",
    l.utilities_cost AS "تكلفة الفواتير (ج.م)",
    CASE WHEN l.furnished THEN 'مفروش' ELSE 'غير مفروش' END AS "الفرش",
    l.status AS "حالة الإعلان",
    l.views_count AS "المشاهدات",
    TO_CHAR(l.created_at, 'YYYY-MM-DD') AS "تاريخ النشر"
FROM public.listings l
JOIN public.profiles p ON p.id = l.owner_id
ORDER BY l.created_at DESC;

-- 6.3 Master Complaints Tracking Sheet Export
SELECT 
    c.id AS "كود الشكوى",
    c.category AS "تصنيف المخالفة",
    c.status AS "حالة الفحص",
    rep.full_name AS "الشاكي",
    rep.phone AS "هاتف الشاكي",
    COALESCE(sus.full_name, 'غير محدد') AS "المشكو في حقه",
    COALESCE(sus.phone, '-') AS "هاتف المشكو في حقه",
    c.description AS "تفاصيل البلاغ",
    COALESCE(c.resolution_notes, 'قيد الفحص') AS "قرار الإدارة",
    TO_CHAR(c.created_at, 'YYYY-MM-DD HH24:MI') AS "تاريخ التقديم"
FROM public.complaints c
JOIN public.profiles rep ON rep.id = c.reporter_id
LEFT JOIN public.profiles sus ON sus.id = c.reported_user_id
ORDER BY c.created_at DESC;

-- 6.4 Master Wanted Requests (دوّرلي على سكن) Export
SELECT 
    wr.id AS "كود الطلب",
    p.full_name AS "اسم الطالب",
    p.phone AS "هاتف التواصل",
    wr.governorate AS "المحافظة المطلوبة",
    COALESCE(wr.area, 'أي منطقة') AS "المنطقة المفضلة",
    COALESCE(wr.housing_type, 'أي نوع') AS "نوع السكن المطلوب",
    wr.budget_max AS "أقصى ميزانية (ج.م)",
    CASE WHEN wr.is_active THEN 'نشط' ELSE 'موقوف' END AS "حالة التنبيهات",
    TO_CHAR(wr.created_at, 'YYYY-MM-DD') AS "تاريخ الطلب"
FROM public.wanted_requests wr
JOIN public.profiles p ON p.id = wr.user_id
ORDER BY wr.created_at DESC;

-- 6.5 Master Audit Trail Stream Export
SELECT 
    al.id AS "كود العملية",
    TO_CHAR(al.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "التوقيت",
    p.full_name AS "المسؤول المنفذ",
    al.action AS "نوع الإجراء",
    al.target_type AS "الكيان المتأثر",
    al.target_id AS "كود الكيان",
    al.metadata::text AS "البيانات التفصيلية"
FROM public.admin_audit_logs al
LEFT JOIN public.profiles p ON p.id = al.actor_id
ORDER BY al.created_at DESC;

-- ============================================================================
-- END OF SAKAN MASTER SQL OPS SUITE
-- ============================================================================
