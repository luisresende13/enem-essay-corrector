import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import UploadScreen from './screens/UploadScreen';
import EssayDetailScreen from './screens/EssayDetailScreen';
import LandingScreen from './screens/LandingScreen';
import AuthCallbackScreen from './screens/AuthCallbackScreen'; // Import the new screen
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/auth/callback" element={<AuthCallbackScreen />} /> {/* Add this new route */}
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/upload" element={<UploadScreen />} />
          <Route path="/essays/:id" element={<EssayDetailScreen />} />
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingScreen />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;