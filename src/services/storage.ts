import { supabase } from './supabaseClient';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Validates if a file is an allowed image type
 */
export function validateFileType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  return allowedTypes.includes(file.type);
}

/**
 * Validates if a file is within the size limit
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Generates a unique filename with timestamp and random string
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user ID (used for folder organization)
 * @param onProgress - Optional callback for upload progress
 * @returns Upload result with path and public URL
 */
export async function uploadImage(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // Validate file type
  if (!validateFileType(file)) {
    throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.');
  }

  // Validate file size
  if (!validateFileSize(file)) {
    throw new Error('File size exceeds 10MB limit.');
  }

  // Generate unique filename
  const filename = generateUniqueFilename(file.name);
  const filePath = `${userId}/${filename}`;

  try {
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('essay-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('essay-images')
      .getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Storage service error:', error);
    throw error;
  }
}

/**
 * Uploads multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param userId - The user ID
 * @param onProgress - Optional callback for overall progress
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  files: File[],
  userId: string,
  onProgress?: (current: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      const result = await uploadImage(file, userId);
      results.push(result);
      
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Deletes a file from Supabase Storage
 * @param path - The storage path of the file
 */
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('essay-images')
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Deletes multiple files from Supabase Storage
 * @param paths - Array of storage paths
 */
export async function deleteMultipleImages(paths: string[]): Promise<void> {
  const { error } = await supabase.storage
    .from('essay-images')
    .remove(paths);

  if (error) {
    console.error('Delete multiple error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}