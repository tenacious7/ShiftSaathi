import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-brand-dark">
        ShiftSaathi
      </Link>
      
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-brand-purple object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-purple/10 border-2 border-brand-purple flex items-center justify-center text-brand-purple font-bold">
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/auth/login" 
            className="bg-brand-purple text-white px-5 py-2 rounded-full font-medium hover:bg-brand-dark transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
