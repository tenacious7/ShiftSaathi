import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Notifications from '../components/Notifications';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

interface UserProfile {
  id: string;
  full_name: string;
}

export default function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndFetchProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          navigate('/auth');
          return;
        }

        const userId = session.user.id;
        
        // Fetch profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('user_details')
          .select('full_name')
          .eq('id', userId)
          .single();

        if (profileError || !profileData) {
          console.warn('Profile fetch failed, using fallback data', profileError);
          setProfile({
            id: userId,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User'
          });
          return;
        }

        setProfile({
          id: userId,
          full_name: profileData.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User'
        });
      } catch (error) {
        console.error('Error:', error);
        // Fallback if everything fails but we have a session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setProfile({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const quickActions = [
    { icon: 'apartment', label: 'PGs', color: 'bg-brand-lime text-brand-dark', path: '/explore' },
    { icon: 'storefront', label: 'Market', color: 'bg-brand-purple text-white', path: '/marketplace' },
    { icon: 'restaurant', label: 'Mess', color: 'bg-brand-light-purple text-brand-dark', path: '/explore' },
    { icon: 'local_laundry_service', label: 'Laundry', color: 'bg-brand-blue-accent text-white', path: '/explore' },
    { icon: 'home_work', label: 'Rentals', color: 'bg-green-100 text-green-600', path: '/explore' },
    { icon: 'groups', label: 'Community', color: 'bg-yellow-100 text-yellow-600', path: '/community-hub' },
  ];

  const cityTips = [
    {
      id: 1,
      title: 'Best Mess near KIIT',
      subtitle: '₹60 Thali • Unlimited Rice',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: 'Trending',
      color: 'bg-orange-500'
    },
    {
      id: 2,
      title: 'New Gym Opening',
      subtitle: 'Student Discount Available',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: 'Offer',
      color: 'bg-blue-500'
    }
  ];

  const nearbyPGs = [
    {
      id: 1,
      name: 'Sai Residency',
      rating: 4.5,
      location: 'Koramangala, Bangalore',
      price: '₹8,500',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: 'Trending',
    },
    {
      id: 2,
      name: 'Green View PG',
      rating: 4.2,
      location: 'HSR Layout, Bangalore',
      price: '₹7,000',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tag: 'New',
    },
  ];

  const peopleLikeYou = [
    { id: 1, name: 'Rahul', role: 'Software Engineer', image: 'https://i.pravatar.cc/150?u=rahul' },
    { id: 2, name: 'Priya', role: 'Student', image: 'https://i.pravatar.cc/150?u=priya' },
    { id: 3, name: 'Amit', role: 'Designer', image: 'https://i.pravatar.cc/150?u=amit' },
    { id: 4, name: 'Sneha', role: 'Content Writer', image: 'https://i.pravatar.cc/150?u=sneha' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">
        <Loader text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light pb-24 font-sans">
      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      
      {/* Header */}
      <header className="bg-brand-dark text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <p className="text-white/80 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">{profile?.full_name || 'User'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowNotifications(true)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner hover:bg-white/20 transition-colors relative"
            >
              <span className="material-symbols-rounded text-brand-lime">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-brand-dark"></span>
            </button>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 border border-white/10 shadow-inner">
            <span className="material-symbols-rounded text-white/70">search</span>
            <input
              type="text"
              placeholder="Search for PGs, Roommates, etc."
              className="bg-transparent text-white placeholder-white/60 w-full outline-none"
            />
            <span className="material-symbols-rounded text-white/70">tune</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* City Tips & Local Discoveries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-rounded text-brand-purple">local_fire_department</span>
            <h3 className="text-lg font-bold text-brand-dark">City Tips & Discoveries</h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {cityTips.map((tip) => (
              <div key={tip.id} className="min-w-[280px] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3 items-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                  <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" />
                  <div className={`absolute top-0 left-0 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-br-lg ${tip.color}`}>
                    {tip.tag}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{tip.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{tip.subtitle}</p>
                  <button className="text-brand-purple text-xs font-bold mt-2 flex items-center gap-1">
                    View Details <span className="material-symbols-rounded text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Find Roommate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/find-roommate" className="block group">
            <div className="bg-brand-lime rounded-2xl p-5 text-brand-dark shadow-xl shadow-brand-lime/20 relative overflow-hidden transform transition-transform group-hover:scale-[1.02]">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                 <span className="material-symbols-rounded text-9xl text-brand-dark">group</span>
              </div>
              <div className="relative z-10">
                <div className="bg-brand-dark/10 w-fit px-3 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-sm border border-brand-dark/5">
                  New Feature
                </div>
                <h2 className="text-xl font-bold mb-1">Find Your Roommate</h2>
                <p className="text-brand-dark/80 text-sm mb-4 font-medium">Connect with people from your state!</p>
                <div className="flex items-center gap-2 text-sm font-semibold bg-brand-dark text-white px-4 py-2 rounded-lg w-fit shadow-sm">
                  Explore Now
                  <span className="material-symbols-rounded text-lg">arrow_forward</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
            Quick Actions
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link to={action.path} key={action.label}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-active:scale-95`}>
                    <span className="material-symbols-rounded text-2xl">{action.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-brand-dark transition-colors">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby PGs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-brand-dark">Nearby PGs</h3>
            <Link to="/explore" className="text-brand-purple text-sm font-bold hover:underline">See All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            {nearbyPGs.map((pg) => (
              <Link to={`/pg-details/${pg.id}`} key={pg.id} className="min-w-[260px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-32 relative">
                  <img src={pg.image} alt={pg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-rounded text-yellow-500 text-sm filled">star</span>
                    {pg.rating}
                  </div>
                  {pg.tag && (
                    <div className="absolute top-3 left-3 bg-brand-purple text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {pg.tag}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-brand-dark mb-1 truncate">{pg.name}</h4>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                    <span className="material-symbols-rounded text-sm">location_on</span>
                    <span className="truncate">{pg.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-dark font-bold text-lg">{pg.price}<span className="text-xs text-gray-400 font-normal">/mo</span></span>
                    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-colors text-gray-400">
                      <span className="material-symbols-rounded text-lg">favorite</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* People Like You */}
        <div>
          <h3 className="text-lg font-bold text-brand-dark mb-4">People Like You</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex -space-x-3 overflow-hidden">
                {peopleLikeYou.map((person) => (
                  <img
                    key={person.id}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    src={person.image}
                    alt={person.name}
                  />
                ))}
                <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-brand-light-purple text-xs font-bold text-brand-purple">
                  +12
                </div>
              </div>
              <button className="text-brand-purple text-sm font-bold hover:underline">View All</button>
            </div>
            <p className="text-sm text-gray-500">Connect with people who share your interests and background.</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
