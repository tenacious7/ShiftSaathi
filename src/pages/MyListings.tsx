import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, CheckCircle2, Bell } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired';
  image: string;
}

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Wooden Study Table',
    price: '₹1,500',
    expiryDate: '2026-03-12',
    status: 'expiring_soon',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    title: 'Office Chair',
    price: '₹2,000',
    expiryDate: '2026-04-05',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=400',
  }
];

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [showNotification, setShowNotification] = useState(false);
  const [extendedItem, setExtendedItem] = useState<string | null>(null);

  const handleExtend = (id: string, title: string) => {
    setExtendedItem(title);
    setShowNotification(true);
    
    // Update local state to reflect extension
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        const current = new Date(item.expiryDate);
        current.setDate(current.getDate() + 30); // Extend by 30 days
        return {
          ...item,
          expiryDate: current.toISOString().split('T')[0],
          status: 'active'
        };
      }
      return item;
    }));

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-3 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">My Ads & Listings</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {listings.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-4"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <span className="font-bold text-brand-purple">{item.price}</span>
                </div>
                
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className={`text-xs font-medium ${
                    item.status === 'expiring_soon' ? 'text-orange-500' : 'text-gray-500'
                  }`}>
                    Expires: {item.expiryDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                  item.status === 'active' ? 'bg-green-50 text-green-600' : 
                  item.status === 'expiring_soon' ? 'bg-orange-50 text-orange-600' : 
                  'bg-red-50 text-red-600'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
                
                <button 
                  onClick={() => handleExtend(item.id, item.title)}
                  className="text-sm font-bold text-white bg-brand-dark px-4 py-1.5 rounded-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Extend
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none"
          >
            <div className="bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm w-full pointer-events-auto">
              <div className="w-8 h-8 bg-brand-purple/20 rounded-full flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-brand-purple" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Extension Request Sent</p>
                <p className="text-xs text-gray-300">Requested 30 more days for {extendedItem}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
