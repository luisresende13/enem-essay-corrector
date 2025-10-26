// Database Types
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Essay {
  id: string;
  user_id: string;
  title: string;
  image_url: string;
  transcription: string | null;
  status: 'uploaded' | 'transcribed' | 'evaluated';
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: string;
  essay_id: string;
  overall_score: number;
  competency_1_score: number;
  competency_2_score: number;
  competency_3_score: number;
  competency_4_score: number;
  competency_5_score: number;
  competency_1_feedback: string;
  competency_2_feedback: string;
  competency_3_feedback: string;
  competency_4_feedback: string;
  competency_5_feedback: string;
  general_feedback: string;
  created_at: string;
}

export interface EvaluationCriteria {
  id: number;
  competency_number: number;
  title: string;
  description: string;
  max_score: number;
}

// API Response Types
export interface UploadResponse {
  essayId: string;
  imageUrl: string;
}

export interface OCRResponse {
  transcription: string;
  confidence: number;
}

export interface CompetencyScore {
  number: number;
  title: string;
  score: number;
  feedback: string;
}

export interface EvaluationResponse {
  evaluationId: string;
  overallScore: number;
  competencies: CompetencyScore[];
  generalFeedback: string;
}

export interface EssayListItem {
  id: string;
  title: string;
  status: 'uploaded' | 'transcribed' | 'evaluated';
  createdAt: string;
  evaluation?: {
    overallScore: number;
  };
}

export interface EssayDetail extends Essay {
  evaluation?: Evaluation;
}

// Gemini API Response Type
export interface GeminiEvaluationResult {
  competency_1: {
    score: number;
    feedback: string;
  };
  competency_2: {
    score: number;
    feedback: string;
  };
  competency_3: {
    score: number;
    feedback: string;
  };
  competency_4: {
    score: number;
    feedback: string;
  };
  competency_5: {
    score: number;
    feedback: string;
  };
  general_feedback: string;
}

// Error Types
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}