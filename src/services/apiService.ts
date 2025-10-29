import { supabase } from './supabaseClient';
import { Essay } from '../types';

export const uploadEssay = async (file: File, userId: string, metadata: { title: string; theme?: string }): Promise<Essay> => {
  const bucketName = 'essay-images';
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  
  console.log(`Starting upload for: ${file.name}`);
  console.log(`User ID: ${userId}`);
  console.log(`File path: ${filePath}`);
  console.log(`Bucket: ${bucketName}`);

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload workflow error:', uploadError);
    throw new Error(`Storage error: ${uploadError.message}`);
  }

  console.log('Upload successful, getting public URL...');

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  const { data, error: insertError } = await supabase
    .from('essays')
    .insert({
      user_id: userId,
      title: metadata.title,
      image_url: publicUrl,
      status: 'uploaded',
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Database error: ${insertError.message}`);
  }

  return data as Essay;
};

export const getEssays = async (userId: string): Promise<(Essay & { evaluation: { overall_score: number } | null })[]> => {
  const { data, error } = await supabase
    .from('essays')
    .select(`
      *,
      evaluation:evaluations (
        overall_score
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  const essays = data.map(essay => ({
    ...essay,
    evaluation: Array.isArray(essay.evaluation) ? essay.evaluation[0] : essay.evaluation,
  }));

  return essays as (Essay & { evaluation: { overall_score: number } | null })[];
};

export const getEssay = async (essayId: string): Promise<Essay | null> => {
  const { data, error } = await supabase
    .from('essays')
    .select('*')
    .eq('id', essayId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // PostgREST error for no rows found
      return null;
    }
    throw new Error(`Database error: ${error.message}`);
  }

  return data as Essay;
};

export const updateEssay = async (essayId: string, data: Partial<Essay>): Promise<Essay> => {
  const { data: updatedData, error } = await supabase
    .from('essays')
    .update(data)
    .eq('id', essayId)
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return updatedData as Essay;
};

export const createEvaluation = async (evaluationData: any): Promise<any> => {
  const { data, error } = await supabase
    .from('evaluations')
    .insert(evaluationData)
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data;
};

export const getEvaluation = async (essayId: string): Promise<any | null> => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('essay_id', essayId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Database error: ${error.message}`);
  }

  return data;
};

export const deleteEssay = async (essayId: string): Promise<void> => {
  const { error } = await supabase
    .from('essays')
    .delete()
    .eq('id', essayId);

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};