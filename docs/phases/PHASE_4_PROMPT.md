# Phase 4: Essay Upload System - Implementation Prompt

## Context

I'm building an ENEM Essay Corrector web app with Next.js, Supabase, and AI services.

**Current Status:**
- ✅ Phase 1: Project Setup - Complete
- ✅ Phase 2: Supabase Setup - Complete & Verified
- ✅ Phase 3: Authentication System - Complete & Working
- 🔄 Phase 4: Essay Upload System - Ready to Start

## What's Been Completed

### Phase 1 & 2:
- Next.js 14+ project with TypeScript, Tailwind CSS
- Supabase client utilities (browser & server)
- Database schema with RLS policies deployed
- Storage bucket configured (`essay-images`)
- Middleware for protected routes
- TypeScript types defined
- Verification script working

### Phase 3 (Just Completed):
- Authentication components: LoginButton, LogoutButton, UserProfile
- OAuth callback handler at `app/auth/callback/route.ts`
- Dashboard page at `app/dashboard/page.tsx`
- Landing page at `app/page.tsx`
- Login page with error handling at `app/login/page.tsx`
- Google OAuth integration (configured in Supabase)
- Next.js 15 compatibility fixes

## Task: Implement Phase 4 - Essay Upload System

Create a complete essay upload system that allows authenticated users to:
1. Upload essay images (photos or scans)
2. Preview uploaded images before submission
3. Add essay metadata (title, theme)
4. Submit essays to Supabase Storage
5. Save essay records to database
6. Display upload progress
7. Handle errors gracefully

### Required Components

1. **File Upload Component** (`components/upload/FileUpload.tsx`)
   - Drag-and-drop functionality
   - File input button
   - Image preview
   - File validation (type, size)
   - Multiple file support (if needed)

2. **Image Preview Component** (`components/upload/ImagePreview.tsx`)
   - Display uploaded images
   - Remove/replace functionality
   - Zoom/rotate options (optional)

3. **Essay Form Component** (`components/upload/EssayForm.tsx`)
   - Essay title input
   - Theme/topic input
   - Submit button
   - Form validation

4. **Upload Progress Component** (`components/upload/UploadProgress.tsx`)
   - Progress bar
   - Upload status messages
   - Cancel upload option

### Required Pages

1. **Upload Page** (`app/upload/page.tsx`)
   - Protected route (requires authentication)
   - Integrate all upload components
   - Handle form submission
   - Upload to Supabase Storage
   - Create essay record in database

### Required Services

1. **Storage Service** (`lib/services/storage.ts`)
   - Upload images to Supabase Storage
   - Generate unique filenames
   - Handle upload errors
   - Get public URLs for uploaded images

2. **Essay Service** (`lib/services/essays.ts`)
   - Create essay records in database
   - Link images to essays
   - Fetch user's essays
   - Update essay status

### Technical Requirements

- Use Supabase Storage bucket: `essay-images`
- Store essay records in `essays` table
- Store image records in `essay_images` table
- Implement proper error handling
- Show loading states
- Validate file types (jpg, jpeg, png, pdf)
- Limit file size (e.g., 10MB per file)
- Use Next.js 15 best practices
- Ensure mobile responsiveness

### Database Schema (Already Created)

```sql
-- essays table
id, user_id, title, theme, status, created_at, updated_at

-- essay_images table
id, essay_id, storage_path, page_number, created_at

-- Storage bucket: essay-images (already configured)
```

## Key Files to Reference

### Architecture & Planning:
- `ARCHITECTURE.md` - Complete system architecture
- `CODER_SUBTASK.md` - Phase-by-phase implementation checklist
- `enem-essay-corrector/PHASE_2_SUMMARY.md` - Database setup details
- `enem-essay-corrector/PHASE_3_SUMMARY.md` - Authentication implementation

### Code Files:
- `enem-essay-corrector/types/index.ts` - TypeScript types (Essay, EssayImage, etc.)
- `enem-essay-corrector/lib/supabase/client.ts` - Browser Supabase client
- `enem-essay-corrector/lib/supabase/server.ts` - Server Supabase client
- `enem-essay-corrector/middleware.ts` - Route protection
- `enem-essay-corrector/app/dashboard/page.tsx` - Dashboard (add upload button here)

### Environment:
- Working directory: `enem-essay-corrector/`
- Dev server: `pnpm dev` (runs on localhost:3000)
- Supabase: Configured and verified
- Authentication: Working with Google OAuth

## Implementation Steps

1. **Create Storage Service** (`lib/services/storage.ts`)
   - Upload function with progress tracking
   - File validation
   - Error handling

2. **Create Essay Service** (`lib/services/essays.ts`)
   - Create essay function
   - Link images to essay
   - Fetch essays function

3. **Create Upload Components**
   - FileUpload component (drag-and-drop + file input)
   - ImagePreview component
   - EssayForm component
   - UploadProgress component

4. **Create Upload Page** (`app/upload/page.tsx`)
   - Integrate all components
   - Handle form submission
   - Upload flow orchestration

5. **Update Dashboard**
   - Add "Upload Essay" button that links to `/upload`
   - Update the existing placeholder button

6. **Test Upload Flow**
   - Upload single image
   - Upload multiple images
   - Test error cases
   - Verify database records
   - Check storage bucket

## Success Criteria

- [ ] Users can upload essay images via drag-and-drop or file input
- [ ] Images are previewed before submission
- [ ] Users can add essay title and theme
- [ ] Upload progress is displayed
- [ ] Images are stored in Supabase Storage
- [ ] Essay records are created in database
- [ ] Errors are handled gracefully
- [ ] Upload page is mobile-responsive
- [ ] Dashboard shows upload button

## Notes

- Use `createClient()` from `@/lib/supabase/client` for client-side operations
- Use `createClient()` from `@/lib/supabase/server` for server-side operations
- Follow existing code patterns from Phase 3 components
- Ensure proper TypeScript typing
- Add proper loading states and error messages
- Consider UX: clear instructions, visual feedback, error recovery

## Environment Variables

Already configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Start Here

Begin by creating the storage service, then the essay service, then build the UI components from bottom-up (FileUpload → ImagePreview → EssayForm → UploadProgress → Upload Page).

Good luck with Phase 4! 🚀