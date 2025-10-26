import { createClient } from '@/lib/supabase/server';
import { evaluateWithGemini, calculateOverallScore } from './gemini';
import { Evaluation, GeminiEvaluationResult } from '@/types';

/**
 * Evaluates an essay using AI and stores the result in the database
 * @param essayId - The ID of the essay to evaluate
 * @returns The created evaluation record
 */
export async function evaluateEssay(essayId: string): Promise<Evaluation> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Fetch the essay
  const { data: essay, error: essayError } = await supabase
    .from('essays')
    .select('*')
    .eq('id', essayId)
    .eq('user_id', user.id)
    .single();

  if (essayError || !essay) {
    throw new Error('Essay not found or access denied');
  }

  // Check if essay has transcription
  if (!essay.transcription || essay.transcription.trim().length === 0) {
    throw new Error('Essay must be transcribed before evaluation');
  }

  // Check if essay is already evaluated
  if (essay.status === 'evaluated') {
    // Return existing evaluation
    const { data: existingEvaluation, error: existingError } = await supabase
      .from('evaluations')
      .select('*')
      .eq('essay_id', essayId)
      .single();

    if (existingError) {
      throw new Error('Failed to fetch existing evaluation');
    }

    return existingEvaluation;
  }

  // Evaluate with Gemini
  let geminiResult: GeminiEvaluationResult;
  try {
    geminiResult = await evaluateWithGemini(essay.transcription);
  } catch (error) {
    console.error('Gemini evaluation error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to evaluate essay with AI'
    );
  }

  // Calculate overall score
  const overallScore = calculateOverallScore(geminiResult);

  // Create evaluation record
  const { data: evaluation, error: evaluationError } = await supabase
    .from('evaluations')
    .insert({
      essay_id: essayId,
      overall_score: overallScore,
      competency_1_score: geminiResult.competency_1.score,
      competency_2_score: geminiResult.competency_2.score,
      competency_3_score: geminiResult.competency_3.score,
      competency_4_score: geminiResult.competency_4.score,
      competency_5_score: geminiResult.competency_5.score,
      competency_1_feedback: geminiResult.competency_1.feedback,
      competency_2_feedback: geminiResult.competency_2.feedback,
      competency_3_feedback: geminiResult.competency_3.feedback,
      competency_4_feedback: geminiResult.competency_4.feedback,
      competency_5_feedback: geminiResult.competency_5.feedback,
      general_feedback: geminiResult.general_feedback,
    })
    .select()
    .single();

  if (evaluationError || !evaluation) {
    console.error('Database error:', evaluationError);
    throw new Error('Failed to save evaluation to database');
  }

  // Update essay status to 'evaluated'
  const { error: updateError } = await supabase
    .from('essays')
    .update({ status: 'evaluated', updated_at: new Date().toISOString() })
    .eq('id', essayId);

  if (updateError) {
    console.error('Failed to update essay status:', updateError);
    // Don't throw here, evaluation was saved successfully
  }

  return evaluation;
}

/**
 * Fetches an evaluation for a specific essay
 * @param essayId - The ID of the essay
 * @returns The evaluation record or null if not found
 */
export async function getEvaluation(essayId: string): Promise<Evaluation | null> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Verify essay belongs to user
  const { data: essay, error: essayError } = await supabase
    .from('essays')
    .select('id')
    .eq('id', essayId)
    .eq('user_id', user.id)
    .single();

  if (essayError || !essay) {
    throw new Error('Essay not found or access denied');
  }

  // Fetch evaluation
  const { data: evaluation, error: evaluationError } = await supabase
    .from('evaluations')
    .select('*')
    .eq('essay_id', essayId)
    .single();

  if (evaluationError) {
    if (evaluationError.code === 'PGRST116') {
      // No evaluation found
      return null;
    }
    throw new Error('Failed to fetch evaluation');
  }

  return evaluation;
}

/**
 * Deletes an evaluation (useful for re-evaluation)
 * @param essayId - The ID of the essay
 */
export async function deleteEvaluation(essayId: string): Promise<void> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Verify essay belongs to user
  const { data: essay, error: essayError } = await supabase
    .from('essays')
    .select('id')
    .eq('id', essayId)
    .eq('user_id', user.id)
    .single();

  if (essayError || !essay) {
    throw new Error('Essay not found or access denied');
  }

  // Delete evaluation
  const { error: deleteError } = await supabase
    .from('evaluations')
    .delete()
    .eq('essay_id', essayId);

  if (deleteError) {
    throw new Error('Failed to delete evaluation');
  }

  // Update essay status back to 'transcribed'
  const { error: updateError } = await supabase
    .from('essays')
    .update({ status: 'transcribed', updated_at: new Date().toISOString() })
    .eq('id', essayId);

  if (updateError) {
    console.error('Failed to update essay status:', updateError);
  }
}