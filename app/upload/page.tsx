'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadMultipleImages } from '@/lib/services/storage';
import { createEssay } from '@/lib/services/essays';
import FileUpload from '@/components/upload/FileUpload';
import ImagePreview from '@/components/upload/ImagePreview';
import EssayForm from '@/components/upload/EssayForm';
import UploadProgress from '@/components/upload/UploadProgress';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setErrorMessage(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData: { title: string; theme: string }) => {
    if (files.length === 0) {
      setErrorMessage('Please select at least one file to upload');
      return;
    }

    setIsSubmitting(true);
    setUploadStatus('uploading');
    setErrorMessage(null);

    try {
      // Get current user
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('You must be logged in to upload essays');
      }

      // Upload images to storage
      setUploadProgress({ current: 0, total: files.length });
      
      const uploadResults = await uploadMultipleImages(
        files,
        user.id,
        (current, total) => {
          setUploadProgress({ current, total });
        }
      );

      // For now, we'll use the first image URL as the main image_url
      // In a future phase, we can extend the database to support multiple images
      const mainImageUrl = uploadResults[0].publicUrl;

      // Create essay record
      setUploadStatus('processing');
      const essay = await createEssay({
        title: formData.title,
        theme: formData.theme || undefined,
        imageUrl: mainImageUrl,
      });

      // Success!
      setUploadStatus('complete');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred during upload'
      );
      setIsSubmitting(false);
    }
  };

  const canSubmit = files.length > 0 && !isSubmitting;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Upload Essay</h1>
          <p className="mt-2 text-gray-600">
            Upload your essay images for AI-powered evaluation
          </p>
        </div>

        {/* Upload Progress */}
        {uploadStatus !== 'idle' && (
          <div className="mb-8">
            <UploadProgress
              current={uploadProgress.current}
              total={uploadProgress.total}
              status={uploadStatus}
              message={errorMessage || undefined}
            />
          </div>
        )}

        {/* Main Content */}
        {uploadStatus === 'idle' && (
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Select Essay Images
              </h2>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                maxFiles={5}
                disabled={isSubmitting}
              />
            </div>

            {/* Image Preview Section */}
            {files.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Review Selected Files
                </h2>
                <ImagePreview
                  files={files}
                  onRemove={handleRemoveFile}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Essay Form Section */}
            {files.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  3. Essay Details
                </h2>
                <EssayForm
                  onSubmit={handleSubmit}
                  disabled={!canSubmit}
                />
              </div>
            )}

            {/* Error Message */}
            {errorMessage && uploadStatus === 'idle' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Success Actions */}
        {uploadStatus === 'complete' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Upload Successful!
            </h3>
            <p className="text-gray-600 mb-6">
              Redirecting to dashboard...
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}