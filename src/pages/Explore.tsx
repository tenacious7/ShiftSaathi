import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, Heart } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const CATEGORIES = ['All', 'PGs', 'Mess', 'Rentals', 'Laundry'];

const DEMO_PROPERTIES = [
  {
    id: 1,
    name: 'Sai Residency',
    type: 'PGs',
    rating: 4.5,
    reviews: 128,
    location: 'Koramangala, Bangalore',
    price: '₹8,500',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Trending',
    amenities: ['WiFi', 'AC', 'Food'],
  },
  {
    id: 2,
    name: 'Green View PG',
    type: 'PGs',
    rating: 4.2,
    reviews: 84,
    location: 'HSR Layout, Bangalore',
    price: '₹7,000',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'New',
    amenities: ['WiFi', 'Washing Machine'],
  },
  {
    id: 3,
    name: 'Annapurna Mess',
    type: 'Mess',
    rating: 4.8,
    reviews: 342,
    location: 'BTM Layout, Bangalore',
    price: '₹3,000',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Popular',
    amenities: ['Veg', 'Non-Veg', 'Delivery'],
  },
  {
    id: 4,
    name: 'Cozy Studio Apartment',
    type: 'Rentals',
    rating: 4.9,
    reviews: 56,
    location: 'Indiranagar, Bangalore',
    price: '₹18,000',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1e5250a236?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Premium',
    amenities: ['Furnished', 'Parking', 'Gym'],
  }
];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = DEMO_PROPERTIES.filter(prop => {
    const matchesCategory = activeCategory === 'All' || prop.type === activeCategory;
    const matchesSearch = prop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prop.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg-light pb-24 font-sans">
      {/* Header & Search */}
      <div className="bg-white px-4 pt-6 pb-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-brand-dark mb-4">Explore</h1>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all text-sm"
            />
          </div>
          <button className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto mt-4 pb-2 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === category 
                  ? 'bg-brand-dark text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <p className="text-sm font-bold text-gray-500 mb-2">
          Showing {filteredProperties.length} results
        </p>
        
        {filteredProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/pg-details/${property.id}`} className="block card p-0 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm text-brand-dark">
                  {property.type}
                </div>
                {property.tag && (
                  <div className="absolute top-3 right-3 bg-brand-purple text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {property.tag}
                  </div>
                )}
                <button 
                  className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    // Toggle wishlist logic here
                  }}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-brand-dark line-clamp-1">{property.name}</h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md shrink-0">
                    <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                    <span className="text-xs font-bold text-green-700">{property.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
                  {property.amenities.map(amenity => (
                    <span key={amenity} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md whitespace-nowrap">
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xl font-extrabold text-brand-dark">{property.price}</span>
                    <span className="text-xs font-medium text-gray-400">/month</span>
                  </div>
                  <span className="text-sm font-bold text-brand-purple group-hover:underline">View Details</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">No results found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
