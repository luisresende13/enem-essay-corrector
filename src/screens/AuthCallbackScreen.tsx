// src/screens/AuthCallbackScreen.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const AuthCallbackScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Here you could add logic that was previously on the server,
        // like checking for a user profile or adding sample data.
        // For now, we will just redirect.
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Authenticating... Please wait.</p>
    </div>
  );
};

export default AuthCallbackScreen;