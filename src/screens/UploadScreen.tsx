import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import * as apiService from '../services/apiService';
import * as visionService from '../services/visionService';
import * as geminiService from '../services/geminiService';
import FileUpload from '../components/upload/FileUpload';
import ImagePreview from '../components/upload/ImagePreview';
import EssayForm from '../components/upload/EssayForm';
import UploadProgress from '../components/upload/UploadProgress';

type UploadStatus = 'idle' | 'uploading' | 'transcribing' | 'reconstructing' | 'saving' | 'complete' | 'error';

export default function UploadScreen() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEssayId, setNewEssayId] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setErrorMessage(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData: { title: string; theme: string; transcribe: boolean }) => {
    if (files.length === 0) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to upload essays');
      }

      const file = files[0];

      setUploadStatus('uploading');
      const newEssay = await apiService.uploadEssay(file, user.id, {
        title: formData.title,
        theme: formData.theme,
      });

      if (!newEssay || !newEssay.image_url) {
        throw new Error('Failed to upload essay and create record.');
      }

      if (formData.transcribe) {
        setUploadStatus('transcribing');
        const rawText = await visionService.extractTextFromImage(newEssay.image_url);

        setUploadStatus('reconstructing');
        const reconstructedText = await geminiService.reconstructTranscription(rawText);

        setUploadStatus('saving');
        await apiService.updateEssay(newEssay.id, {
          transcription: reconstructedText,
          raw_transcription: rawText,
          status: 'transcribed',
        });
      } else {
        setUploadStatus('saving');
        await apiService.updateEssay(newEssay.id, {
          status: 'uploaded',
        });
      }

      setNewEssayId(newEssay.id);
      setUploadStatus('complete');

    } catch (error) {
      console.error('Upload workflow error:', error);
      setUploadStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during the upload process'
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
            onClick={() => navigate('/dashboard')}
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
            Voltar para o Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Enviar Redação</h1>
          <p className="mt-2 text-gray-600">
            Envie a imagem da sua redação para avaliação por IA
          </p>
        </div>

        {/* Upload Progress */}
        {uploadStatus !== 'idle' && (
          <div className="mb-8">
            <UploadProgress
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
                1. Selecione a Imagem da Redação
              </h2>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                maxFiles={1}
                disabled={isSubmitting}
              />
            </div>

            {/* Image Preview Section */}
            {files.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Revise o Arquivo Selecionado
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
                  3. Detalhes da Redação
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
              Upload Realizado com Sucesso!
            </h3>
            <p className="text-gray-600 mb-6">
              Sua redação foi enviada e está sendo processada.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ir para o Dashboard
              </button>
              {newEssayId && (
                <button
                  onClick={() => navigate(`/essays/${newEssayId}`)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Minha Redação
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}