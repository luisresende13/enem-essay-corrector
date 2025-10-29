import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Essay, Evaluation } from '../types';
import * as apiService from '../services/apiService';
import * as geminiService from '../services/geminiService';
import * as visionService from '../services/visionService';
import EssayDetail from '../components/essays/EssayDetail';
import DashboardSkeleton from '../components/layout/DashboardSkeleton';
export default function EssayDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEssayData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const fetchedEssay = await apiService.getEssay(id);
        if (fetchedEssay) {
          setEssay(fetchedEssay);
          if (fetchedEssay.status === 'evaluated') {
            const fetchedEvaluation = await apiService.getEvaluation(id);
            setEvaluation(fetchedEvaluation);
          }
        } else {
          setError('Essay not found.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch essay data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEssayData();
  }, [id]);
  const handleTranscribe = async () => {
    if (!essay || !essay.image_url) {
      alert('Nenhuma imagem de redação encontrada para transcrever.');
      return;
    }
    setIsTranscribing(true);
    setError(null);
    try {
      const rawText = await visionService.extractTextFromImage(essay.image_url);
      const reconstructedText = await geminiService.reconstructTranscription(rawText);
      const updatedEssay = await apiService.updateEssay(essay.id, {
        transcription: reconstructedText,
        raw_transcription: rawText,
        status: 'transcribed',
      });
      setEssay(updatedEssay);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha na transcrição. Tente novamente.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  };
  const handleEvaluate = async () => {
    if (!essay?.transcription) {
      alert('Essay has no transcription to evaluate.');
      return;
    }
    try {
      const geminiResult = await geminiService.evaluateWithGemini(essay.transcription);
      
      const evaluationData = {
        essay_id: essay.id,
        overall_score: geminiService.calculateOverallScore(geminiResult),
        competency_1_score: geminiResult.competency_1.score,
        competency_1_feedback: geminiResult.competency_1.feedback,
        competency_2_score: geminiResult.competency_2.score,
        competency_2_feedback: geminiResult.competency_2.feedback,
        competency_3_score: geminiResult.competency_3.score,
        competency_3_feedback: geminiResult.competency_3.feedback,
        competency_4_score: geminiResult.competency_4.score,
        competency_4_feedback: geminiResult.competency_4.feedback,
        competency_5_score: geminiResult.competency_5.score,
        competency_5_feedback: geminiResult.competency_5.feedback,
        general_feedback: geminiResult.general_feedback,
      };
      const newEvaluation = await apiService.createEvaluation(evaluationData);
      await apiService.updateEssay(essay.id, { status: 'evaluated' });
      setEvaluation(newEvaluation);
      setEssay(prev => prev ? { ...prev, status: 'evaluated' } : null);
    } catch (err) {
      alert(`Evaluation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (error && !isTranscribing) { // Only show full-page error if not in the middle of transcribing
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }
  if (!essay) {
    return <div className="text-center p-8">Essay not found.</div>;
  }
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors font-medium mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes da Redação</h1>
          <p className="text-gray-600 mt-1">Revise e gerencie sua redação.</p>
        </div>
        <EssayDetail
          essay={essay}
          evaluation={evaluation}
          onEvaluate={handleEvaluate}
          onDelete={async () => {
            /* TODO: Implement delete */
          }}
          onTriggerOCR={handleTranscribe}
          isTranscribing={isTranscribing}
        />
      </div>
    </div>
  );
}