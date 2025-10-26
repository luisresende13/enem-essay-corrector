"use client";

import { Evaluation, Essay } from '@/types';
import ScoreSummary from './ScoreSummary';
import CompetencyCard from './CompetencyCard';
import Image from 'next/image';

interface EvaluationDisplayProps {
  evaluation: Evaluation;
  essay: Essay;
}

// ENEM Competencies descriptions
const COMPETENCIES = [
  {
    number: 1,
    title: 'Domínio da língua portuguesa',
    description:
      'Demonstrar domínio da modalidade escrita formal da língua portuguesa.',
  },
  {
    number: 2,
    title: 'Compreensão do tema',
    description:
      'Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento.',
  },
  {
    number: 3,
    title: 'Organização de informações',
    description:
      'Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos.',
  },
  {
    number: 4,
    title: 'Mecanismos linguísticos',
    description:
      'Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.',
  },
  {
    number: 5,
    title: 'Proposta de intervenção',
    description:
      'Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.',
  },
];

export default function EvaluationDisplay({ evaluation, essay }: EvaluationDisplayProps) {
  // Prepare competencies data
  const competencies = COMPETENCIES.map((comp) => ({
    ...comp,
    score: evaluation[`competency_${comp.number}_score` as keyof Evaluation] as number,
    feedback: evaluation[`competency_${comp.number}_feedback` as keyof Evaluation] as string,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Side-by-Side View: Original Essay and Transcription */}
      <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Redação Original e Transcrição</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Column: Original Essay Image */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Imagem Original</h3>
            <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <Image
                src={essay.image_url}
                alt="Redação original"
                width={800}
                height={1200}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Right Column: Transcription */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Transcrição</h3>
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 h-full overflow-y-auto max-h-[600px]">
              {essay.transcription ? (
                <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
                  {essay.transcription}
                </p>
              ) : (
                <p className="text-gray-500 italic">Transcrição não disponível</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <ScoreSummary
        overallScore={evaluation.overall_score}
        competencies={competencies.map((c) => ({
          number: c.number,
          title: c.title,
          score: c.score,
        }))}
      />

      {/* Competency Cards */}
      <div className="space-y-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Avaliação Detalhada por Competência
        </h2>
        {competencies.map((comp) => (
          <CompetencyCard
            key={comp.number}
            number={comp.number}
            title={comp.title}
            description={comp.description}
            score={comp.score}
            feedback={comp.feedback}
          />
        ))}
      </div>

      {/* General Feedback */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback Geral</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {evaluation.general_feedback}
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-6 flex justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Imprimir Avaliação
        </button>
      </div>
    </div>
  );
}