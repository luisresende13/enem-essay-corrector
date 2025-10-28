# Implementation Subtask for Code Mode

## Project Overview
Build an ENEM essay correction web application using Next.js, TypeScript, Supabase, Google Vision API, and Gemini 2.5 Pro.

## Context
- **Target Users:** High school students preparing for ENEM (100-500 users MVP)
- **Value Proposition:** Instant, AI-powered feedback on practice essays
- **Business Model:** Free service
- **Architecture:** See `ARCHITECTURE.md` for complete system design

## Tech Stack
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI Services:** Google Vision API (OCR), Gemini 2.5 Pro (evaluation)
- **Deployment:** Vercel

## Implementation Checklist

### Phase 1: Project Setup ✅
**Goal:** Initialize project with all dependencies and configurations

**Tasks:**
1. Create Next.js project with TypeScript and App Router
   ```bash
   npx create-next-app@latest enem-essay-corrector --typescript --tailwind --app
   ```

2. Install required dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   npm install @google-cloud/vision
   npm install @google/generative-ai
   npm install zod # for validation
   npm install react-dropzone # for file upload
   ```

3. Set up environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   GOOGLE_VISION_API_KEY=your_vision_api_key
   GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account.json
   
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Configure Tailwind CSS with custom theme (optional)

5. Set up ESLint and Prettier

**Deliverables:**
- Working Next.js project structure
- All dependencies installed
- Environment variables configured
- Basic folder structure: `app/`, `lib/`, `components/`, `types/`

---

### Phase 2: Supabase Setup ✅ COMPLETE
**Goal:** Configure database, authentication, and storage

**Tasks:**
1. Create Supabase project at https://supabase.com

2. Run database migrations (SQL scripts):
   - Create `user_profiles` table
   - Create `essays` table with RLS policies
   - Create `evaluations` table with RLS policies
   - Create `evaluation_criteria` table and insert ENEM criteria

3. Set up Storage bucket:
   - Create `essay-images` bucket (private)
   - Configure storage policies for user access

4. Enable Google OAuth in Supabase Auth settings

5. Create Supabase client utilities:
   - `lib/supabase/client.ts` (client-side)
   - `lib/supabase/server.ts` (server-side)
   - `lib/supabase/middleware.ts` (auth middleware)

**Deliverables:**
- Supabase project configured
- Database schema created with RLS
- Storage bucket ready
- Supabase client utilities

**Reference:** See `ARCHITECTURE.md` for complete SQL schema

---

### Phase 3: Authentication System ✅
**Goal:** Implement Google OAuth login/logout

**Tasks:**
1. Create authentication pages:
   - `app/login/page.tsx` - Login page with Google button
   - `app/auth/callback/route.ts` - OAuth callback handler

2. Create protected route middleware:
   - `middleware.ts` - Redirect unauthenticated users

3. Create auth components:
   - `components/auth/LoginButton.tsx`
   - `components/auth/LogoutButton.tsx`
   - `components/auth/UserProfile.tsx`

4. Implement session management:
   - Server-side session validation
   - Client-side auth state

5. Create user profile page:
   - `app/profile/page.tsx` - Display user info

**Deliverables:**
- Working Google OAuth login
- Protected routes
- User session management
- Profile page

---

### Phase 4: File Upload System ✅
**Goal:** Allow users to upload essay images

**Tasks:**
1. Create upload API route:
   - `app/api/upload/route.ts`
   - Validate file type (JPEG, PNG, PDF)
   - Validate file size (max 10MB)
   - Upload to Supabase Storage
   - Create essay record in database

2. Create upload page:
   - `app/upload/page.tsx`
   - Drag-and-drop interface (react-dropzone)
   - Image preview
   - Upload progress indicator
   - Title input field

3. Create upload components:
   - `components/upload/ImageDropzone.tsx`
   - `components/upload/UploadProgress.tsx`

4. Handle upload errors gracefully

**Deliverables:**
- Working file upload to Supabase Storage
- User-friendly upload interface
- Essay records created in database

---

### Phase 5: OCR Integration ✅
**Goal:** Extract text from essay images using Google Vision API

**Tasks:**
1. Create OCR API route:
   - `app/api/ocr/route.ts`
   - Fetch image from Supabase Storage
   - Call Google Vision API for handwriting recognition
   - Save transcription to database
   - Update essay status to 'transcribed'

2. Create OCR service:
   - `lib/services/ocr.ts`
   - Handle Vision API authentication
   - Process OCR response
   - Error handling for poor quality images

3. Create transcription review page:
   - `app/essays/[id]/transcription/page.tsx`
   - Display original image side-by-side with transcription
   - Allow manual editing of transcription
   - Save edited transcription

4. Add loading states during OCR processing

**Deliverables:**
- Working OCR integration
- Transcription saved to database
- Review/edit interface for transcriptions

**Reference:** See `ARCHITECTURE.md` for OCR flow diagram

---

### Phase 6: AI Evaluation Engine ✅
**Goal:** Evaluate essays using Gemini 2.5 Pro based on ENEM criteria

**Tasks:**
1. Create evaluation API route:
   - `app/api/evaluate/route.ts`
   - Fetch essay transcription
   - Build evaluation prompt with ENEM criteria
   - Call Gemini 2.5 Pro API
   - Parse structured JSON response
   - Save evaluation to database
   - Update essay status to 'evaluated'

2. Create evaluation service:
   - `lib/services/evaluation.ts`
   - Gemini API client setup
   - Prompt template with ENEM competencies
   - Response validation (Zod schema)
   - Retry logic for API failures

3. Create evaluation prompt:
   - Include all 5 ENEM competencies
   - Request structured JSON output
   - Provide scoring guidelines (0-200 per competency)

4. Handle edge cases:
   - Empty transcriptions
   - Off-topic essays
   - API rate limits

**Deliverables:**
- Working AI evaluation
- Evaluation results saved to database
- Structured feedback for each competency

**Reference:** See `ARCHITECTURE.md` for evaluation prompt template

---

### Phase 7: Dashboard & Essay List ✅
**Goal:** Display user's essays and their status

**Tasks:**
1. Create dashboard page:
   - `app/dashboard/page.tsx`
   - List all user's essays
   - Show status badges (uploaded, transcribed, evaluated)
   - Display overall score for evaluated essays
   - Sort by date (newest first)

2. Create essay card component:
   - `components/essays/EssayCard.tsx`
   - Thumbnail image
   - Title and date
   - Status indicator
   - Score badge (if evaluated)
   - Action buttons (view, delete)

3. Implement essay deletion:
   - Delete from database
   - Delete image from storage
   - Confirm dialog before deletion

4. Add empty state for new users

**Deliverables:**
- Dashboard showing all user essays
- Essay cards with status and scores
- Delete functionality

---

### Phase 8: Evaluation Results Page ✅
**Goal:** Display detailed evaluation feedback

**Tasks:**
1. Create results page:
   - `app/essays/[id]/results/page.tsx`
   - Overall score (0-1000)
   - Individual competency scores (0-200 each)
   - Detailed feedback for each competency
   - General feedback summary

2. Create results components:
   - `components/results/ScoreCard.tsx` - Overall score display
   - `components/results/CompetencyScore.tsx` - Individual competency
   - `components/results/FeedbackSection.tsx` - Detailed feedback
   - `components/results/ProgressBar.tsx` - Visual score indicator

3. Add side-by-side view:
   - Original image on left
   - Transcription on right
   - Evaluation below

4. Add export functionality:
   - Print-friendly view
   - PDF export (optional)

**Deliverables:**
- Comprehensive results page
- Visual score indicators
- Detailed feedback display
- Side-by-side image/transcription view

---

### Phase 9: UI/UX Polish ✅
**Goal:** Improve user experience and visual design

**Tasks:**
1. Create navigation components:
   - `components/layout/Navbar.tsx` - Top navigation
   - `components/layout/Sidebar.tsx` - Side menu (optional)
   - `components/layout/Footer.tsx`

2. Add loading states:
   - Skeleton loaders for dashboard
   - Spinners for API calls
   - Progress indicators for long operations

3. Improve error handling:
   - User-friendly error messages
   - Toast notifications (react-hot-toast)
   - Error boundaries

4. Add responsive design:
   - Mobile-friendly layouts
   - Tablet optimization
   - Desktop enhancements

5. Create landing page:
   - `app/page.tsx` - Home page for logged-out users
   - Explain the service
   - Call-to-action to sign up
   - Sample evaluation demo

**Deliverables:**
- Polished UI with consistent design
- Responsive layouts
- Better error handling
- Landing page

---

### Phase 10: Testing & Quality Assurance ✅
**Goal:** Ensure application works correctly

**Tasks:**
1. Test authentication flows:
   - Login with Google
   - Logout
   - Session persistence
   - Protected routes

2. Test essay submission flow:
   - Upload various image formats
   - Test file size limits
   - Verify storage upload
   - Check database records

3. Test OCR accuracy:
   - Upload 10+ sample handwritten essays
   - Verify transcription quality
   - Test edge cases (poor handwriting, tilted images)

4. Test AI evaluation:
   - Run same essay multiple times (consistency check)
   - Verify scoring ranges (0-200 per competency)
   - Check feedback quality
   - Test with various essay qualities

5. Test RLS policies:
   - Verify users can only see their own essays
   - Test unauthorized access attempts

6. Performance testing:
   - Measure upload time
   - Measure OCR processing time
   - Measure evaluation time
   - Optimize slow operations

**Deliverables:**
- Test results documented
- Bugs fixed
- Performance optimized

---

### Phase 11: Deployment ✅
**Goal:** Deploy to production

**Tasks:**
1. Prepare for deployment:
   - Review environment variables
   - Set up production Supabase project (if different)
   - Configure production API keys

2. Deploy to Vercel:
   - Connect GitHub repository
   - Configure environment variables
   - Set up custom domain (optional)

3. Set up monitoring:
   - Configure Sentry for error tracking
   - Set up Vercel Analytics
   - Monitor API usage and costs

4. Create documentation:
   - User guide (how to use the app)
   - README.md with setup instructions
   - API documentation (if needed)

5. Implement rate limiting:
   - Limit evaluations per user per hour
   - Prevent API abuse

**Deliverables:**
- Application deployed to production
- Monitoring configured
- Documentation complete

---

## Key Implementation Notes

### File Structure
```
enem-essay-corrector/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── auth/callback/
│   ├── dashboard/
│   ├── upload/
│   ├── essays/
│   │   └── [id]/
│   │       ├── transcription/
│   │       └── results/
│   ├── api/
│   │   ├── upload/
│   │   ├── ocr/
│   │   ├── evaluate/
│   │   └── essays/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── upload/
│   ├── essays/
│   ├── results/
│   └── layout/
├── lib/
│   ├── supabase/
│   ├── services/
│   └── utils/
├── types/
│   └── index.ts
├── middleware.ts
└── .env.local
```

### Type Definitions
Create comprehensive TypeScript types for:
- User
- Essay
- Evaluation
- EvaluationCriteria
- API responses

### Error Handling Strategy
- Use try-catch blocks in all API routes
- Return structured error responses
- Log errors to console (and Sentry in production)
- Display user-friendly error messages

### Security Checklist
- ✅ Environment variables not committed
- ✅ RLS policies on all tables
- ✅ API routes validate authentication
- ✅ File upload validation (type, size)
- ✅ Rate limiting on expensive operations
- ✅ Signed URLs for image access

### Performance Optimization
- Use Next.js Image component for optimized images
- Implement loading states for better UX
- Cache evaluation criteria
- Consider implementing a job queue for long operations

---

## Success Criteria

The implementation is complete when:
1. ✅ Users can sign in with Google
2. ✅ Users can upload essay images
3. ✅ OCR successfully extracts text from images
4. ✅ AI provides detailed evaluation based on ENEM criteria
5. ✅ Users can view all their essays and evaluations
6. ✅ Application is deployed and accessible
7. ✅ No critical bugs or security issues
8. ✅ Performance meets targets (< 20 seconds total processing time)

---

## Resources

- **Architecture Document:** `ARCHITECTURE.md`
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Google Vision API:** https://cloud.google.com/vision/docs
- **Gemini API:** https://ai.google.dev/docs
- **ENEM Criteria:** https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem

---

## Questions for Code Mode

Before starting implementation, clarify:
1. Should we implement all phases sequentially, or focus on specific phases first?
2. Are there any specific UI/UX preferences or design system to follow?
3. Should we implement automated tests (unit, integration)?
4. Any specific accessibility requirements (WCAG compliance)?
5. Should we implement analytics tracking from the start?

---

**Document Version:** 1.0  
**Created:** 2025-10-26  
**Status:** Ready for Code Mode