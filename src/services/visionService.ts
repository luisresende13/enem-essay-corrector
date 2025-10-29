const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

const OCR_CONFIG = {
  requests: [
    {
      image: {
        source: {
          imageUri: '',
        },
      },
      features: [
        {
          type: 'DOCUMENT_TEXT_DETECTION',
        },
      ],
      imageContext: {
        languageHints: ['pt-BR'],
      },
    },
  ],
};

export const extractTextFromImage = async (imageUrl: string) => {
  const config = { ...OCR_CONFIG };
  config.requests[0].image.source.imageUri = imageUrl;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Failed to extract text from image.');
  }

  const data = await response.json();
  return data.responses[0].fullTextAnnotation.text;
};