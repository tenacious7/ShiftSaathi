import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, User, Home, MapPin, DollarSign, Users, ShieldCheck, Mail, Smartphone, FileText } from 'lucide-react';

interface RoommateData {
  // Personal
  name: string;
  gender: string;
  age: string;
  occupation: string;
  phone: string;
  
  // Room Preferences
  preferredAreas: string[];
  roomTypePref: string;
  preferredRoommates: string;
  maxRent: string;
  
  // Preferences/Description
  description: string;
  preferences: string[];

  // Verification
  emailVerified: boolean;
  idVerified: boolean;
  phoneVerified: boolean;
}

const INITIAL_DATA: RoommateData = {
  name: '',
  gender: '',
  age: '',
  occupation: '',
  phone: '',
  preferredAreas: [],
  roomTypePref: '',
  preferredRoommates: '',
  maxRent: '',
  description: '',
  preferences: [],
  emailVerified: false,
  idVerified: false,
  phoneVerified: false,
};

const PREFERENCES = ['Non-Smoker', 'Vegetarian', 'Pet Friendly', 'Early Riser', 'Night Owl', 'Clean Freak', 'Party Friendly', 'Student Only'];
const AREAS = ['Koramangala', 'Electronic City', 'Whitefield', 'HSR Layout', 'Indiranagar', 'BTM Layout'];

export default function RoommateSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RoommateData>(INITIAL_DATA);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RoommateData, string>>>({});

  const TOTAL_STEPS = 4;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RoommateData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePrefToggle = (pref: string) => {
    setFormData(prev => {
      const preferences = prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref];
      return { ...prev, preferences };
    });
  };

  const handleAreaToggle = (area: string) => {
    setFormData(prev => {
      const preferredAreas = prev.preferredAreas.includes(area)
        ? prev.preferredAreas.filter(a => a !== area)
        : [...prev.preferredAreas, area];
      return { ...prev, preferredAreas };
    });
  };

  const handleVerification = (type: 'email' | 'id' | 'phone') => {
    // Simulate verification process
    setFormData(prev => ({
      ...prev,
      [`${type}Verified`]: true
    }));
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
      navigate('/dashboard'); // Navigate to main dashboard
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
          errors[name as keyof RoommateData] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
        } focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all`}
      />
      {errors[name as keyof RoommateData] && (
        <p className="mt-1 text-xs text-red-500">{errors[name as keyof RoommateData]}</p>
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
          <p className="text-xs text-gray-400 font-medium">Roommate Profile</p>
        </div>
        <div className="w-8" />
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">About You</h1>
              <p className="text-gray-500 mb-6">Let potential roommates know who you are.</p>

              <InputField label="Full Name" name="name" placeholder="Your Name" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <InputField label="Age" name="age" type="number" placeholder="22" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation *</label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Student">Student</option>
                  <option value="Professional">Working Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <InputField label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Room Preferences</h1>
              <p className="text-gray-500 mb-6">What kind of place are you looking for?</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Area / Locality</label>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map(area => (
                    <button
                      key={area}
                      onClick={() => handleAreaToggle(area)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        formData.preferredAreas.includes(area)
                          ? 'bg-brand-purple text-white border-brand-purple'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  name="roomTypePref"
                  value={formData.roomTypePref}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Private Room">Private Room</option>
                  <option value="Shared Room">Shared Room</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Roommates</label>
                <select
                  name="preferredRoommates"
                  value={formData.preferredRoommates}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <InputField label="Max Rent Willing to Share (₹)" name="maxRent" type="number" placeholder="10000" />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle & Habits</h1>
              <p className="text-gray-500 mb-6">Help us find your perfect match.</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Habits (Tags)</label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCES.map(pref => (
                    <button
                      key={pref}
                      onClick={() => handlePrefToggle(pref)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        formData.preferences.includes(pref)
                          ? 'bg-brand-purple text-white border-brand-purple'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-brand-purple outline-none"
                  placeholder="Tell us more about your lifestyle, hobbies, or what you're looking for..."
                />
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Safety Verification</h1>
              <p className="text-gray-500 mb-6">Verify your profile to get the <span className="font-bold text-brand-purple">Verified Student</span> badge and stand out!</p>

              <div className="space-y-4">
                {/* Email Verification */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.emailVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">College Email</h3>
                      <p className="text-xs text-gray-500">.edu or .ac.in email</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleVerification('email')}
                    disabled={formData.emailVerified}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      formData.emailVerified ? 'bg-green-50 text-green-600' : 'bg-brand-dark text-white hover:bg-gray-800'
                    }`}
                  >
                    {formData.emailVerified ? 'Verified' : 'Verify'}
                  </button>
                </div>

                {/* ID Verification */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.idVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">ID Verification</h3>
                      <p className="text-xs text-gray-500">College ID or Aadhar</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleVerification('id')}
                    disabled={formData.idVerified}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      formData.idVerified ? 'bg-green-50 text-green-600' : 'bg-brand-dark text-white hover:bg-gray-800'
                    }`}
                  >
                    {formData.idVerified ? 'Verified' : 'Verify'}
                  </button>
                </div>

                {/* Phone OTP */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.phoneVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Phone OTP</h3>
                      <p className="text-xs text-gray-500">Verify mobile number</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleVerification('phone')}
                    disabled={formData.phoneVerified}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      formData.phoneVerified ? 'bg-green-50 text-green-600' : 'bg-brand-dark text-white hover:bg-gray-800'
                    }`}
                  >
                    {formData.phoneVerified ? 'Verified' : 'Verify'}
                  </button>
                </div>
              </div>

              {(formData.emailVerified || formData.idVerified || formData.phoneVerified) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-brand-lime/20 border border-brand-lime/40 rounded-xl p-4 flex items-center gap-3"
                >
                  <ShieldCheck className="w-6 h-6 text-brand-dark" />
                  <p className="text-sm font-medium text-brand-dark">
                    Awesome! You'll get the <span className="font-bold">Verified Student</span> badge on your profile.
                  </p>
                </motion.div>
              )}
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
            {step === TOTAL_STEPS ? 'Complete Profile' : 'Continue'}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Created!</h2>
              <p className="text-gray-500">Your roommate profile is ready. Let's find your perfect match!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
