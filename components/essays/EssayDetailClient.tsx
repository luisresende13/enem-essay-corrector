'use client';

import { useRouter } from 'next/navigation';
import { Essay, Evaluation } from '@/types';
import EssayDetail from './EssayDetail';

interface EssayDetailClientProps {
  essay: Essay;
  evaluation: Evaluation | null;
}

export default function EssayDetailClient({ essay, evaluation }: EssayDetailClientProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/essays/${essay.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete essay');
      }

      // Redirect to dashboard after successful deletion
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error deleting essay:', error);
      throw error;
    }
  };

  const handleTriggerOCR = async () => {
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ essayId: essay.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process OCR');
      }

      // Refresh the page to show the transcription
      router.refresh();
    } catch (error) {
      console.error('Error processing OCR:', error);
      throw error;
    }
  };

  const handleEvaluate = async () => {
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ essayId: essay.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to evaluate essay');
      }

      // Refresh the page to show the evaluation
      router.refresh();
    } catch (error) {
      console.error('Error evaluating essay:', error);
      throw error;
    }
  };

  return (
    <EssayDetail
      essay={essay}
      evaluation={evaluation}
      onDelete={handleDelete}
      onTriggerOCR={handleTriggerOCR}
      onEvaluate={handleEvaluate}
    />
  );
}