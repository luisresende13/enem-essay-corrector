import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EvaluationDisplay from '@/components/results/EvaluationDisplay';
import LogoutButton from '@/components/auth/LogoutButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getEssayWithEvaluation(essayId: string, userId: string) {
  const supabase = await createClient();

  // Get essay
  const { data: essay, error: essayError } = await supabase
    .from('essays')
    .select('*')
    .eq('id', essayId)
    .eq('user_id', userId)
    .single();

  if (essayError || !essay) {
    return null;
  }

  // Get evaluation
  const { data: evaluation, error: evaluationError } = await supabase
    .from('evaluations')
    .select('*')
    .eq('essay_id', essayId)
    .single();

  if (evaluationError) {
    return null;
  }

  return { essay, evaluation };
}

export default async function EvaluationPage({ params }: PageProps) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // If not logged in, redirect to login page
  if (error || !user) {
    redirect('/login');
  }

  // Get essay ID from params
  const { id } = await params;
  const data = await getEssayWithEvaluation(id, user.id);

  // If essay or evaluation not found, redirect to essay detail
  if (!data) {
    redirect(`/essays/${id}`);
  }

  const { essay, evaluation } = data;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 print:bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-4">
        {/* Page Header with Back Button */}
        <div className="mb-6 print:hidden">
          <Link
            href={`/essays/${id}`}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors font-medium mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para Redação
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Resultado da Avaliação
          </h1>
          <p className="text-gray-600 mt-1">{essay.title}</p>
        </div>

        <EvaluationDisplay evaluation={evaluation} essay={essay} />
      </div>
    </div>
  );
}