import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import LoginButton from '../components/auth/LoginButton';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Corretor de Redação do ENEM
          </h1>
          <p className="text-gray-600 mb-8">
            Correção inteligente de redações do ENEM com IA
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Erro ao fazer login
                  </h3>
                  <p className="text-sm text-red-800">
                    {errorDescription || 'Ocorreu um erro durante a autenticação. Por favor, tente novamente.'}
                  </p>
                  {error === 'server_error' && (
                    <p className="text-xs text-red-700 mt-2">
                      Verifique se o Google OAuth está configurado corretamente no Supabase Dashboard.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-blue-900 mb-2">
              ✨ O que você pode fazer:
            </h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Enviar fotos de suas redações</li>
              <li>• Receber correção automática por IA</li>
              <li>• Ver pontuação por competência</li>
              <li>• Acompanhar seu progresso</li>
            </ul>
          </div>

          <LoginButton />

          <p className="text-xs text-center text-gray-500">
            Ao fazer login, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}