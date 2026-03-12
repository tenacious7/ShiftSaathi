import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { ShoppingBag, Tag, MapPin, Search, Filter, Plus, Heart } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Loader from '../components/Loader';

interface Item {
  id: string; // Changed to string since it's a UUID in DB
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  image: string;
  seller: string;
  time: string;
  expiresIn: string; // e.g., "2 days", "5 hours"
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]); // Changed to string[]
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist).map((item: Item) => item.id));
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        // 1. Get user session to find their location
        const { data: { session } } = await supabase.auth.getSession();
        let userLocation = 'Bangalore'; // Default fallback

        if (session) {
          // Fetch user profile to get location
          const response = await fetch(`/api/profile/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            // Assuming user_details has location, or we just use a default for now
            if (data.user && data.user.location) {
              userLocation = data.user.location;
            }
          }
        }

        // 2. Fetch marketplace items based on location
        const itemsResponse = await fetch(`/api/marketplace/${encodeURIComponent(userLocation)}`);
        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          // Map the backend data to the frontend Item interface
          const formattedItems = itemsData.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            category: 'Others', // Defaulting since it's not in the DB schema provided
            condition: 'Good', // Defaulting
            location: item.location,
            image: item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            seller: item.users?.full_name || 'Unknown Seller',
            time: new Date(item.created_at).toLocaleDateString(),
            expiresIn: '7 days', // Defaulting
          }));
          setItems(formattedItems);
        }
      } catch (error) {
        console.error('Error fetching marketplace items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const toggleWishlist = (item: Item) => {
    let updatedWishlistItems: Item[] = [];
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      updatedWishlistItems = JSON.parse(storedWishlist);
    }

    if (wishlist.includes(item.id)) {
      updatedWishlistItems = updatedWishlistItems.filter((i) => i.id !== item.id);
      setWishlist(prev => prev.filter(id => id !== item.id));
    } else {
      updatedWishlistItems.push(item);
      setWishlist(prev => [...prev, item.id]);
    }

    localStorage.setItem('wishlist', JSON.stringify(updatedWishlistItems));
  };

  const categories = ['All', 'Furniture', 'Electronics', 'Books', 'Appliances', 'Vehicles', 'Others'];

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Marketplace <ShoppingBag className="text-brand-purple" size={24} />
            </h1>
            <p className="text-xs text-gray-500 font-medium">Buy & Sell pre-loved items nearby</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/wishlist')}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors relative"
            >
              <Heart size={20} className={wishlist.length > 0 ? "fill-red-500 text-red-500" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            <button 
              onClick={() => navigate('/sell-item')}
              className="bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand-dark/20 flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <Plus size={18} /> Sell
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for items, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-purple">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="p-6">
          <Loader text="Finding items near you..." />
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
            >
              <button 
                onClick={() => toggleWishlist(item)}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart 
                  size={16} 
                  className={wishlist.includes(item.id) ? "fill-red-500 text-red-500" : ""} 
                />
              </button>

              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Condition Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold shadow-sm text-gray-700 uppercase tracking-wider">
                  {item.condition}
                </div>

                {/* Expiry Badge */}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-medium shadow-sm text-white flex items-center gap-1.5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse shadow-[0_0_8px_rgba(132,204,22,0.8)]"></span>
                  Expires in {item.expiresIn}
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight flex-1">{item.title}</h3>
                  <p className="text-brand-purple font-bold text-sm whitespace-nowrap">₹{item.price.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-3">
                  <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">
                    {item.seller.charAt(0)}
                  </div>
                  <span className="truncate max-w-[80px]">{item.seller}</span>
                  <span className="text-gray-300">•</span>
                  <MapPin size={10} />
                  <span className="truncate">{item.location.split(',')[0]}</span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm active:scale-95">
                    Contact
                  </button>
                  {/* Mocking seller view for demonstration - usually checked against current user ID */}
                  {index === 0 && (
                    <button className="px-3 py-2 rounded-lg bg-brand-purple/10 text-brand-purple text-xs font-bold hover:bg-brand-purple hover:text-white transition-colors border border-brand-purple/20 active:scale-95">
                      Extend
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or category filter.</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
