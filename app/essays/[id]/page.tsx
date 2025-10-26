import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EssayDetailClient from '@/components/essays/EssayDetailClient';
import LogoutButton from '@/components/auth/LogoutButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getEssay(essayId: string, userId: string) {
  const supabase = await createClient();

  const { data: essay, error } = await supabase
    .from('essays')
    .select('*')
    .eq('id', essayId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching essay:', error);
    return null;
  }

  return essay;
}

async function getEvaluation(essayId: string) {
  const supabase = await createClient();

  const { data: evaluation, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('essay_id', essayId)
    .single();

  if (error) {
    // No evaluation found is not an error
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching evaluation:', error);
    return null;
  }

  return evaluation;
}

export default async function EssayDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // If not logged in, redirect to login page
  if (error || !user) {
    redirect('/login');
  }

  // Get essay ID from params
  const { id } = await params;
  const essay = await getEssay(id, user.id);

  // If essay not found, redirect to dashboard
  if (!essay) {
    redirect('/dashboard');
  }

  // Get evaluation if essay is evaluated
  const evaluation = essay.status === 'evaluated' ? await getEvaluation(id) : null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Back Button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
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
            Voltar para Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Detalhes da Redação
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize e gerencie sua redação
          </p>
        </div>

        <EssayDetailClient essay={essay} evaluation={evaluation} />
      </div>
    </div>
  );
}