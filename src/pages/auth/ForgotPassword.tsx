import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset link
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans relative overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Communication" 
          className="w-full h-[50vh] object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/80 to-brand-dark" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-16 pb-8 px-6 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-brand-lime rounded-2xl flex items-center justify-center shadow-lg shadow-brand-lime/20 mb-6"
        >
          <div className="w-6 h-6 bg-brand-dark rounded-full" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl font-extrabold text-white tracking-tight"
        >
          Reset Password
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-2 text-brand-lime/80 font-medium"
        >
          We'll send you a recovery link
        </motion.p>
      </div>

      {/* Bottom Sheet Form */}
      <motion.div 
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.3 }}
        className="relative z-10 flex-1 bg-white rounded-t-[40px] px-6 pt-10 pb-12 shadow-2xl flex flex-col"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
        
        {!isSubmitted ? (
          <form className="space-y-5 flex-1" onSubmit={handleReset}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5 ml-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl shadow-lg shadow-brand-dark/20 text-base font-bold text-white bg-brand-dark hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Reset Link
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex-1 flex flex-col items-center justify-center py-8"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">Check your email</h3>
            <p className="mt-3 text-base text-gray-500 max-w-xs mx-auto">
              We've sent a password reset link to <br/>
              <span className="font-bold text-gray-900">{email}</span>
            </p>
            <div className="mt-8">
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-bold text-brand-purple hover:text-brand-dark transition-colors"
              >
                Didn't receive the email? Click to resend
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
