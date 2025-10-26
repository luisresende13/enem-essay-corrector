# Plan: Gemini-Powered OCR Reconstruction

**Objective:** Enhance OCR accuracy by integrating a second step that uses the Gemini 2.5 Pro model to reconstruct and correct the initial text extracted by Google Vision.

## 1. Current OCR Flow

1.  **Client Request:** The frontend calls the `/api/ocr` endpoint with an `essayId`.
2.  **Fetch Essay:** The API route retrieves the essay's `image_url` from the Supabase database.
3.  **Google Vision OCR:** The `processEssayOCR` service sends the image URL to the Google Vision API, which returns the transcribed text.
4.  **Database Update:** The API route saves the returned transcription to the `essays` table in the `transcription` column and updates the status to `transcribed`.
5.  **Client Response:** The final transcription is sent back to the client.

## 2. Proposed Two-Step OCR Flow

1.  **Client Request:** (No change) The frontend calls `/api/ocr`.
2.  **Fetch Essay:** (No change) The API route fetches the essay data.
3.  **Step 1: Initial OCR:** (No change) `processEssayOCR` uses Google Vision to get the "raw" transcription.
4.  **Step 2: Gemini Reconstruction:**
    *   A new service function, `reconstructTranscription`, is called.
    *   This function sends the raw transcription to the Gemini 2.5 Pro API with a specialized prompt.
    *   Gemini returns a corrected, more accurate version of the text.
5.  **Database Update:** The API route now saves **both** transcriptions:
    *   The original Google Vision output is stored in a new `raw_transcription` column.
    *   The improved Gemini output is stored in the existing `transcription` column.
    *   The essay status is updated to `transcribed`.
6.  **Client Response:** The enhanced (reconstructed) transcription is sent to the client for evaluation.

## 3. Implementation Steps

### Step 1: Modify Database Schema

- **Objective:** Add a new column to the `essays` table to store the initial, uncorrected OCR text for auditing and comparison.
- **Action:** Execute the following SQL migration in Supabase.

```sql
ALTER TABLE essays
ADD COLUMN raw_transcription TEXT;

COMMENT ON COLUMN essays.raw_transcription IS 'The raw, uncorrected text output from the initial Google Vision OCR process.';
```

### Step 2: Create Gemini Reconstruction Service

- **Objective:** Implement the logic for calling the Gemini API to reconstruct the text.
- **File:** `lib/services/gemini.ts`
- **Action:** Add a new exported async function `reconstructTranscription`.

```typescript
// In lib/services/gemini.ts

// ... (existing imports)

const RECONSTRUCTION_PROMPT = `
You are a helpful assistant specialized in correcting and reconstructing handwritten Brazilian Portuguese essays from a flawed OCR transcription. Your task is to fix common OCR errors, such as incorrect characters, merged or split words, and inconsistent spacing, while preserving the original author's voice and intent. Do not add or remove content. Return only the corrected text.

OCR Transcription:
"{raw_text}"

Corrected Essay:
`;

export async function reconstructTranscription(rawText: string): Promise<string> {
  // 1. Initialize the Gemini client.
  // 2. Format the RECONSTRUCTION_PROMPT with the rawText.
  // 3. Send the request to the Gemini 2.5 Pro model.
  // 4. Parse the response to extract the corrected text.
  // 5. Return the cleaned, reconstructed text.
  // 6. Implement robust error handling.
}
```

### Step 3: Update the Core OCR Service

- **Objective:** Orchestrate the new two-step process within the main OCR service.
- **File:** `lib/services/ocr.ts`
- **Action:** Modify `processEssayOCR` to call the new Gemini reconstruction function.

```typescript
// In lib/services/ocr.ts

import { reconstructTranscription } from '@/lib/services/gemini'; // 1. Import the new function

// ... (existing code)

export async function processEssayOCR(
  essayId: string,
  imageUrl: string
): Promise<{ rawTranscription: string; reconstructedTranscription: string }> { // 2. Update return type
  try {
    // Step 1: Get raw transcription from Google Vision
    const ocrResult = await extractTextFromImage(imageUrl);
    if (!ocrResult.text) {
      throw new Error('No text extracted from image');
    }
    const rawTranscription = ocrResult.text;

    // Step 2: Reconstruct the text using Gemini
    const reconstructedTranscription = await reconstructTranscription(rawTranscription);

    // 3. Return both versions
    return { rawTranscription, reconstructedTranscription };
  } catch (error) {
    console.error(`OCR processing error for essay ${essayId}:`, error);
    throw error;
  }
}
```

### Step 4: Update the OCR API Endpoint

- **Objective:** Integrate the updated service logic into the API route and handle the new database fields.
- **File:** `app/api/ocr/route.ts`
- **Action:** Modify the `POST` handler.

```typescript
// In app/api/ocr/route.ts

// ... (imports and initial checks)

// Process OCR
console.log('Starting two-step OCR processing for essay:', essayId);
const { rawTranscription, reconstructedTranscription } = await processEssayOCR(essayId, essay.image_url);
console.log('OCR and reconstruction completed.');

// Update essay with both transcriptions
console.log('Updating essay with raw and reconstructed transcriptions...');
const { error: updateError } = await supabase
  .from('essays')
  .update({
    raw_transcription: rawTranscription, // Save the raw text
    transcription: reconstructedTranscription, // Save the corrected text
    status: 'transcribed'
  })
  .eq('id', essayId);

// ... (error handling)

// Return the improved transcription to the client
return NextResponse.json(
  {
    success: true,
    transcription: reconstructedTranscription,
    message: 'Text extracted and reconstructed successfully',
  },
  { status: 200 }
);

// ... (rest of the file)
```

### Step 5: Frontend and Evaluation Considerations

- **No immediate changes are required on the frontend.** The API continues to return the improved transcription in the `transcription` field, which is what the evaluation flow already uses.
- The `EssayDetail` page will automatically display the corrected text, as it reads from the `transcription` column.

## 4. Rollback Plan

- **Database:** The `raw_transcription` column can be safely ignored or removed if the feature is rolled back.
- **Code:** Revert the changes in `ocr.ts`, `gemini.ts`, and `app/api/ocr/route.ts` using version control (Git). The previous logic is self-contained and can be restored easily.