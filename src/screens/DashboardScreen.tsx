import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import * as apiService from '../services/apiService';
import { Essay } from '../types';
import { User } from '@supabase/supabase-js';
import UserProfile from '../components/auth/UserProfile';
import EssayListClient from '../components/essays/EssayListClient';
import DashboardSkeleton from '../components/layout/DashboardSkeleton';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { addSampleEssaysToUser } from '../services/samples';

interface EssayStats {
  totalEssays: number;
  averageScore: number | null;
  lastEssayDate: string | null;
  essays: (Essay & { evaluation?: { overall_score: number } | null })[];
}

export default function DashboardScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<EssayStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user as unknown as User);

      try {
        let essays = await apiService.getEssays(user.id);
        
        if (essays.length === 0) {
          await addSampleEssaysToUser(user.id);
          essays = await apiService.getEssays(user.id);
        }

        const evaluatedEssays = essays.filter(e => e.status === 'evaluated' && e.evaluation);
        const averageScore = evaluatedEssays.length > 0
          ? Math.round(evaluatedEssays.reduce((sum, e) => sum + (e.evaluation?.overall_score || 0), 0) / evaluatedEssays.length)
          : null;

        const lastEssayDate = essays.length > 0 ? essays[0].created_at : null;

        setStats({
          totalEssays: essays.length,
          averageScore,
          lastEssayDate,
          essays,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteEssay = (deletedEssayId: string) => {
    if (stats) {
      setStats({
        ...stats,
        essays: stats.essays.filter(e => e.id !== deletedEssayId),
        totalEssays: stats.totalEssays - 1,
      });
    }
  };

  if (isLoading || !stats || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bem-vindo ao seu Dashboard! 👋
            </h2>
            <UserProfile user={user} />
          </div>

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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enviar Nova Redação
            </h3>
            <p className="text-gray-600 mb-6">
              Tire uma foto ou faça upload da sua redação para receber uma correção detalhada com base nos critérios do ENEM.
            </p>
            <Link
              to="/upload"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              📸 Enviar Redação
            </Link>
          </div>

          {stats.totalEssays > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Suas Redações
              </h3>
              <EssayListClient essays={stats.essays} onDelete={handleDeleteEssay} />
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
      </div>
    </div>
  );
}