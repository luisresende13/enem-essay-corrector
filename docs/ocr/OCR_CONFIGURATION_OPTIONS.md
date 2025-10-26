# OCR Configuration Parameters - Tweakable Options

## Available Parameters in Google Cloud Vision API

### 1. **Language Hints** ⭐ (Already Implemented)
```typescript
imageContext: {
  languageHints: ['pt', 'en']
}
```
**Impact:** HIGH - 20-40% accuracy improvement
**Tweakable Values:**
- `['pt']` - Portuguese only (strictest)
- `['pt', 'en']` - Portuguese + English (current - recommended)
- `['pt', 'en', 'es']` - Add Spanish if needed
- Order matters: first language gets priority

---

### 2. **Crop Hints** (Not Implemented)
```typescript
imageContext: {
  cropHintsParams: {
    aspectRatios: [1.0, 1.5, 2.0]  // Preferred aspect ratios
  }
}
```
**Impact:** MEDIUM - Helps focus on text regions
**Use Case:** When images have non-text areas (borders, backgrounds)
**Tweakable Values:**
- Aspect ratios: `[0.8, 1.0, 1.2]` for portrait documents
- Aspect ratios: `[1.5, 1.77, 2.0]` for landscape documents

---

### 3. **Text Detection Parameters** (Not Implemented)
```typescript
imageContext: {
  textDetectionParams: {
    enableTextDetectionConfidenceScore: true,
    advancedOcrOptions: ['LEGACY_CLOUD_TEXT']  // or 'BUILTIN_STABLE'
  }
}
```
**Impact:** MEDIUM - Better confidence scores and detection
**Tweakable Values:**
- `enableTextDetectionConfidenceScore: true` - Get per-word confidence
- `advancedOcrOptions`:
  - `'LEGACY_CLOUD_TEXT'` - Original OCR engine
  - `'BUILTIN_STABLE'` - Newer, more stable engine (default)

---

### 4. **Page Segmentation Mode** (Not Directly Available in Node.js)
**Note:** This is more available in Tesseract OCR, but Vision API handles this automatically.
**Impact:** LOW - API handles this well by default

---

### 5. **Image Quality Parameters** (Pre-processing)
Not part of Vision API request, but can be done before sending:
```typescript
// Image preprocessing options (would need implementation)
{
  dpi: 300,              // Higher DPI = better quality
  contrast: 1.2,         // Increase contrast
  brightness: 1.0,       // Adjust brightness
  denoise: true,         // Remove noise
  deskew: true,          // Straighten text
  binarize: true         // Convert to black/white
}
```
**Impact:** HIGH - 30-50% improvement for poor quality images
**Requires:** Image processing library (sharp, jimp, etc.)

---

### 6. **Batch Processing Parameters**
```typescript
{
  requests: [
    { /* request 1 */ },
    { /* request 2 */ },
    // ... up to 16 requests
  ],
  parent: 'projects/PROJECT_ID/locations/LOCATION'  // For regional processing
}
```
**Impact:** LOW on accuracy, HIGH on performance
**Tweakable Values:**
- Batch size: 1-16 images per request
- Location: 'us', 'eu', 'asia' for regional processing

---

### 7. **Feature-Specific Parameters**
```typescript
features: [{
  type: 'DOCUMENT_TEXT_DETECTION',
  maxResults: 50,        // Max number of results
  model: 'builtin/stable' // or 'builtin/latest'
}]
```
**Impact:** LOW-MEDIUM
**Tweakable Values:**
- `maxResults`: 1-100 (default: 10)
- `model`:
  - `'builtin/stable'` - Stable, tested model
  - `'builtin/latest'` - Latest features, may be less stable

---

## Recommended Configuration for ENEM Essays

### Current Configuration (Basic)
```typescript
const OCR_CONFIG = {
  languageHints: ['pt', 'en'],
  featureType: 'DOCUMENT_TEXT_DETECTION',
};
```

### Enhanced Configuration (Recommended)
```typescript
const OCR_CONFIG = {
  // Language configuration
  languageHints: ['pt', 'en'],
  
  // Feature configuration
  features: [{
    type: 'DOCUMENT_TEXT_DETECTION',
    maxResults: 50,
    model: 'builtin/stable'
  }],
  
  // Text detection parameters
  textDetectionParams: {
    enableTextDetectionConfidenceScore: true,
  },
  
  // Crop hints for document focus
  cropHintsParams: {
    aspectRatios: [0.8, 1.0, 1.2]  // Portrait document ratios
  }
};
```

### Advanced Configuration (Maximum Accuracy)
```typescript
const OCR_CONFIG = {
  // Strict Portuguese priority
  languageHints: ['pt'],
  
  // Enhanced feature settings
  features: [{
    type: 'DOCUMENT_TEXT_DETECTION',
    maxResults: 100,
    model: 'builtin/stable'
  }],
  
  // Advanced text detection
  textDetectionParams: {
    enableTextDetectionConfidenceScore: true,
  },
  
  // Document-focused crop hints
  cropHintsParams: {
    aspectRatios: [0.8, 1.0, 1.2]
  },
  
  // Image preprocessing (requires implementation)
  preprocessing: {
    dpi: 300,
    contrast: 1.2,
    denoise: true,
    deskew: true
  }
};
```

---

## Priority Ranking for Implementation

### Tier 1: Already Implemented ✅
1. **Language Hints** - `['pt', 'en']`

### Tier 2: High Impact, Easy to Implement
2. **Text Detection Confidence** - `enableTextDetectionConfidenceScore: true`
3. **Model Selection** - `model: 'builtin/stable'`
4. **Max Results** - `maxResults: 50`

### Tier 3: Medium Impact, Moderate Effort
5. **Crop Hints** - `aspectRatios: [0.8, 1.0, 1.2]`
6. **Batch Processing** - Process multiple images efficiently

### Tier 4: High Impact, High Effort
7. **Image Preprocessing** - Requires additional library (sharp/jimp)
   - DPI enhancement
   - Contrast adjustment
   - Denoising
   - Deskewing

---

## Testing Different Configurations

### Test Matrix
```typescript
// Test 1: Strict Portuguese only
languageHints: ['pt']

// Test 2: Portuguese + English (current)
languageHints: ['pt', 'en']

// Test 3: With confidence scores
textDetectionParams: { enableTextDetectionConfidenceScore: true }

// Test 4: With crop hints
cropHintsParams: { aspectRatios: [0.8, 1.0, 1.2] }

// Test 5: Maximum results
features: [{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 100 }]
```

### Metrics to Track
- Accuracy percentage
- Confidence scores
- Processing time
- Character error rate
- Word error rate

---

## Environment-Based Configuration

```typescript
const OCR_CONFIG = {
  // Development: Faster, less strict
  development: {
    languageHints: ['pt', 'en'],
    maxResults: 10,
  },
  
  // Production: Maximum accuracy
  production: {
    languageHints: ['pt'],
    maxResults: 100,
    textDetectionParams: {
      enableTextDetectionConfidenceScore: true,
    },
    cropHintsParams: {
      aspectRatios: [0.8, 1.0, 1.2]
    }
  }
};
```

---

## Cost Considerations

Different configurations have different costs:
- **Basic detection:** $1.50 per 1000 images
- **With additional features:** Same price (features are included)
- **Batch processing:** More efficient, same per-image cost
- **Image preprocessing:** No additional Vision API cost (local processing)

---

## References

- [Vision API Image Context](https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#ImageContext)
- [Text Detection Parameters](https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#TextDetectionParams)
- [Feature Types](https://cloud.google.com/vision/docs/reference/rest/v1/Feature)
- [Best Practices](https://cloud.google.com/vision/docs/best-practices)