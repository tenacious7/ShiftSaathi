import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Plus, Search, MapPin, Users, Calendar, X, ShieldCheck, Star, MoreHorizontal, Flag, Bell } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  category: string;
  location: string;
  time?: string;
  members: number;
  limit?: number;
  price: string;
  description?: string;
  image?: string;
  host: {
    name: string;
    verified: boolean;
    rating: number;
    avatar: string;
  };
  recommended?: boolean;
}

export default function CommunityHub() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { scrollY } = useScroll();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 50) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
  });

  // Simulate Push Notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000); // Hide after 5s
    }, 3000); // Show after 3s
    return () => clearTimeout(timer);
  }, []);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      name: 'Morning Yoga Group',
      category: 'Yoga 🧘',
      location: 'KIIT Park',
      members: 12,
      limit: 20,
      price: '₹300/month',
      time: '6:00 AM',
      description: 'Beginner yoga for students',
      image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Priya S.',
        verified: true,
        rating: 4.9,
        avatar: 'https://i.pravatar.cc/150?u=priya'
      },
      recommended: true
    },
    {
      id: 2,
      name: 'Weekend Coding Club',
      category: 'Coding Club 💻',
      location: 'Cafe Coffee Day',
      members: 15,
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Rahul Dev',
        verified: true,
        rating: 4.7,
        avatar: 'https://i.pravatar.cc/150?u=rahul'
      },
      recommended: true
    },
    {
      id: 3,
      name: 'Friday House Party',
      category: 'Weekend Parties 🎉',
      location: 'Koramangala',
      members: 8,
      limit: 30,
      price: '₹200',
      time: '8:00 PM',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Amit K.',
        verified: false,
        rating: 4.2,
        avatar: 'https://i.pravatar.cc/150?u=amit'
      }
    },
    {
      id: 4,
      name: 'Sunday Cricket Match',
      category: 'Cricket / Football ⚽',
      location: 'HSR Ground',
      members: 18,
      limit: 22,
      price: '₹50',
      time: '7:00 AM',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      host: {
        name: 'Team HSR',
        verified: true,
        rating: 4.8,
        avatar: 'https://i.pravatar.cc/150?u=team'
      }
    }
  ]);

  const categories = ['Yoga 🧘', 'Morning Walk 🚶', 'Study Group 📚', 'Cricket / Football ⚽', 'Coding Club 💻', 'Book Club 📖', 'Weekend Parties 🎉', 'Language Exchange 🗣️'];

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add activity would go here
    setShowCreateModal(false);
  };

  const recommendedActivities = activities.filter(a => a.recommended);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans relative">
      {/* Simulated Push Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-[60] bg-white rounded-2xl shadow-xl p-4 border border-brand-purple/10 flex items-start gap-3"
          >
            <div className="bg-brand-purple/10 p-2 rounded-full text-brand-purple">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm">New Yoga Group Nearby!</h4>
              <p className="text-xs text-gray-600 mt-1">"Sunrise Yoga" just started near KIIT Park. 5 people joined.</p>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Activity Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Community</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" placeholder="e.g. Morning Yoga Group" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none bg-white">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="e.g. KIIT Park" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Members Limit</label>
                    <input type="number" placeholder="20" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="text" placeholder="e.g. ₹300/month" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} placeholder="Describe your community..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple/20 outline-none resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-dark/20 hover:scale-[1.02] transition-transform">
                  Create Community
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        className="bg-white p-6 shadow-sm sticky top-0 z-10"
        animate={{ y: isHeaderVisible ? 0 : -100, opacity: isHeaderVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Community Hub</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl shadow-lg shadow-brand-dark/20 hover:scale-105 transition-transform flex items-center gap-2 font-bold text-sm"
          >
            <Plus size={18} />
            Create
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search activities, groups..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium whitespace-nowrap hover:border-brand-purple hover:text-brand-purple transition-colors shadow-sm">
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Recommended Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            Recommended for you
            <span className="bg-brand-lime text-brand-dark text-[10px] px-2 py-0.5 rounded-full">Based on your interests</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide items-start">
            {recommendedActivities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col transition-shadow hover:shadow-md shrink-0 ${expandedId === activity.id ? 'w-[320px]' : 'w-[280px]'}`}
              >
                <div className="cursor-pointer" onClick={() => toggleExpand(activity.id)}>
                  <motion.div layout className="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {activity.price}
                    </div>
                  </motion.div>
                  <motion.h3 layout className="font-bold text-gray-900 mb-1">{activity.name}</motion.h3>
                  <motion.div layout className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin size={12} />
                    {activity.location}
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {expandedId === activity.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-gray-600 mb-4 mt-2">{activity.description || 'Join our vibrant community! We meet regularly to share experiences, learn together, and build lasting connections. Everyone is welcome to join and participate.'}</p>
                      
                      <div className="bg-gray-50 p-3 rounded-xl mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-900">Host Rating & Reviews</span>
                          <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                            <Star size={14} className="fill-yellow-600" />
                            {activity.host.rating}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 italic">"Amazing host! Very well organized and welcoming community. Highly recommended for newcomers." - Verified Member</p>
                      </div>

                      <div className="flex gap-3 mb-4">
                        <button className="flex-1 bg-brand-dark text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-dark/10 hover:bg-gray-900 transition-colors">
                          {activity.price === 'Free' ? 'Join Group' : 'Book Spot'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Host Info Mini */}
                <motion.div layout className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
                   <img src={activity.host.avatar} alt={activity.host.name} className="w-6 h-6 rounded-full" />
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate flex items-center gap-1">
                        {activity.host.name}
                        {activity.host.verified && <ShieldCheck size={10} className="text-brand-purple" />}
                      </p>
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-yellow-100 px-1.5 py-0.5 rounded">
                     <Star size={8} className="text-yellow-600 fill-yellow-600" />
                     {activity.host.rating}
                   </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All Activities Feed */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Explore Nearby</h2>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Host Header */}
              <motion.div layout className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <img src={activity.host.avatar} alt={activity.host.name} className="w-8 h-8 rounded-full border border-gray-100" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-gray-900">{activity.host.name}</h4>
                      {activity.host.verified && (
                        <ShieldCheck size={14} className="text-brand-purple fill-brand-purple/10" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>Host</span>
                      <span>•</span>
                      <div className="flex items-center gap-0.5 text-yellow-600 font-medium">
                        <Star size={10} className="fill-yellow-600" />
                        {activity.host.rating}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                  <MoreHorizontal size={20} />
                </button>
              </motion.div>

              <motion.div layout className="flex gap-4 cursor-pointer" onClick={() => toggleExpand(activity.id)}>
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-md">
                      {activity.category.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                      {activity.price}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{activity.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <MapPin size={12} />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      {activity.members}{activity.limit ? `/${activity.limit}` : ''} Members
                    </div>
                    {activity.time && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {activity.time}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              <AnimatePresence>
                {expandedId === activity.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-50 overflow-hidden"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">About this community</h4>
                    <p className="text-sm text-gray-600 mb-4">{activity.description || 'Join our vibrant community! We meet regularly to share experiences, learn together, and build lasting connections. Everyone is welcome to join and participate.'}</p>
                    
                    <div className="bg-gray-50 p-3 rounded-xl mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">Host Rating & Reviews</span>
                        <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                          <Star size={14} className="fill-yellow-600" />
                          {activity.host.rating}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic">"Amazing host! Very well organized and welcoming community. Highly recommended for newcomers." - Verified Member</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout className="flex gap-3 mt-4">
                <button className="flex-1 bg-brand-dark text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-dark/10 hover:bg-gray-900 transition-colors">
                  {activity.price === 'Free' ? 'Join Group' : 'Book Spot'}
                </button>
                <button className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-colors" title="Report Activity">
                  <Flag size={18} />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
