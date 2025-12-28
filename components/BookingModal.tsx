
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { TravelOption, Booking } from '../types';
import { IndianRupee, X, ShieldCheck, QrCode, CreditCard, Wallet, Smartphone, CheckCircle, Users, ChevronRight, Plus, WifiOff, MessageSquare, Zap, Lock, ChevronDown } from 'lucide-react';
import { offlineService } from '../services/offlineService';
import { securityService } from '../services/securityService';
import { useGlobalState } from '../context/GlobalContext';

interface BookingModalProps {
  option: TravelOption;
  onClose: () => void;
  onConfirm: (booking: Booking) => void;
  preferredPayment: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ option, onClose, onConfirm, preferredPayment }) => {
  const { profile } = useGlobalState();
  const [step, setStep] = useState<'payment' | 'split' | 'processing' | 'success' | 'offline_fallback'>('payment');
  const [selectedMethod, setSelectedMethod] = useState(preferredPayment);
  const [splitWith, setSplitWith] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(offlineService.isOnline());
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  const secureTransitToken = useMemo(() => {
    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    return securityService.generateSignedTransitToken(bookingId, profile.id);
  }, [profile.id]);

  useEffect(() => {
    const handleStatus = () => setIsOnline(offlineService.isOnline());
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handlePay = () => {
    if (!isOnline) {
      setStep('offline_fallback');
      return;
    }
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 1800);
  };

  const finalize = (offline = false) => {
    const newBooking: Booking = {
      id: secureTransitToken.split('.')[1].slice(0, 8),
      date: new Date().toLocaleDateString(),
      routeTitle: option.title,
      totalCost: option.totalCost,
      status: 'upcoming',
      ticketQrData: secureTransitToken,
      legs: option.legs,
      isSplitPayment: splitWith.length > 0,
      splitWith: splitWith
    };
    if (offline) offlineService.queueBooking(newBooking);
    onConfirm(newBooking);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 150) onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center p-0 bg-slate-900/80 backdrop-blur-md">
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <motion.div 
        style={{ y }} drag="y" dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2} onDragEnd={handleDragEnd}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-xl bg-[#FFFBEB] dark:bg-slate-800 rounded-t-[3rem] shadow-2xl flex flex-col max-h-[92vh]"
      >
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-[#334155]/20 dark:bg-[#FFFBEB]/20 rounded-full" />
        </div>

        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-black text-[#334155] dark:text-[#FFFBEB]">Checkout</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:scale-110 transition-transform">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide p-6 pb-32">
          <AnimatePresence mode="wait">
            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="bg-[#334155] p-6 rounded-[2.5rem] border border-[#FB923C]/30 relative overflow-hidden text-white shadow-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#FB923C] mb-1">Secured Fare</div>
                  <div className="flex items-center gap-1.5 text-4xl font-black">
                    <IndianRupee className="w-7 h-7 stroke-[4px] text-[#FB923C]" /> {option.totalCost}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Route</span>
                    <span className="text-xs font-black truncate max-w-[180px]">{option.title}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Selection</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['UPI', 'OmniWallet', 'Card'].map(id => (
                      <button 
                        key={id}
                        onClick={() => setSelectedMethod(id)}
                        className={`flex items-center justify-between p-5 rounded-[1.75rem] border-2 transition-all duration-300 ${selectedMethod === id ? 'border-[#FB923C] bg-white dark:bg-slate-900 shadow-xl' : 'border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 grayscale opacity-70'}`}
                      >
                        <span className="font-black text-sm text-[#334155] dark:text-[#FFFBEB]">{id === 'Card' ? 'Credit / Debit Card' : id}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === id ? 'border-[#FB923C] bg-[#FB923C]' : 'border-slate-300'}`}>
                          {selectedMethod === id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
                <div className="w-20 h-20 border-4 border-[#FB923C]/20 border-t-[#FB923C] rounded-full animate-spin mx-auto mb-8"></div>
                <h3 className="text-2xl font-black text-[#334155] dark:text-[#FFFBEB]">Authorizing</h3>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="bg-[#FB923C]/10 p-8 rounded-[3rem] text-center border border-[#FB923C]/20">
                  <div className="w-20 h-20 bg-[#FB923C] text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-[#334155] dark:text-[#FFFBEB]">Confirmed!</h3>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center gap-5">
                   <QrCode className="w-44 h-44 text-[#334155] dark:text-[#FFFBEB]" />
                   <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Digital Transit Pass</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === 'payment' && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FFFBEB] dark:from-slate-800 to-transparent">
            <button 
              onClick={handlePay}
              className="w-full py-5 bg-[#FB923C] text-white rounded-[2rem] font-black text-base shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <ShieldCheck className="w-6 h-6" />
              Pay ₹{option.totalCost} & Secure Trip
            </button>
          </div>
        )}
        
        {step === 'success' && (
          <div className="p-6">
            <button 
              onClick={() => { finalize(!isOnline); onClose(); }}
              className="w-full py-5 bg-[#334155] text-white rounded-[2rem] font-black text-base active:scale-[0.98] transition-all"
            >
              Back to Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;
