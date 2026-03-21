import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, ChevronDown, AlertCircle, Store, Utensils, Home } from 'lucide-react';

interface BusinessData {
  businessType: 'PG' | 'Mess' | 'Tiffin' | '';
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  price: string;
  description: string;
  amenities: string[];
  // Specifics
  sharingType?: string; // For PG
  mealType?: string; // For Mess
}

const INITIAL_DATA: BusinessData = {
  businessType: '',
  businessName: '',
  ownerName: '',
  phone: '',
  email: '',
  city: '',
  address: '',
  price: '',
  description: '',
  amenities: [],
  sharingType: '',
  mealType: '',
};

const AMENITIES = ['WiFi', 'AC', 'Power Backup', 'Laundry', 'Cleaning', 'Parking', 'CCTV', 'Meals Included'];

export default function BusinessSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BusinessData>(INITIAL_DATA);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessData, string>>>({});

  const TOTAL_STEPS = 4;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BusinessData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const validateStep = (currentStep: number): boolean => {
    // Validation bypassed for testing/demo purposes
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/onboarding/account-type');
    }
  };

  const handleComplete = () => {
    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      navigate('/business'); // Navigate to business dashboard
    }, 3000);
  };

  const InputField = ({ label, name, type = 'text', placeholder, required = true }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${
          errors[name as keyof BusinessData] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
        } focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all`}
      />
      {errors[name as keyof BusinessData] && (
        <p className="mt-1 text-xs text-red-500">{errors[name as keyof BusinessData]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-6 py-4 sticky top-0 z-40 border-b border-gray-100 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <span className="material-symbols-rounded text-gray-600">arrow_back</span>
        </button>
        <div className="text-center">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">Step {step} of {TOTAL_STEPS}</span>
          <p className="text-xs text-gray-400 font-medium">Business Registration</p>
        </div>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full p-6 pb-32">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">What are you listing?</h1>
              <p className="text-gray-500 mb-6">Select the type of service you want to add.</p>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'PG', label: 'PG / Hostel', icon: Home, desc: 'Rent rooms or beds' },
                  { id: 'Mess', label: 'Mess Service', icon: Utensils, desc: 'Daily meals & tiffins' },
                  { id: 'Tiffin', label: 'Tiffin Service', icon: Store, desc: 'Home-cooked food delivery' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, businessType: type.id as any }));
                      setErrors(prev => ({ ...prev, businessType: undefined }));
                    }}
                    className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                      formData.businessType === type.id
                        ? 'border-brand-purple bg-brand-purple/5'
                        : 'border-gray-200 hover:border-brand-purple/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      formData.businessType === type.id ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <type.icon size={24} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${formData.businessType === type.id ? 'text-brand-purple' : 'text-gray-900'}`}>
                        {type.label}
                      </h3>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.businessType && <p className="text-red-500 text-sm mt-2">{errors.businessType}</p>}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Basic Details</h1>
              <p className="text-gray-500 mb-6">Tell us about your business.</p>

              <InputField label="Business Name" name="businessName" placeholder="e.g. Sharma PG" />
              <InputField label="Owner Name" name="ownerName" placeholder="Your Full Name" />
              <InputField label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" />
              <InputField label="Email (Optional)" name="email" type="email" placeholder="business@example.com" required={false} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Location & Pricing</h1>
              <p className="text-gray-500 mb-6">Where is it located and how much does it cost?</p>

              <InputField label="City" name="city" placeholder="e.g. Bangalore" />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple outline-none"
                  placeholder="#123, Street Name, Area..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label={formData.businessType === 'PG' ? 'Monthly Rent (₹)' : 'Monthly Price (₹)'} name="price" type="number" placeholder="5000" />
                
                {formData.businessType === 'PG' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sharing Type</label>
                    <select
                      name="sharingType"
                      value={formData.sharingType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                    </select>
                  </div>
                )}
                
                {(formData.businessType === 'Mess' || formData.businessType === 'Tiffin') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                    <select
                      name="mealType"
                      value={formData.mealType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Veg">Veg Only</option>
                      <option value="Non-Veg">Non-Veg Only</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Features & Description</h1>
              <p className="text-gray-500 mb-6">What makes your place special?</p>

              {formData.businessType === 'PG' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map(amenity => (
                      <button
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                          formData.amenities.includes(amenity)
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple outline-none"
                  placeholder="Describe your rules, food menu, or special features..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-white p-6 border-t border-gray-100 fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {step === TOTAL_STEPS ? 'Register Business' : 'Continue'}
            <span className="material-symbols-rounded">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" strokeWidth={4} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
              <p className="text-gray-500">Your business profile has been created successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
