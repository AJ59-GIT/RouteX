
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info } from 'lucide-react';

const PushPermissionBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShow(true), 5000); // Show after 5s
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRequest = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('[Notification] Permission granted');
      // In a real app, you'd send the subscription to your backend here
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mx-4 mt-4 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-xl flex items-start gap-4"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-2xl flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">Live Transit Alerts</h4>
            <p className="text-[10px] font-medium text-slate-500 mt-1 leading-snug">Get notified about Metro delays and cab price drops in real-time.</p>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={handleRequest}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all"
              >
                Enable
              </button>
              <button 
                onClick={() => setShow(false)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                Not Now
              </button>
            </div>
          </div>
          <button onClick={() => setShow(false)} className="text-slate-300 hover:text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PushPermissionBanner;
