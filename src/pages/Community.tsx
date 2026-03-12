import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Plus, Search, X, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

type PostType = 'text' | 'poll';

interface Post {
  id: number;
  type: PostType;
  user: string;
  avatar?: string;
  time: string;
  content: string;
  likes?: number;
  comments?: number;
  tags?: string[];
  isNew?: boolean;
  // Poll specific
  pollOptions?: { label: string; votes: number }[];
  totalVotes?: number;
  userVoted?: number | null; // index of option
  messName?: string; // For the "connected to business" context
}

export default function Community() {
  const [activeTab, setActiveTab] = useState('New in City');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showPremiumBanner, setShowPremiumBanner] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    
    // Add a threshold so it only triggers on intentional scrolls, not micro-jitters
    if (latest > 250 && diff > 15) {
      setIsHeaderVisible(false);
    } else if (diff < -15 || latest <= 250) {
      setIsHeaderVisible(true);
    }
  });
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 101,
      type: 'poll',
      user: 'Sai Ram PG Owner',
      avatar: 'https://ui-avatars.com/api/?name=Sai+Ram&background=0D8ABC&color=fff',
      time: '10m ago',
      content: 'Community Lunch this Sunday: Should we prepare Chicken Biryani or Mutton Curry?',
      messName: 'Sai Ram PG Residents',
      pollOptions: [
        { label: 'Chicken Biryani', votes: 45 },
        { label: 'Mutton Curry', votes: 12 }
      ],
      totalVotes: 57,
      userVoted: null,
      isNew: true
    },
    {
      id: 1,
      type: 'text',
      user: 'Rohit – Odisha',
      avatar: 'https://i.pravatar.cc/150?u=rohan',
      time: 'Just now',
      content: 'Just arrived in Bangalore. Looking for roommates near Electronic City. Any leads?',
      likes: 5,
      comments: 2,
      tags: ['#NewInCity', '#Roommate'],
      isNew: true
    },
    {
      id: 102,
      type: 'poll',
      user: 'Green View Mess Admin',
      avatar: 'https://ui-avatars.com/api/?name=Green+View&background=10B981&color=fff',
      time: '1h ago',
      content: 'Should we extend the gate closing time to 11:00 PM on weekends?',
      messName: 'Green View Mess',
      pollOptions: [
        { label: 'Yes', votes: 89 },
        { label: 'No', votes: 15 }
      ],
      totalVotes: 104,
      userVoted: null,
      isNew: false
    },
    {
      id: 2,
      type: 'text',
      user: 'Priya – KIIT Student',
      avatar: 'https://i.pravatar.cc/150?u=priya',
      time: '2h ago',
      content: 'Anyone going to campus fest today? Let\'s connect!',
      likes: 12,
      comments: 8,
      tags: ['#CampusLife', '#Connect'],
      isNew: false
    },
    {
      id: 3,
      type: 'text',
      user: 'Anjali Das',
      avatar: 'https://i.pravatar.cc/150?u=anjali',
      time: '5h ago',
      content: 'Found a great mess near HSR Layout. ₹70 for unlimited thali. DM for location!',
      likes: 24,
      comments: 6,
      tags: ['#Food', '#HSRLayout'],
      isNew: false
    },
  ]);

  const tabs = ['New in City', 'Mess Updates', 'Seniors', 'Notice Board', 'Emergency'];

  // Fetch posts from backend (fallback to dummy data if table doesn't exist yet)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/community');
        if (response.ok) {
          const data = await response.json();
          if (data.posts && data.posts.length > 0) {
            const formattedPosts = data.posts.map((p: any) => ({
              id: p.id,
              type: p.type || 'text',
              user: p.users?.full_name || 'Anonymous',
              avatar: p.users?.avatar_url || `https://ui-avatars.com/api/?name=${p.users?.full_name || 'A'}&background=random`,
              time: new Date(p.created_at).toLocaleDateString(),
              content: p.content,
              likes: 0,
              comments: 0,
              tags: p.tags || [],
              isNew: true
            }));
            // Prepend new posts to the dummy data for demo purposes
            setPosts(prev => [...formattedPosts, ...prev]);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Please log in to post.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/community/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.user.id,
          content: newPostContent,
          type: 'text',
          tags: ['#NewInCity']
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newPost: Post = {
          id: data.post?.id || Date.now(),
          type: 'text',
          user: session.user.user_metadata?.full_name || 'You',
          avatar: `https://ui-avatars.com/api/?name=${session.user.user_metadata?.full_name || 'Y'}&background=8B5CF6&color=fff`,
          time: 'Just now',
          content: newPostContent,
          likes: 0,
          comments: 0,
          tags: ['#NewInCity'],
          isNew: true
        };
        setPosts(prev => [newPost, ...prev]);
        setNewPostContent('');
        setShowPostModal(false);
      } else {
        // Fallback for demo if table doesn't exist
        const newPost: Post = {
          id: Date.now(),
          type: 'text',
          user: session.user.user_metadata?.full_name || 'You',
          avatar: `https://ui-avatars.com/api/?name=${session.user.user_metadata?.full_name || 'Y'}&background=8B5CF6&color=fff`,
          time: 'Just now',
          content: newPostContent,
          likes: 0,
          comments: 0,
          tags: ['#NewInCity'],
          isNew: true
        };
        setPosts(prev => [newPost, ...prev]);
        setNewPostContent('');
        setShowPostModal(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (postId: number, optionIndex: number) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId && post.type === 'poll' && post.userVoted === null && post.pollOptions) {
          const newOptions = [...post.pollOptions];
          newOptions[optionIndex].votes += 1;
          return {
            ...post,
            pollOptions: newOptions,
            totalVotes: (post.totalVotes || 0) + 1,
            userVoted: optionIndex
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <motion.div 
        className="bg-white p-6 shadow-sm sticky top-0 z-50 rounded-b-3xl"
        animate={{ y: isHeaderVisible ? 0 : "-100%", opacity: isHeaderVisible ? 1 : 0 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Community</h1>
        
        {/* Search & Create */}
        <div className="flex gap-3 mb-6 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search topics, polls..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowPostModal(true)}
            className="w-12 h-12 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10 transition-colors shrink-0"
            aria-label="Create Post"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Premium Banner */}
        {showPremiumBanner && (
          <div className="bg-gradient-to-r from-brand-purple to-brand-blue-accent rounded-xl p-4 text-white flex justify-between items-center shadow-lg shadow-brand-purple/20 mb-6 relative">
            <button 
              onClick={() => setShowPremiumBanner(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div>
              <h3 className="font-bold text-lg mb-1">Go Premium</h3>
              <p className="text-xs text-white/80">Get verified leads & priority support</p>
            </div>
            <button className="bg-white text-brand-purple px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
              Upgrade
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-brand-lime text-brand-dark shadow-md shadow-brand-lime/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Feed */}
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-5 shadow-sm border transition-shadow hover:shadow-md ${
              post.type === 'poll' ? 'bg-white border-brand-purple/20' : 'bg-white border-gray-100'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                    {post.user}
                    {post.type === 'poll' && <ShieldCheck size={14} className="text-brand-purple" />}
                  </h4>
                  {post.isNew && (
                    <span className="bg-brand-lime text-brand-dark text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {post.time}
                  {post.messName && (
                    <>
                      <span>•</span>
                      <span className="text-brand-purple font-medium bg-brand-purple/5 px-1.5 rounded text-[10px]">
                        Only for {post.messName}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-gray-600">
                <span className="material-symbols-rounded">more_horiz</span>
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-800 text-sm mb-4 leading-relaxed font-medium">{post.content}</p>

            {/* Poll Logic */}
            {post.type === 'poll' && post.pollOptions && (
              <div className="space-y-3 mb-4">
                {post.pollOptions.map((option, index) => {
                  const percentage = post.totalVotes ? Math.round((option.votes / post.totalVotes) * 100) : 0;
                  const isSelected = post.userVoted === index;
                  
                  return (
                    <div key={index} className="relative">
                      <button
                        onClick={() => handleVote(post.id, index)}
                        disabled={post.userVoted !== null}
                        className="w-full relative h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-between px-4 z-10"
                      >
                        <span className={`text-sm font-medium z-20 ${isSelected ? 'text-brand-purple' : 'text-gray-700'}`}>
                          {option.label}
                        </span>
                        
                        {post.userVoted !== null && (
                          <div className="flex items-center gap-2 z-20">
                            <span className="text-sm font-bold text-gray-900">
                              {percentage}%
                            </span>
                            {isSelected && <Check size={16} className="text-brand-purple" />}
                          </div>
                        )}
                      </button>
                      
                      {/* Progress Bar Background */}
                      {post.userVoted !== null && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`absolute inset-y-0 left-0 rounded-xl z-0 ${isSelected ? 'bg-brand-purple/20' : 'bg-gray-200'}`}
                        />
                      )}
                    </div>
                  );
                })}
                <p className="text-xs text-gray-400 text-right">{post.totalVotes} votes</p>
              </div>
            )}

            {/* Tags (Text Post) */}
            {post.type === 'text' && post.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-brand-purple text-xs font-medium bg-brand-purple/10 px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-gray-500 text-sm">
              <button className="flex items-center gap-1 hover:text-brand-purple transition-colors">
                <span className="material-symbols-rounded text-lg">thumb_up</span>
                {post.likes || 0}
              </button>
              <button className="flex items-center gap-1 hover:text-brand-purple transition-colors">
                <span className="material-symbols-rounded text-lg">comment</span>
                {post.comments || 0}
              </button>
              <button className="flex items-center gap-1 hover:text-brand-purple transition-colors">
                <span className="material-symbols-rounded text-lg">share</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />

      {/* Create Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                <button 
                  onClick={() => setShowPostModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind? Ask the community..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all mb-4 text-sm"
              />
              
              <button 
                onClick={handleCreatePost}
                disabled={isSubmitting || !newPostContent.trim()}
                className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-dark/20 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Post to Community'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
