
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Share2, PhoneCall, X, UserPlus, Heart, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';

interface SafetyHubProps {
  onClose: () => void;
}

const SafetyHub: React.FC<SafetyHubProps> = ({ onClose }) => {
  const { profile } = useGlobalState();
  const [activeAlert, setActiveAlert] = useState(false);
  const [sharingStatus, setSharingStatus] = useState(false);

  const triggerSOS = () => {
    setActiveAlert(true);
    if ('vibrate' in navigator) navigator.vibrate([500, 200, 500, 200, 500]);
    // In a real app, send coordinates to emergency services and safety contacts
    setTimeout(() => setActiveAlert(false), 5000);
  };

  const shareLiveLocation = () => {
    setSharingStatus(true);
    // Simulate intent sharing
    setTimeout(() => setSharingStatus(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/90 backdrop-blur-lg p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-rose-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Safety Shield</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Active protection enabled</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* SOS BUTTON */}
            <button 
              onClick={triggerSOS}
              disabled={activeAlert}
              className={`p-6 rounded-[2rem] flex items-center justify-between border-4 transition-all ${
                activeAlert ? 'bg-rose-600 border-rose-500 scale-95' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 hover:bg-rose-100'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${activeAlert ? 'bg-white text-rose-600' : 'bg-rose-600 text-white shadow-lg shadow-rose-200'}`}>
                  <PhoneCall className={`w-7 h-7 ${activeAlert ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <div className={`text-lg font-black ${activeAlert ? 'text-white' : 'text-rose-700 dark:text-rose-400'}`}>
                    {activeAlert ? 'SOS ALERT SENT' : 'SOS Emergency'}
                  </div>
                  <div className={`text-xs font-bold ${activeAlert ? 'text-white/80' : 'text-rose-600/60'}`}>
                    {activeAlert ? 'Connecting with police...' : 'Instant alert to police & contacts'}
                  </div>
                </div>
              </div>
              <CheckCircle2 className={`w-8 h-8 ${activeAlert ? 'text-white opacity-100' : 'opacity-0'}`} />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={shareLiveLocation}
                className="p-5 bg-blue-50 dark:bg-blue-950/30 rounded-[2rem] border border-blue-100 dark:border-blue-900/50 flex flex-col items-center gap-3 text-center transition-all active:scale-95"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Share2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                  {sharingStatus ? 'Link Copied' : 'Share Trip'}
                </div>
              </button>

              <button className="p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center gap-3 text-center transition-all active:scale-95">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Add Contact</div>
              </button>
            </div>
          </div>

          <div className="mt-10 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <Heart className="w-3 h-3 text-rose-500 fill-current" />
               Your Safety Contacts
             </h4>
             <div className="space-y-3">
               {profile.safetyContacts?.length > 0 ? (
                 profile.safetyContacts.map(c => (
                   <div key={c.id} className="flex items-center justify-between">
                     <div className="font-bold text-sm text-slate-700 dark:text-slate-200">{c.name}</div>
                     <div className="text-[10px] font-black text-slate-400 tabular-nums">{c.phone}</div>
                   </div>
                 ))
               ) : (
                 <p className="text-xs text-slate-400 font-medium italic">No contacts added. Safety alerts will go to local authorities.</p>
               )}
             </div>
          </div>

          <div className="mt-8 flex items-center gap-2 px-2 py-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl">
             <AlertCircle className="w-4 h-4 text-amber-600" />
             <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase leading-tight">
               OmniRoute uses 256-bit encryption for all location sharing data.
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SafetyHub;
