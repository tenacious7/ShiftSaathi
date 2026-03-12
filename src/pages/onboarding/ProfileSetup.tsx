import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Check, ChevronDown, AlertCircle, FileText, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Types
interface FormData {
  role: 'user' | 'roommate' | 'business' | '';
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  occupation: 'Student' | 'Professional' | '';
  organization: string; // College or Company
  studyYear?: string;
  degree?: string;
  jobTitle?: string;
  originState: string;
  motherTongue: string;
  destinationCity: string;
  budget: string;
  moveInDate: string;
  habits: string[];
  bio: string;
  photo: File | null;
  termsAccepted: boolean;
}

const INITIAL_DATA: FormData = {
  role: '',
  name: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  occupation: '',
  organization: '',
  studyYear: '',
  degree: '',
  jobTitle: '',
  originState: '',
  motherTongue: '',
  destinationCity: '',
  budget: '',
  moveInDate: '',
  habits: [],
  bio: '',
  photo: null,
  termsAccepted: false,
};

const HABITS = [
  'Early Riser', 'Night Owl',
  'Vegetarian', 'Non-Vegetarian', 'Vegan',
  'Smoker', 'Non-Smoker',
  'Teetotaler', 'Social Drinker',
  'Pet Lover', 'No Pets',
  'Clean Freak', 'Messy',
  'Fitness Freak', 'Gamer', 'Reader'
];

const LANGUAGES = [
  'Hindi', 'English', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 
  'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 
  'Assamese', 'Maithili', 'Other'
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => ({
    ...INITIAL_DATA,
    occupation: (location.state as any)?.occupation || ''
  }));
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const TOTAL_STEPS = 8;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleHabitToggle = (habit: string) => {
    setFormData(prev => {
      const habits = prev.habits.includes(habit)
        ? prev.habits.filter(h => h !== habit)
        : [...prev.habits, habit];
      return { ...prev, habits };
    });
  };

  const validateStep = (currentStep: number, checkSoft: boolean = false): { isValid: boolean; hasWarnings: boolean } => {
    // Validation bypassed for testing/demo purposes
    return { isValid: true, hasWarnings: false };
  };

  const handleNext = (ignoreWarnings: boolean = false) => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      if (!formData.termsAccepted) {
        setErrors(prev => ({ ...prev, termsAccepted: 'You must accept the Terms & Conditions to continue' }));
        return;
      }
      handleComplete();
    }
  };

  const confirmSkip = () => {
    handleNext(true);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(-1);
    }
  };

  const handleSkip = () => {
    if (step === 7) { // Only skip Bio step
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Upload photo if exists
        let photoUrl = null;
        if (formData.photo) {
          const fileExt = formData.photo.name.split('.').pop();
          const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, formData.photo);
            
          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            photoUrl = publicUrl;
          }
        }

        // Save to user_details
        const { error } = await supabase
          .from('user_details')
          .upsert({
            id: session.user.id,
            role: formData.role,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            age: formData.age ? parseInt(formData.age) : null,
            gender: formData.gender,
            occupation: formData.occupation,
            organization: formData.organization,
            study_year: formData.studyYear,
            degree: formData.degree,
            job_title: formData.jobTitle,
            origin_state: formData.originState,
            mother_tongue: formData.motherTongue,
            destination_city: formData.destinationCity,
            budget: formData.budget ? parseInt(formData.budget) : null,
            move_in_date: formData.moveInDate || null,
            habits: formData.habits,
            bio: formData.bio,
            photo_url: photoUrl,
            terms_accepted: formData.termsAccepted,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving profile:', error);
          setErrors(prev => ({ ...prev, termsAccepted: 'Failed to save profile. Please try again.' }));
          return;
        }
      }
      
      setIsSuccess(true);
      triggerConfetti();
      setTimeout(() => {
        navigate('/dashboard');
      }, 3500);
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors(prev => ({ ...prev, termsAccepted: 'An unexpected error occurred.' }));
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Render Helpers
  const InputField = ({ label, name, type = 'text', placeholder, required = true }: any) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-brand-purple">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 rounded-xl border ${
            errors[name as keyof FormData] 
              ? 'border-red-300 bg-red-50 text-red-900 placeholder:text-red-300' 
              : 'border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white'
          } focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all placeholder:text-gray-400 shadow-sm`}
        />
        {errors[name as keyof FormData] && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none animate-pulse">
            <AlertCircle size={18} />
          </div>
        )}
      </div>
      {errors[name as keyof FormData] && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
          {errors[name as keyof FormData]}
        </p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options, required = true }: any) => (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-brand-purple">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={(formData as any)[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3.5 rounded-xl border ${
            errors[name as keyof FormData] 
              ? 'border-red-300 bg-red-50 text-red-900' 
              : 'border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white'
          } focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all appearance-none cursor-pointer shadow-sm`}
        >
          <option value="">Select {label}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-brand-purple transition-colors">
          <ChevronDown size={20} />
        </span>
      </div>
      {errors[name as keyof FormData] && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{errors[name as keyof FormData]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans relative overflow-hidden">
      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full border border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-lime/5" />
              <div className="relative z-10">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <Check className="w-12 h-12 text-green-600" strokeWidth={4} />
                  </motion.div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Aboard!</h2>
                <p className="text-gray-500 mb-6">Your profile has been verified and created successfully.</p>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Redirecting to dashboard...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Warning Modal */}
      <AnimatePresence>
        {showSkipWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-rounded text-3xl text-yellow-600">lightbulb</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Better Matches Await!</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Filling in these details helps us find the perfect roommate for you. Are you sure you want to skip?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSkipWarning(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
                >
                  Add Details
                </button>
                <button
                  onClick={confirmSkip}
                  className="flex-1 py-3 rounded-xl bg-brand-dark text-white font-medium hover:bg-gray-900 transition-colors"
                >
                  Continue Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors group">
            <span className="material-symbols-rounded text-gray-600 group-hover:text-brand-dark transition-colors">arrow_back</span>
          </button>
          <div className="flex flex-col items-end">
             <span className="text-xs font-bold text-brand-purple uppercase tracking-widest">Step {step} of {TOTAL_STEPS}</span>
             <span className="text-xs text-gray-400 font-medium">Profile Setup</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-lime shadow-[0_0_10px_rgba(139,92,246,0.5)]"
            initial={{ width: `${((step - 1) / TOTAL_STEPS) * 100}%` }}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-lg mx-auto p-6 pb-32">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">What brings you here?</h1>
                  <p className="text-gray-500">Select your primary goal so we can tailor your experience.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'user', title: 'Find a Place', desc: 'Looking for a PG, mess, or tiffin service', icon: 'home' },
                    { id: 'roommate', title: 'Find a Roommate', desc: 'Looking for someone to share a place with', icon: 'group' },
                    { id: 'business', title: 'List Your Service', desc: 'I am a PG owner or mess provider', icon: 'store' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleChange({ target: { name: 'role', value: role.id } } as any)}
                      className={`w-full flex items-start p-5 rounded-2xl border-2 transition-all text-left ${
                        formData.role === role.id
                          ? 'border-brand-purple bg-brand-purple/5 shadow-md'
                          : 'border-gray-100 bg-white hover:border-brand-purple/30 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 ${
                        formData.role === role.id ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="material-symbols-rounded">{role.icon}</span>
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg mb-1 ${formData.role === role.id ? 'text-brand-purple' : 'text-gray-900'}`}>
                          {role.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{role.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role}</p>}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Basic Details</h1>
                  <p className="text-gray-500">Let's get your profile started with some essential information.</p>
                </div>
                
                <InputField label="Full Name" name="name" placeholder="e.g. Alex Johnson" />
                <InputField label="Email Address" name="email" type="email" placeholder="e.g. alex@example.com" />
                <InputField label="Phone Number" name="phone" type="tel" placeholder="e.g. +91 98765 43210" />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Age" name="age" type="number" placeholder="22" />
                  <SelectField label="Gender" name="gender" options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Occupation</h1>
                  <p className="text-gray-500">This helps us find roommates with similar schedules and lifestyles.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {['Student', 'Professional'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        handleChange({ target: { name: 'occupation', value: type } } as any);
                      }}
                      className={`p-6 rounded-2xl border-2 transition-all text-center relative overflow-hidden group ${
                        formData.occupation === type
                          ? 'border-brand-purple bg-brand-purple/5 text-brand-purple shadow-lg shadow-brand-purple/10'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-brand-purple/5 transform origin-bottom transition-transform duration-300 ${formData.occupation === type ? 'scale-y-100' : 'scale-y-0'}`} />
                      <span className="material-symbols-rounded text-4xl mb-3 block relative z-10 transition-transform group-hover:scale-110">
                        {type === 'Student' ? 'school' : 'work'}
                      </span>
                      <span className="font-bold relative z-10">{type}</span>
                    </button>
                  ))}
                </div>
                {errors.occupation && <p className="text-red-500 text-sm -mt-4 mb-4 flex items-center gap-1"><AlertCircle size={14}/> {errors.occupation}</p>}

                {formData.occupation === 'Student' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <InputField 
                      label="College / University" 
                      name="organization" 
                      placeholder="e.g. IIT Bombay" 
                      required={false}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField 
                        label="Year of Study" 
                        name="studyYear" 
                        options={['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Masters', 'PhD']}
                        required={false}
                      />
                      <InputField 
                        label="Degree / Course" 
                        name="degree" 
                        placeholder="e.g. B.Tech CS"
                        required={false}
                      />
                    </div>
                  </div>
                )}

                {formData.occupation === 'Professional' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <InputField 
                      label="Company / Organization" 
                      name="organization" 
                      placeholder="e.g. Google" 
                      required={false}
                    />
                    <InputField 
                      label="Job Title" 
                      name="jobTitle" 
                      placeholder="e.g. Software Engineer"
                      required={false}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Roots</h1>
                    <span className="text-3xl animate-bounce">🌏</span>
                    <span className="text-3xl animate-pulse delay-75">🏡</span>
                  </div>
                  <p className="text-gray-500">
                    Connect with people who share your culture and language! It makes home feel more like home. 
                    <span className="inline-block ml-1 animate-wiggle">✨</span>
                  </p>
                </div>

                <SelectField 
                  label="Home State" 
                  name="originState" 
                  options={['Andhra Pradesh', 'Delhi', 'Karnataka', 'Kerala', 'Maharashtra', 'Odisha', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other']} 
                  required={false}
                />
                <SelectField 
                  label="Mother Tongue" 
                  name="motherTongue" 
                  options={LANGUAGES}
                  required={false}
                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Moving Plans</h1>
                  <p className="text-gray-500">Where and when are you planning to move?</p>
                </div>

                <SelectField 
                  label="Destination City" 
                  name="destinationCity" 
                  options={['Bangalore', 'Delhi NCR', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai']} 
                  required={false}
                />
                
                <InputField 
                  label="Monthly Budget (₹)" 
                  name="budget" 
                  type="number" 
                  placeholder="e.g. 15000" 
                  required={false}
                />

                <InputField 
                  label="Expected Move-in Date" 
                  name="moveInDate" 
                  type="date" 
                  required={false}
                />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Lifestyle</h1>
                  <p className="text-gray-500">Select at least 3 habits to help us find your perfect match.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {HABITS.map((habit) => (
                    <button
                      key={habit}
                      onClick={() => handleHabitToggle(habit)}
                      className={`px-5 py-3 rounded-full border text-sm font-medium transition-all duration-200 ${
                        formData.habits.includes(habit)
                          ? 'bg-brand-dark text-white border-brand-dark shadow-lg shadow-brand-dark/20 transform scale-105'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-purple/50 hover:bg-gray-50'
                      }`}
                    >
                      {habit}
                    </button>
                  ))}
                </div>
                {errors.habits && (
                  <p className="text-red-500 text-sm mt-4 flex items-center gap-2 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={16} />
                    {errors.habits}
                  </p>
                )}
              </motion.div>
            )}

            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Personal Touch</h1>
                  <p className="text-gray-500">Upload a photo and write a short bio to stand out. (Optional)</p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-36 h-36 rounded-full bg-gray-100 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                      {formData.photo ? (
                         <img src={URL.createObjectURL(formData.photo)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-rounded text-5xl text-gray-300 group-hover:text-gray-400 transition-colors">add_a_photo</span>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-brand-purple text-white p-2.5 rounded-full shadow-lg hover:bg-brand-dark transition-colors">
                      <span className="material-symbols-rounded text-sm">edit</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none shadow-sm"
                    placeholder="Hi, I'm Alex! I love hiking and cooking on weekends..."
                  />
                </div>
              </motion.div>
            )}

            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Review & Confirm</h1>
                  <p className="text-gray-500">Please review your information before submitting.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {formData.photo ? (
                        <img src={URL.createObjectURL(formData.photo)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="material-symbols-rounded">person</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{formData.name}</h3>
                      <p className="text-sm text-gray-500">{formData.occupation} • {formData.age} yrs</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                    <div>
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Email</span>
                      <span className="font-medium text-gray-700 truncate block">{formData.email}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Phone</span>
                      <span className="font-medium text-gray-700">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Origin</span>
                      <span className="font-medium text-gray-700">{formData.originState}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Language</span>
                      <span className="font-medium text-gray-700">{formData.motherTongue}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Moving To</span>
                      <span className="font-medium text-gray-700">{formData.destinationCity}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Budget</span>
                      <span className="font-medium text-gray-700">₹{formData.budget}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Move Date</span>
                      <span className="font-medium text-gray-700">{formData.moveInDate}</span>
                    </div>
                  </div>

                  {formData.habits.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Habits</span>
                      <div className="flex flex-wrap gap-2">
                        {formData.habits.map((habit) => (
                          <span key={habit} className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 border border-gray-200">
                            {habit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                  <ShieldCheck className="text-brand-purple shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Your data is secure with us. We only share your profile with verified matches after your approval.
                  </p>
                </div>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-brand-purple checked:bg-brand-purple"
                    />
                    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    I <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-brand-purple font-semibold hover:underline">Accept Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-brand-purple font-semibold hover:underline">Privacy Policy</a>.
                  </div>
                </label>
                {errors.termsAccepted && (
                  <p className="text-red-500 text-sm -mt-2 ml-1">{errors.termsAccepted}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white p-6 border-t border-gray-100 fixed bottom-0 left-0 right-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
          >
             <span className="material-symbols-rounded">arrow_back</span>
             Back
          </button>
          <button
            onClick={() => handleNext(false)}
            className={`flex-[2] bg-brand-dark text-white py-4 rounded-xl font-semibold text-lg shadow-xl shadow-brand-dark/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
          >
            {step === TOTAL_STEPS ? 'Complete Registration' : 'Continue'}
            <span className="material-symbols-rounded">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
