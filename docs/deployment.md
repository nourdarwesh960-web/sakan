# SAKAN Deployment & Operations Guide

## 1. Hosting Requirements
- **Frontend / Next.js**: Any Node.js 18+ or serverless platform supporting Next.js 16 (e.g. Vercel, Railway, Coolify, VPS with Docker/PM2).
- **Database / Backend**: Supabase Cloud or self-hosted Supabase PostgreSQL.

---

## 2. Environment Variables Checklist
Copy `.env.example` to `.env.local` for local execution or into your cloud platform environment settings:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-secret-service-role-key>
NEXT_PUBLIC_APP_URL=https://sakan.eg
```

---

## 3. Database Migration Steps
1. Navigate to your Supabase project dashboard -> SQL Editor (or connect via Supabase CLI).
2. Execute the migrations in sequential order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_row_level_security.sql`
   - `supabase/migrations/003_storage_policies.sql`
3. Verify that all 17 tables and 4 storage buckets are provisioned and RLS is enabled.

---

## 4. Initial Administrator Provisioning
To assign the initial Super Administrator role safely:
1. Have the administrator register an account normally via `/signup` using their email or phone.
2. In Supabase SQL Editor, run:
```sql
insert into public.user_roles (user_id, role)
values ('<USER_UUID_FROM_AUTH_USERS>', 'super_admin');
```
3. The user can now access `/admin` and grant lower-tier staff roles (`admin`, `listing_moderator`, `complaint_reviewer`, `analyst`).

---

## 5. Build and Run Commands
```bash
# Install dependencies
npm install

# Run type check and lint
npm run lint

# Run automated tests
npm run test

# Compile production bundle
npm run build

# Start production server
npm run start
```
