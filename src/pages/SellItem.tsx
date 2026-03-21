import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Camera, UploadCloud, DollarSign, Tag, MapPin, FileText, ShoppingBag, ArrowLeft, ImagePlus, X, Calendar } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface SellItemData {
  title: string;
  price: string;
  category: string;
  condition: string;
  description: string;
  location: string;
  expiryDate: string;
  image: File | null;
}

const INITIAL_DATA: SellItemData = {
  title: '',
  price: '',
  category: '',
  condition: '',
  description: '',
  location: '',
  expiryDate: '',
  image: null,
};

const CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Appliances', 'Vehicles', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function SellItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SellItemData>(INITIAL_DATA);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SellItemData, string>>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SellItemData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SellItemData, string>> = {};
    let isValid = true;

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.image) newErrors.image = 'Please upload at least one photo';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert('You must be logged in to post an item.');
          setIsSubmitting(false);
          return;
        }

        // Use a placeholder image if we don't have Supabase Storage configured for uploads yet
        const imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

        const response = await fetch('/api/marketplace/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            seller_id: session.user.id,
            title: formData.title,
            description: formData.description,
            price: formData.price,
            image: imageUrl,
            location: formData.location,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to post item');
        }

        setIsSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          navigate('/marketplace');
        }, 2000);
      } catch (error) {
        console.error('Error posting item:', error);
        alert('Failed to post item. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon }: any) => (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 border rounded-2xl outline-none transition-all text-sm ${
            errors[name as keyof SellItemData] 
              ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400' 
              : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple'
          }`}
        />
      </div>
      {errors[name as keyof SellItemData] && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{errors[name as keyof SellItemData]}</p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options, icon: Icon }: any) => (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <select
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          className={`block w-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3.5 border rounded-2xl outline-none transition-all text-sm appearance-none ${
            errors[name as keyof SellItemData] 
              ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400' 
              : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple'
          }`}
        >
          <option value="" disabled>Select {label}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {errors[name as keyof SellItemData] && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-red-500">{errors[name as keyof SellItemData]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-28">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-3 shadow-sm">
        <button 
          onClick={() => navigate('/marketplace')} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Post an Ad</h1>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Premium Image Upload Card */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Photos</h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Max 1</span>
            </div>
            
            <div className="relative">
              {previewUrl ? (
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group shadow-inner">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors">
                      Change Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                  <button 
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className={`relative cursor-pointer w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden ${
                  errors.image 
                    ? 'border-red-300 bg-red-50 hover:bg-red-100/50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-brand-purple/5 hover:border-brand-purple/50'
                }`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4=')] opacity-50" />
                  
                  <div className="relative z-10 w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center text-brand-purple mb-1 group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                  <div className="relative z-10 text-center">
                    <span className="block text-sm font-bold text-gray-900">Add a photo</span>
                    <span className="block text-xs font-medium text-gray-500 mt-1">Tap to browse gallery</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-xs font-medium mt-3 ml-1">{errors.image}</p>}
          </div>

          {/* Form Fields Card */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-1">
            <h2 className="text-base font-bold text-gray-900 mb-5">Item Details</h2>
            
            <InputField label="Ad Title" name="title" placeholder="e.g. Wooden Study Table" icon={ShoppingBag} />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Price (₹)" name="price" type="number" placeholder="1500" icon={DollarSign} />
              <SelectField label="Category" name="category" options={CATEGORIES} icon={Tag} />
            </div>

            <SelectField label="Condition" name="condition" options={CONDITIONS} icon={Check} />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Location" name="location" placeholder="e.g. Koramangala" icon={MapPin} />
              <InputField label="Expiry Date" name="expiryDate" type="date" icon={Calendar} />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`block w-full pl-11 pr-4 py-3.5 border rounded-2xl outline-none transition-all text-sm resize-none ${
                    errors.description 
                      ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400' 
                      : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple'
                  }`}
                  placeholder="Describe the item's condition, age, reason for selling..."
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full bg-brand-dark text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-brand-dark/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Posting...' : 'Post Ad Now'}
            {!isSubmitting && <UploadCloud className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 text-center max-w-sm w-full shadow-2xl"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Ad Posted!</h2>
              <p className="text-gray-500 font-medium">Your item is now live and visible to buyers in your area.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
