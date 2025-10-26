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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detalhes da Redação
                </h1>
                <p className="text-sm text-gray-600">
                  Visualize e gerencie sua redação
                </p>
              </div>
            </div>
            <LogoutButton variant="minimal" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EssayDetailClient essay={essay} evaluation={evaluation} />
      </main>
    </div>
  );
}