import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import UserProfile from '@/components/auth/UserProfile';
import LogoutButton from '@/components/auth/LogoutButton';
import EssayListClient from '@/components/essays/EssayListClient';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

async function getEssayStats(userId: string) {
  const supabase = await createClient();

  // Get all essays for the user
  const { data: essays, error } = await supabase
    .from('essays')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching essays:', error);
    return {
      totalEssays: 0,
      averageScore: null,
      lastEssayDate: null,
      essays: [],
    };
  }

  // Get evaluations for essays
  const essayIds = essays?.map((e) => e.id) || [];
  let averageScore = null;

  if (essayIds.length > 0) {
    const { data: evaluations } = await supabase
      .from('evaluations')
      .select('overall_score')
      .in('essay_id', essayIds);

    if (evaluations && evaluations.length > 0) {
      const totalScore = evaluations.reduce((sum, e) => sum + e.overall_score, 0);
      averageScore = Math.round(totalScore / evaluations.length);
    }
  }

  const lastEssayDate = essays && essays.length > 0 ? essays[0].created_at : null;

  return {
    totalEssays: essays?.length || 0,
    averageScore,
    lastEssayDate,
    essays: essays || [],
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // If not logged in, redirect to login page
  if (error || !user) {
    redirect('/login');
  }

  // Get essay statistics
  const stats = await getEssayStats(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ENEM Essay Corrector
              </h1>
              <p className="text-sm text-gray-600">
                Correção inteligente de redações
              </p>
            </div>
            <LogoutButton variant="minimal" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bem-vindo ao seu Dashboard! 👋
            </h2>
            <UserProfile user={user} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Redações Enviadas
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalEssays}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Média de Pontos
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.averageScore !== null ? stats.averageScore : '-'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Última Redação
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {stats.lastEssayDate
                      ? formatDistanceToNow(new Date(stats.lastEssayDate), {
                          addSuffix: true,
                          locale: ptBR,
                        })
                      : '-'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enviar Nova Redação
            </h3>
            <p className="text-gray-600 mb-6">
              Tire uma foto ou faça upload da sua redação para receber uma correção detalhada com base nos critérios do ENEM.
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium"
            >
              📸 Enviar Redação
            </Link>
          </div>

          {/* Essays List Section */}
          {stats.totalEssays > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Suas Redações
              </h3>
              <EssayListClient essays={stats.essays} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Redações Recentes
              </h3>
              <div className="text-center py-12">
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
                  Nenhuma redação ainda
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece enviando sua primeira redação para correção.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}