'use client';

import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import LogoutButton from '../auth/LogoutButton';

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">📝</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Corretor de Redação do ENEM
              </h1>
              <p className="text-xs text-gray-600">
                Correção inteligente de redações
              </p>
            </div>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <LogoutButton variant="minimal" />
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}