# Database Setup Guide

This document contains all SQL scripts needed to set up the Supabase database for the ENEM Essay Correction application.

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each section below in order
4. Verify tables are created in the Table Editor

---

## Migrations

After the initial setup, apply any migrations from the `docs/migrations` directory in numerical order.

- **[001_ADD_RAW_TRANSCRIPTION.md](../migrations/001_ADD_RAW_TRANSCRIPTION.md)**

---

## 1. Enable UUID Extension

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 2. User Profiles Table

```sql
-- Extended user profile information
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. Essays Table

```sql
-- Essays submitted by users
CREATE TABLE public.essays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  transcription TEXT,
  status TEXT CHECK (status IN ('uploaded', 'transcribed', 'evaluated')) DEFAULT 'uploaded',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX essays_user_id_idx ON public.essays(user_id);
CREATE INDEX essays_status_idx ON public.essays(status);
CREATE INDEX essays_created_at_idx ON public.essays(created_at DESC);

-- Enable RLS
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own essays"
  ON public.essays FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own essays"
  ON public.essays FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own essays"
  ON public.essays FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own essays"
  ON public.essays FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_essays_updated_at
  BEFORE UPDATE ON public.essays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 4. Evaluations Table

```sql
-- AI evaluations of essays
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  essay_id UUID REFERENCES public.essays ON DELETE CASCADE NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 1000),
  competency_1_score INTEGER CHECK (competency_1_score >= 0 AND competency_1_score <= 200),
  competency_2_score INTEGER CHECK (competency_2_score >= 0 AND competency_2_score <= 200),
  competency_3_score INTEGER CHECK (competency_3_score >= 0 AND competency_3_score <= 200),
  competency_4_score INTEGER CHECK (competency_4_score >= 0 AND competency_4_score <= 200),
  competency_5_score INTEGER CHECK (competency_5_score >= 0 AND competency_5_score <= 200),
  competency_1_feedback TEXT,
  competency_2_feedback TEXT,
  competency_3_feedback TEXT,
  competency_4_feedback TEXT,
  competency_5_feedback TEXT,
  general_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX evaluations_essay_id_idx ON public.evaluations(essay_id);

-- Enable RLS
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view evaluations of their own essays
CREATE POLICY "Users can view evaluations of own essays"
  ON public.evaluations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.essays
      WHERE essays.id = evaluations.essay_id
      AND essays.user_id = auth.uid()
    )
  );

-- RLS Policy: Only system can insert evaluations (via service role)
CREATE POLICY "Service role can insert evaluations"
  ON public.evaluations FOR INSERT
  WITH CHECK (true);
```

---

## 5. Evaluation Criteria Table (Reference Data)

```sql
-- ENEM evaluation criteria reference
CREATE TABLE public.evaluation_criteria (
  id SERIAL PRIMARY KEY,
  competency_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 200
);

-- Insert ENEM criteria
INSERT INTO public.evaluation_criteria (competency_number, title, description, max_score) VALUES
(1, 'Domínio da escrita formal', 'Demonstrar domínio da modalidade escrita formal da língua portuguesa', 200),
(2, 'Compreensão do tema', 'Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo', 200),
(3, 'Argumentação', 'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista', 200),
(4, 'Coesão textual', 'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação', 200),
(5, 'Proposta de intervenção', 'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos', 200);

-- Make table read-only for regular users
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view criteria"
  ON public.evaluation_criteria FOR SELECT
  TO authenticated
  USING (true);
```

---

## 6. Storage Bucket Setup

Run this in the SQL Editor to create the storage bucket programmatically, or create it manually in the Supabase Storage UI.

```sql
-- Create storage bucket for essay images
INSERT INTO storage.buckets (id, name, public)
VALUES ('essay-images', 'essay-images', false);

-- Storage policies
CREATE POLICY "Users can upload own essay images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'essay-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own essay images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'essay-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own essay images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'essay-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Note:** If the above storage policies don't work, create them manually in the Supabase Storage UI:
- Bucket name: `essay-images`
- Public: No (private)
- Policies: Allow authenticated users to upload/view/delete files in their own folder (folder name = user_id)

---

## 7. Useful Views (Optional)

```sql
-- View to get essays with their evaluations
CREATE VIEW public.essays_with_evaluations AS
SELECT 
  e.id,
  e.user_id,
  e.title,
  e.image_url,
  e.transcription,
  e.status,
  e.created_at,
  e.updated_at,
  ev.id as evaluation_id,
  ev.overall_score,
  ev.competency_1_score,
  ev.competency_2_score,
  ev.competency_3_score,
  ev.competency_4_score,
  ev.competency_5_score,
  ev.general_feedback,
  ev.created_at as evaluated_at
FROM public.essays e
LEFT JOIN public.evaluations ev ON e.id = ev.essay_id;

-- Grant access to the view
GRANT SELECT ON public.essays_with_evaluations TO authenticated;
```

---

## 8. Database Functions (Optional Helpers)

```sql
-- Function to get user's essay count
CREATE OR REPLACE FUNCTION get_user_essay_count(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.essays
  WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get user's average score
CREATE OR REPLACE FUNCTION get_user_average_score(user_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT AVG(ev.overall_score)
  FROM public.evaluations ev
  JOIN public.essays e ON ev.essay_id = e.id
  WHERE e.user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;
```

---

## 9. Verification Queries

After running all migrations, verify the setup:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check evaluation criteria data
SELECT * FROM public.evaluation_criteria ORDER BY competency_number;
```

---

## 10. Sample Data (For Testing)

```sql
-- Insert sample user profile (replace with your actual user ID from auth.users)
-- Get your user ID: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Example:
-- INSERT INTO public.user_profiles (id, full_name)
-- VALUES ('your-user-id-here', 'Test User');

-- Insert sample essay (for testing)
-- INSERT INTO public.essays (user_id, title, image_url, status)
-- VALUES (
--   'your-user-id-here',
--   'Redação de Teste',
--   'https://example.com/sample.jpg',
--   'uploaded'
-- );
```

---

## Troubleshooting

### Issue: RLS policies not working
**Solution:** Ensure you're using the correct Supabase client (authenticated) and that `auth.uid()` returns the correct user ID.

### Issue: Storage policies failing
**Solution:** Create storage bucket manually in Supabase UI and set up policies there. The folder structure should be: `essay-images/{user_id}/{filename}`

### Issue: Cannot insert evaluations
**Solution:** Use the Supabase service role key (not anon key) when inserting evaluations from API routes.

### Issue: Triggers not firing
**Solution:** Verify the trigger function exists and is attached to the correct table.

---

## Next Steps

After completing database setup:
1. ✅ Verify all tables exist
2. ✅ Test RLS policies (try accessing another user's data)
3. ✅ Create storage bucket and test upload
4. ✅ Proceed to application development

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-26  
**Status:** Ready for Implementation