import { createClient } from '@/lib/supabase/client';
import { Essay } from '@/types';

export interface CreateEssayData {
  title: string;
  theme?: string;
  imageUrl: string;
}

export interface CreateEssayWithImagesData {
  title: string;
  theme?: string;
  imagePaths: string[];
}

/**
 * Creates a new essay record in the database
 * @param data - Essay data including title, theme, and image URL
 * @returns The created essay
 */
export async function createEssay(data: CreateEssayData): Promise<Essay> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Create essay record
  const { data: essay, error } = await supabase
    .from('essays')
    .insert({
      user_id: user.id,
      title: data.title,
      image_url: data.imageUrl,
      status: 'uploaded',
    })
    .select()
    .single();

  if (error) {
    console.error('Create essay error:', error);
    throw new Error(`Failed to create essay: ${error.message}`);
  }

  return essay;
}

/**
 * Fetches all essays for the current user
 * @param status - Optional filter by status
 * @returns Array of essays
 */
export async function getUserEssays(
  status?: 'uploaded' | 'transcribed' | 'evaluated'
): Promise<Essay[]> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Build query
  let query = supabase
    .from('essays')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Add status filter if provided
  if (status) {
    query = query.eq('status', status);
  }

  const { data: essays, error } = await query;

  if (error) {
    console.error('Fetch essays error:', error);
    throw new Error(`Failed to fetch essays: ${error.message}`);
  }

  return essays || [];
}

/**
 * Fetches a single essay by ID
 * @param essayId - The essay ID
 * @returns The essay
 */
export async function getEssayById(essayId: string): Promise<Essay> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data: essay, error } = await supabase
    .from('essays')
    .select('*')
    .eq('id', essayId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Fetch essay error:', error);
    throw new Error(`Failed to fetch essay: ${error.message}`);
  }

  return essay;
}

/**
 * Updates an essay's status
 * @param essayId - The essay ID
 * @param status - The new status
 */
export async function updateEssayStatus(
  essayId: string,
  status: 'uploaded' | 'transcribed' | 'evaluated'
): Promise<void> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('essays')
    .update({ status })
    .eq('id', essayId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Update essay status error:', error);
    throw new Error(`Failed to update essay status: ${error.message}`);
  }
}

/**
 * Deletes an essay
 * @param essayId - The essay ID
 */
export async function deleteEssay(essayId: string): Promise<void> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('essays')
    .delete()
    .eq('id', essayId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete essay error:', error);
    throw new Error(`Failed to delete essay: ${error.message}`);
  }
}

/**
 * Updates an essay's transcription
 * @param essayId - The essay ID
 * @param transcription - The transcribed text
 */
export async function updateEssayTranscription(
  essayId: string,
  transcription: string
): Promise<void> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('essays')
    .update({
      transcription,
      status: 'transcribed'
    })
    .eq('id', essayId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Update transcription error:', error);
    throw new Error(`Failed to update transcription: ${error.message}`);
  }
}