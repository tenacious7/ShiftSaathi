import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  text?: string;
}

export default function Loader({ text }: LoaderProps) {
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSettled((prev) => !prev);
    }, 2000); // Toggle between shifting and settled every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[250px] bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
      <div className="relative w-16 h-16 flex items-center justify-center mb-4">
        <AnimatePresence mode="wait">
          {!isSettled ? (
            <motion.div
              key="box"
              initial={{ opacity: 0, x: -15, scale: 0.9 }}
              animate={{ opacity: 1, x: 10, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute"
            >
              {/* Cardboard Box SVG */}
              <svg 
                className="w-10 h-10 stroke-teal-600 fill-none" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                viewBox="0 0 24 24"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="absolute animate-pulse"
            >
              {/* Home with Heart SVG */}
              <svg 
                className="w-12 h-12 stroke-teal-600 fill-none" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                viewBox="0 0 24 24"
              >
                {/* House Outline */}
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                {/* Heart Inside */}
                <path 
                  d="M12 18l-2.5-2.5a1.5 1.5 0 0 1 2.12-2.12L12 13.79l.38-.38a1.5 1.5 0 0 1 2.12 2.12L12 18z" 
                  className="fill-teal-600/20" 
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <motion.p 
        key={isSettled ? 'settled' : 'shifting'}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-semibold text-teal-700 tracking-wide"
      >
        {text || (isSettled ? 'Settling in...' : 'Shifting gears...')}
      </motion.p>
    </div>
  );
}
