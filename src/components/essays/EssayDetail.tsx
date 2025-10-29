'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Essay, Evaluation } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EvaluationDisplay from '../results/EvaluationDisplay';

interface EssayDetailProps {
  essay: Essay;
  evaluation?: Evaluation | null;
  onDelete?: () => void;
  onTriggerOCR?: () => void;
  onEvaluate?: () => void;
  isTranscribing?: boolean;
}
const statusConfig = {
  uploaded: {
    label: 'Enviada',
    color: 'bg-blue-100 text-blue-800',
    description: 'Aguardando transcrição',
  },
  transcribed: {
    label: 'Transcrita',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Pronta para avaliação',
  },
  evaluated: {
    label: 'Avaliada',
    color: 'bg-green-100 text-green-800',
    description: 'Correção completa',
  },
};
export default function EssayDetail({
  essay,
  evaluation,
  onDelete,
  onTriggerOCR,
  onEvaluate,
  isTranscribing = false,
}: EssayDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const status = statusConfig[essay.status];
  const timeAgo = formatDistanceToNow(new Date(essay.created_at), {
    addSuffix: true,
    locale: ptBR,
  });
  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta redação?')) {
      return;
    }
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete();
      }
    } catch (error) {
      console.error('Error deleting essay:', error);
      toast.error('Erro ao excluir redação. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };
  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      if (onEvaluate) {
        await onEvaluate();
      }
    } catch (error) {
      console.error('Error evaluating essay:', error);
      toast.error('Erro ao avaliar redação. Tente novamente.');
    } finally {
      setIsEvaluating(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {essay.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Criada {timeAgo}</span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{status.description}</p>
        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {essay.status === 'uploaded' && onTriggerOCR && (
            <button
              onClick={onTriggerOCR}
              disabled={isTranscribing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranscribing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Processando...
                </>
              ) : (
                '🔍 Transcrever Texto'
              )}
            </button>
          )}

          {essay.status === 'transcribed' && onEvaluate && (
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Avaliando...
                </>
              ) : (
                '✨ Avaliar Redação'
              )}
            </button>
          )}

          {essay.status === 'evaluated' && evaluation && (
            <a
              href="#evaluation-section"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium inline-block"
            >
              📊 Ver Avaliação Completa
            </a>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Excluindo...' : '🗑️ Excluir'}
            </button>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Imagem da Redação
        </h2>
        <div className="relative w-full aspect-[3/4] max-w-2xl mx-auto bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={essay.image_url}
            alt={essay.title}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Transcription */}
      {essay.transcription && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Texto Transcrito
          </h2>
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {essay.transcription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Transcription Message */}
      {!essay.transcription && essay.status === 'uploaded' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Texto Transcrito
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Texto ainda não transcrito
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Clique em "Transcrever Texto" para extrair o texto da imagem.
            </p>
          </div>
        </div>
      )}

      {/* Evaluation Results */}
      {evaluation && (
        <div id="evaluation-section" className="mt-6 scroll-mt-20">
          <EvaluationDisplay evaluation={evaluation} essay={essay} />
        </div>
      )}

      {/* No Evaluation Message */}
      {!evaluation && essay.status === 'transcribed' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Avaliação
          </h2>
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Redação ainda não avaliada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Clique em "Avaliar Redação" para receber feedback detalhado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}