/**
 * OCR Service using Google Vision API with Service Account
 * Extracts text from essay images with optimized accuracy settings
 */

import { ImageAnnotatorClient } from '@google-cloud/vision';
import type { google } from '@google-cloud/vision/build/protos/protos';
import { reconstructTranscription } from '@/lib/services/gemini';

interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * OCR Configuration optimized for maximum accuracy on handwritten Portuguese essays
 * Based on analysis of ENEM essay OCR results showing issues with:
 * - Handwritten text recognition
 * - Portuguese special characters (ã, ç, õ, etc.)
 * - Word spacing and boundaries
 */
const OCR_CONFIG = {
  // Strict Portuguese language priority for ENEM essays
  // Using only 'pt' for maximum accuracy on Portuguese-specific characters
  languageHints: ['pt'],
  
  // Feature configuration for maximum accuracy
  features: {
    type: 'DOCUMENT_TEXT_DETECTION' as const,
    maxResults: 150,  // Comprehensive text detection
    model: 'builtin/latest',  // Use stable, well-tested model
  },
  
  // Enable per-word confidence scores for quality assessment
  textDetectionParams: {
    enableTextDetectionConfidenceScore: true,
  },
  
  // Crop hints optimized for portrait document format (typical essay format)
  cropHintsParams: {
    aspectRatios: [0.8, 1.0, 1.2],  // Portrait document ratios
  },
};

/**
 * Get Vision API client with service account credentials
 */
function getVisionClient() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS not configured. Please set it in .env.local');
  }

  return new ImageAnnotatorClient({
    keyFilename: credentialsPath,
  });
}

/**
 * Extracts text from an image using Google Vision API with enhanced accuracy
 * Uses explicit request configuration matching Python implementation
 * @param imageUrl - Public URL of the image
 * @returns Extracted text and confidence score
 */
export async function extractTextFromImage(
  imageUrl: string
): Promise<OCRResult> {
  try {
    const client = getVisionClient();

    // Build explicit request with language hints for better accuracy
    // This matches the Python implementation's approach
    const request: google.cloud.vision.v1.IAnnotateImageRequest = {
      image: {
        source: {
          imageUri: imageUrl,
        },
      },
      features: [
        {
          type: OCR_CONFIG.features.type,
          maxResults: OCR_CONFIG.features.maxResults,
          model: OCR_CONFIG.features.model,
        },
      ],
      imageContext: {
        languageHints: OCR_CONFIG.languageHints,
        textDetectionParams: OCR_CONFIG.textDetectionParams,
        cropHintsParams: OCR_CONFIG.cropHintsParams,
      },
    };

    // Call Google Vision API with explicit request configuration
    // Using batchAnnotateImages which accepts the request object
    const [batchResult] = await client.batchAnnotateImages({
      requests: [request],
    });
    
    // Get the first (and only) response
    const result = batchResult.responses?.[0];
    
    if (!result) {
      throw new Error('No response from Vision API');
    }
    
    // Check for API errors
    if (result.error?.message) {
      throw new Error(`Vision API error: ${result.error.message}`);
    }

    const fullTextAnnotation = result.fullTextAnnotation;

    if (!fullTextAnnotation || !fullTextAnnotation.text) {
      throw new Error('No text found in image');
    }

    // Calculate average confidence from pages
    let totalConfidence = 0;
    let confidenceCount = 0;

    if (fullTextAnnotation.pages) {
      fullTextAnnotation.pages.forEach((page) => {
        if (page.confidence) {
          totalConfidence += page.confidence;
          confidenceCount++;
        }
      });
    }

    const confidence =
      confidenceCount > 0 ? totalConfidence / confidenceCount : 0.9;

    return {
      text: fullTextAnnotation.text.trim(),
      confidence: Math.round(confidence * 100) / 100,
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw error;
  }
}

/**
 * Process OCR for an essay using a two-step approach:
 * 1. Extract raw text with Google Vision
 * 2. Reconstruct and correct the text with Gemini
 * @param essayId - The essay ID
 * @param imageUrl - Public URL of the essay image
 * @returns Both the raw and the reconstructed (corrected) transcriptions
 */
export async function processEssayOCR(
  essayId: string,
  imageUrl: string
): Promise<{ rawTranscription: string; reconstructedTranscription: string }> {
  try {
    // Step 1: Get raw transcription from Google Vision
    const ocrResult = await extractTextFromImage(imageUrl);
    if (!ocrResult.text) {
      throw new Error('No text extracted from image');
    }
    const rawTranscription = ocrResult.text;

    // Step 2: Reconstruct the text using Gemini
    console.log(`Starting Gemini reconstruction for essay ${essayId}...`);
    const reconstructedTranscription = await reconstructTranscription(
      rawTranscription
    );
    console.log(`Gemini reconstruction finished for essay ${essayId}.`);

    return { rawTranscription, reconstructedTranscription };
  } catch (error) {
    console.error(`OCR processing error for essay ${essayId}:`, error);
    throw error;
  }
}