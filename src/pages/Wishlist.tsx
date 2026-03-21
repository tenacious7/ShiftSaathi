import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Search } from 'lucide-react';

interface Item {
  id: number;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  image: string;
  seller: string;
  time: string;
}

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<Item[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  const removeFromWishlist = (id: number) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sticky top-0 z-40 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate('/marketplace')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-rounded text-gray-600">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          My Wishlist <Heart className="text-red-500 fill-red-500" size={24} />
        </h1>
      </div>

      {/* Items Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {wishlistItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
          >
            <button 
              onClick={() => removeFromWishlist(item.id)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Heart size={16} className="fill-red-500" />
            </button>

            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm text-white">
                {item.condition}
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{item.title}</h3>
              </div>
              <p className="text-brand-purple font-bold text-lg mb-2">₹{item.price.toLocaleString()}</p>
              
              <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-3">
                <MapPin size={12} />
                <span className="truncate">{item.location}</span>
              </div>

              <button className="w-full py-2 rounded-lg bg-gray-50 text-brand-dark text-xs font-bold hover:bg-brand-lime hover:text-brand-dark transition-colors border border-gray-100">
                Contact Seller
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {wishlistItems.length === 0 && (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-gray-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Your wishlist is empty</h3>
          <p className="text-gray-500 text-sm mb-6">Explore the marketplace and save items you like!</p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-purple/20 hover:bg-brand-dark transition-colors"
          >
            Explore Marketplace
          </button>
        </div>
      )}
    </div>
  );
}
