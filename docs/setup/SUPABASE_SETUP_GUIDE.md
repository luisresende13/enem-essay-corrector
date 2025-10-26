# Supabase Setup Guide - Phase 2

This guide will walk you through setting up your Supabase project for the ENEM Essay Corrector application.

## Prerequisites
- Supabase account (sign up at https://supabase.com)
- Access to your project's environment variables

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the details:
   - **Name:** enem-essay-corrector (or your preferred name)
   - **Database Password:** Generate a strong password (save it securely)
   - **Region:** Choose closest to your users (e.g., South America - São Paulo)
   - **Pricing Plan:** Free tier is sufficient for MVP
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

3. Update your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste each section from `DATABASE_SETUP.md` in order:
   - Section 1: Enable UUID Extension
   - Section 2: User Profiles Table
   - Section 3: Essays Table
   - Section 4: Evaluations Table
   - Section 5: Evaluation Criteria Table
   - Section 6: Storage Bucket Setup
   - Section 7: Useful Views (Optional)
   - Section 8: Database Functions (Optional)

4. Run each section by clicking "Run" (or press Ctrl/Cmd + Enter)
5. Verify no errors appear in the output

## Step 4: Verify Database Setup

Run the verification queries from Section 9 of `DATABASE_SETUP.md`:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

Expected tables:
- user_profiles
- essays
- evaluations
- evaluation_criteria

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`

```sql
-- Check evaluation criteria data
SELECT * FROM public.evaluation_criteria ORDER BY competency_number;
```

Should return 5 rows (competencies 1-5)

## Step 5: Set Up Storage Bucket

### Option A: Using SQL (Recommended)

The SQL in Section 6 of `DATABASE_SETUP.md` should have created the bucket. Verify:

1. Go to **Storage** in your Supabase dashboard
2. You should see a bucket named `essay-images`
3. Click on it and verify it's set to **Private**

### Option B: Manual Setup (if SQL didn't work)

1. Go to **Storage** in your Supabase dashboard
2. Click "Create a new bucket"
3. Settings:
   - **Name:** `essay-images`
   - **Public bucket:** OFF (keep it private)
   - **File size limit:** 10 MB
   - **Allowed MIME types:** image/jpeg, image/png, application/pdf
4. Click "Create bucket"

### Set Up Storage Policies

If the SQL policies didn't work, create them manually:

1. Click on the `essay-images` bucket
2. Go to **Policies** tab
3. Create three policies:

**Policy 1: Upload**
- Policy name: `Users can upload own essay images`
- Allowed operation: INSERT
- Target roles: authenticated
- USING expression:
```sql
bucket_id = 'essay-images' AND
auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 2: Select**
- Policy name: `Users can view own essay images`
- Allowed operation: SELECT
- Target roles: authenticated
- USING expression:
```sql
bucket_id = 'essay-images' AND
auth.uid()::text = (storage.foldername(name))[1]
```

**Policy 3: Delete**
- Policy name: `Users can delete own essay images`
- Allowed operation: DELETE
- Target roles: authenticated
- USING expression:
```sql
bucket_id = 'essay-images' AND
auth.uid()::text = (storage.foldername(name))[1]
```

## Step 6: Enable Google OAuth

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Find **Google** in the list and click to expand
3. Toggle **Enable Sign in with Google** to ON

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: ENEM Essay Corrector
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: Web application
   - Name: ENEM Essay Corrector
   - Authorized redirect URIs: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     (Get this from Supabase Auth settings)
7. Copy the **Client ID** and **Client Secret**

### Configure in Supabase

1. Back in Supabase **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

## Step 7: Test Authentication

1. Start your Next.js development server:
```bash
cd enem-essay-corrector
npm run dev
```

2. Navigate to `http://localhost:3000/login`
3. Try signing in with Google
4. If successful, you should be redirected to `/dashboard`

## Step 8: Verify User Profile Creation

After signing in, check if your user profile was created:

1. Go to Supabase **SQL Editor**
2. Run:
```sql
SELECT * FROM auth.users;
SELECT * FROM public.user_profiles;
```

You should see your user in both tables.

## Troubleshooting

### Issue: "relation does not exist" errors
**Solution:** Make sure you ran all SQL migrations in order. Re-run the failed section.

### Issue: Storage policies not working
**Solution:** Verify the folder structure in uploads is `{user_id}/{filename}`. The policies check the first folder name matches the user's ID.

### Issue: Google OAuth not working
**Solution:** 
- Verify redirect URI matches exactly in Google Console
- Check Client ID and Secret are correct in Supabase
- Ensure OAuth consent screen is configured

### Issue: RLS blocking queries
**Solution:** 
- For API routes that need admin access, use `createServiceRoleClient()` from `lib/supabase/server.ts`
- For user-specific queries, use the regular `createClient()`

## Next Steps

Once Phase 2 is complete:
- ✅ Supabase project created
- ✅ Database schema deployed
- ✅ Storage bucket configured
- ✅ Google OAuth enabled
- ✅ Test authentication working

You're ready to move to **Phase 3: Authentication System** implementation!

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Issues: Create an issue in the repository