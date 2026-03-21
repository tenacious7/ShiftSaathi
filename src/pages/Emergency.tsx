import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';

export default function Emergency() {
  const quickAccess = [
    { icon: 'local_hospital', label: 'Hospital', color: 'bg-red-500 text-white', number: '102' },
    { icon: 'local_police', label: 'Police', color: 'bg-blue-600 text-white', number: '100' },
    { icon: 'ambulance', label: 'Ambulance', color: 'bg-green-500 text-white', number: '108' },
  ];

  const safetyTools = [
    { icon: 'sos', label: 'SOS', color: 'bg-red-100 text-red-600' },
    { icon: 'share_location', label: 'Share Location', color: 'bg-blue-100 text-blue-600' },
    { icon: 'notifications_active', label: 'Safety Alerts', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-bg-light pb-24">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-symbols-rounded text-gray-600">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <span className="material-symbols-rounded">emergency</span>
            Emergency Hub
          </h1>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Quick Access */}
        <div className="grid grid-cols-3 gap-4">
          {quickAccess.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md active:scale-95 transition-transform ${item.color}`}
            >
              <span className="material-symbols-rounded text-4xl mb-2">{item.icon}</span>
              <span className="font-bold text-sm">{item.label}</span>
              <span className="text-xs opacity-80">{item.number}</span>
            </motion.button>
          ))}
        </div>

        {/* Safety Toolkit */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Safety Toolkit</h2>
          <div className="grid grid-cols-3 gap-4">
            {safetyTools.map((tool) => (
              <button
                key={tool.label}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 bg-white`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${tool.color}`}>
                  <span className="material-symbols-rounded text-2xl">{tool.icon}</span>
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Facilities Map Placeholder */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Nearby Facilities</h2>
          <div className="h-48 bg-gray-200 rounded-2xl relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
              Map View
            </div>
            {/* Add a real map component here if needed */}
          </div>
        </div>

        {/* Local Alerts */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-rounded text-yellow-600 text-xl mt-0.5">warning</span>
          <div>
            <h3 className="font-bold text-yellow-800 text-sm mb-1">Heavy Rain Alert</h3>
            <p className="text-xs text-yellow-700">Expect heavy rainfall in your area for the next 2 hours. Stay indoors if possible.</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
