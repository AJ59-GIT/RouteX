
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

const InstallPrompt: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleInstall = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      (window as any).deferredPrompt = null;
      setIsVisible(false);
      onDismiss();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-32 left-6 right-6 z-[90] bg-blue-600 rounded-[2.5rem] p-6 text-white shadow-2xl flex items-center justify-between border border-white/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h4 className="font-black text-sm uppercase tracking-widest">Install OmniRoute</h4>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-tighter">Fast access & offline booking fallback</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-blue-600 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              Install
            </button>
            <button
              onClick={() => { setIsVisible(false); onDismiss(); }}
              className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
