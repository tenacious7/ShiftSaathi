import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, Calendar, X, ShieldCheck, Info } from 'lucide-react';

export default function FindRoommate() {
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  
  const [filters, setFilters] = useState({
    origin: 'Origin State',
    location: 'Location',
    budget: 'Budget',
    gender: 'Gender',
    occupation: 'Occupation',
    diet: 'Diet',
    habits: 'Habits',
  });

  const roommates = [
    {
      id: 1,
      name: 'Rahul Sharma',
      profession: 'Software Engineer',
      match: 95,
      matchBreakdown: { state: 30, language: 20, budget: 20, lifestyle: 15, occupation: 10 },
      location: 'Koramangala',
      language: 'Odia, Hindi, English',
      budget: '₹8,000',
      habits: ['Non-Veg', 'Night Owl', 'Clean Freak'],
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      arrivingDate: 'Already here',
      isNew: false,
      status: 'Have a Place',
      isVerified: true
    },
    {
      id: 2,
      name: 'Amit Patel',
      profession: 'Student',
      match: 88,
      matchBreakdown: { state: 30, language: 20, budget: 15, lifestyle: 13, occupation: 10 },
      location: 'HSR Layout',
      language: 'Gujarati, Hindi, English',
      budget: '₹6,500',
      habits: ['Veg', 'Early Riser', 'Pet Lover'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      arrivingDate: 'Already here',
      isNew: false,
      status: 'Have a Place',
      isVerified: true
    },
    {
      id: 3,
      name: 'Vikram Singh',
      profession: 'Designer',
      match: 82,
      matchBreakdown: { state: 0, language: 20, budget: 20, lifestyle: 15, occupation: 27 },
      location: 'Indiranagar',
      language: 'Hindi, English',
      budget: '₹9,000',
      habits: ['Non-Veg', 'Smoker', 'Music Lover'],
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      arrivingDate: 'Already here',
      isNew: false,
      status: 'Looking for Place',
      isVerified: false
    },
    {
      id: 4,
      name: 'Arjun Reddy',
      profession: 'Data Analyst',
      match: 92,
      matchBreakdown: { state: 30, language: 20, budget: 20, lifestyle: 12, occupation: 10 },
      location: 'Whitefield',
      language: 'Telugu, English',
      budget: '₹12,000',
      habits: ['Non-Veg', 'Fitness Freak'],
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      arrivingDate: 'Oct 15',
      isNew: true,
      status: 'Looking for Place',
      isVerified: true
    },
    {
      id: 5,
      name: 'Siddharth M',
      profession: 'MBA Student',
      match: 78,
      matchBreakdown: { state: 30, language: 20, budget: 10, lifestyle: 8, occupation: 10 },
      location: 'BTM Layout',
      language: 'Tamil, English',
      budget: '₹7,000',
      habits: ['Veg', 'Studious'],
      image: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      arrivingDate: 'Oct 20',
      isNew: true,
      status: 'Looking for Place',
      isVerified: false
    }
  ];

  const filteredRoommates = activeFilter === 'New Arrivals' 
    ? roommates.filter(r => r.isNew) 
    : roommates;

  const handleFilterClick = (filterType: string) => {
    if (!isPremium && filterType !== 'All') {
      setShowPremiumModal(true);
      return;
    }
    setActiveFilter(filterType);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-symbols-rounded text-gray-600">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Find Roommate</h1>
          <button 
            onClick={() => !isPremium && setShowPremiumModal(true)}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors relative"
          >
            <span className="material-symbols-rounded text-gray-600">filter_list</span>
            {!isPremium && (
              <div className="absolute top-1 right-1 bg-brand-purple text-white rounded-full p-0.5">
                <Lock size={10} />
              </div>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          <button
            onClick={() => handleFilterClick('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === 'All' 
                ? 'bg-brand-dark text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Matches
          </button>
          
          <button
            onClick={() => handleFilterClick('New Arrivals')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeFilter === 'New Arrivals' 
                ? 'bg-brand-dark text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            New Arrivals 
            {!isPremium && <Lock size={12} className="text-gray-400" />}
            {isPremium && <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse"></span>}
          </button>

          {Object.entries(filters).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleFilterClick(key)}
              className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700 whitespace-nowrap flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              {value}
              {!isPremium ? (
                <Lock size={12} className="text-gray-400" />
              ) : (
                <span className="material-symbols-rounded text-base">expand_more</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Match Summary */}
        <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-lime/20 flex items-center justify-center text-brand-dark shrink-0">
            <span className="material-symbols-rounded">check_circle</span>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-dark">
              We found <span className="text-brand-purple font-bold">{filteredRoommates.length}</span> potential roommates matching your preferences.
            </p>
          </div>
        </div>

        {/* Roommate Cards */}
        <div className="space-y-4">
          {filteredRoommates.map((roommate, index) => {
            const isBestMatch = roommate.match >= 90;
            const isLocked = isBestMatch && !isPremium;

            return (
              <motion.div
                key={roommate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                {/* Premium Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Lock className="text-brand-purple" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Match</h3>
                    <p className="text-sm text-gray-600 mb-6">Upgrade to Premium to view this {roommate.match}% match and connect instantly.</p>
                    <button 
                      onClick={() => setShowPremiumModal(true)}
                      className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold shadow-lg shadow-brand-dark/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <Crown size={18} className="text-brand-lime" />
                      Unlock Premium
                    </button>
                  </div>
                )}

                <div className={`p-5 ${isLocked ? 'blur-sm select-none pointer-events-none' : ''}`}>
                  <div 
                    className="absolute top-0 right-0 bg-brand-lime text-brand-dark px-3 py-1.5 rounded-bl-xl text-xs font-bold flex items-center gap-1.5 z-10 cursor-pointer hover:bg-[#b5db74] transition-colors"
                    onClick={() => setSelectedMatch(selectedMatch === roommate.id ? null : roommate.id)}
                  >
                    {roommate.match}% Match
                    <Info size={14} />
                  </div>

                  {roommate.isNew && (
                    <div className="absolute top-0 left-0 bg-brand-purple text-white px-3 py-1 rounded-br-xl text-xs font-bold z-10">
                      New Arrival
                    </div>
                  )}

                  <div className="flex gap-4 mb-4 mt-2">
                    <img src={roommate.image} alt={roommate.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-brand-dark">{roommate.name}</h3>
                        {roommate.isVerified && (
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100">
                            <ShieldCheck size={12} />
                            Verified Student
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{roommate.profession}</p>
                      
                      {/* Status Label */}
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${
                        roommate.status === 'Have a Place' 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {roommate.status}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                        <span className="material-symbols-rounded text-sm">location_on</span>
                        {roommate.location}
                      </div>
                      {roommate.isNew && (
                        <div className="flex items-center gap-1 text-xs text-brand-purple font-medium bg-brand-purple/5 px-2 py-0.5 rounded-md w-fit">
                          <Calendar size={12} />
                          Arriving: {roommate.arrivingDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Match Breakdown Dropdown */}
                  <AnimatePresence>
                    {selectedMatch === roommate.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-4"
                      >
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Match Score Breakdown</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Same Home State</span>
                              <span className="font-bold text-brand-dark">+{roommate.matchBreakdown.state}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Same Language</span>
                              <span className="font-bold text-brand-dark">+{roommate.matchBreakdown.language}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Budget Overlap</span>
                              <span className="font-bold text-brand-dark">+{roommate.matchBreakdown.budget}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Lifestyle Match</span>
                              <span className="font-bold text-brand-dark">+{roommate.matchBreakdown.lifestyle}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Occupation Type</span>
                              <span className="font-bold text-brand-dark">+{roommate.matchBreakdown.occupation}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between text-sm font-bold">
                              <span className="text-brand-dark">Total Score</span>
                              <span className="text-brand-purple">{roommate.match}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-rounded text-gray-400 text-lg">translate</span>
                      <span className="truncate">{roommate.language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-rounded text-gray-400 text-lg">payments</span>
                      {roommate.budget}/mo
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {roommate.habits.map((habit) => (
                      <span key={habit} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100">
                        {habit}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 rounded-xl border border-brand-purple text-brand-purple font-semibold text-sm hover:bg-brand-purple/5 transition-colors">
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        if (!sentRequests.includes(roommate.id)) {
                          setSentRequests([...sentRequests, roommate.id]);
                        }
                      }}
                      disabled={sentRequests.includes(roommate.id)}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                        sentRequests.includes(roommate.id)
                          ? 'bg-green-100 text-green-700 shadow-none cursor-default'
                          : 'bg-brand-purple text-white shadow-brand-purple/20 hover:bg-brand-purple/90'
                      }`}
                    >
                      {sentRequests.includes(roommate.id) ? (
                        <>
                          <span className="material-symbols-rounded text-lg">check</span>
                          Request Sent
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-rounded text-lg">chat</span>
                          Connect
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden relative"
            >
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors z-10"
              >
                <X size={20} className="text-gray-600" />
              </button>

              <div className="bg-brand-dark p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-lime/20" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20 shadow-inner">
                    <Crown size={40} className="text-brand-lime" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Unlock Filters</h2>
                  <p className="text-white/70 text-sm">Find your perfect match faster with advanced filtering options.</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {[
                    'Filter by New Arrivals',
                    'Filter by Budget & Location',
                    'See 90%+ Match Profiles',
                    'Unlimited Connections'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-rounded text-brand-purple text-sm">check</span>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setIsPremium(true);
                    setShowPremiumModal(false);
                  }}
                  className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold shadow-lg shadow-brand-dark/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform mt-4"
                >
                  <Crown size={20} className="text-brand-lime" />
                  Get Premium for ₹199
                </button>
                
                <p className="text-center text-xs text-gray-400">
                  7-day free trial, cancel anytime.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
