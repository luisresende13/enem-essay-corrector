# Migration 001: Add Raw Transcription Column

**Date:** 2025-10-26
**Author:** Roo

## Description

This migration adds the `raw_transcription` column to the `essays` table. This column will store the initial, uncorrected text output from the Google Vision OCR process, allowing for better auditing and comparison against the reconstructed text provided by Gemini.

## SQL Script

Run the following script in your Supabase SQL Editor to apply the migration.

```sql
-- Add the raw_transcription column to the essays table
ALTER TABLE public.essays
ADD COLUMN raw_transcription TEXT;

-- Add a comment to describe the purpose of the new column
COMMENT ON COLUMN public.essays.raw_transcription IS 'The raw, uncorrected text output from the initial Google Vision OCR process.';
```

## Verification

After running the script, you can verify that the column was added successfully by running:

```sql
-- Check the columns of the essays table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'essays'
AND column_name = 'raw_transcription';
```

You should see one row returned for `raw_transcription` with the data type `text`.