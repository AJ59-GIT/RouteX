
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TravelOption, FavoriteRoute, Booking, TransportMode } from '../types';
import { getModeConfig } from '../constants';
import { 
  CheckCircle2, IndianRupee, Clock, Activity, AlertTriangle, Zap, Heart, 
  Share2, Volume2, Vibrate, ExternalLink, ShieldAlert, Info, TrendingUp, 
  RefreshCw, Wifi, WifiOff 
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalContext';
import { updateRouteLiveStatus } from '../services/geminiService';
import BookingModal from './BookingModal';
import SafetyHub from './SafetyHub';

interface RouteDetailProps {
  option: TravelOption;
  onSaveRoute: (route: Partial<FavoriteRoute>) => void;
  onBookingConfirmed: (booking: Booking) => void;
  preferredPayment: string;
  isSaved?: boolean;
  onModalToggle?: (isOpen: boolean) => void;
}

const RouteDetail: React.FC<RouteDetailProps> = ({ option: initialOption, onSaveRoute, onBookingConfirmed, preferredPayment, isSaved, onModalToggle }) => {
  const { profile } = useGlobalState();
  const [option, setOption] = useState<TravelOption>(initialOption);
  const [showBooking, setShowBooking] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [activeVoiceGuidance, setActiveVoiceGuidance] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Use any to avoid the 'Cannot find namespace NodeJS' error in the browser context
  const refreshInterval = useRef<any>(null);

  useEffect(() => {
    setOption(initialOption);
  }, [initialOption]);

  useEffect(() => {
    const fetchLiveUpdates = async () => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      try {
        const updates = await updateRouteLiveStatus(option);
        if (updates.legs) {
          setOption(prev => ({
            ...prev,
            trafficStatus: updates.trafficStatus || prev.trafficStatus,
            legs: prev.legs.map((leg, idx) => ({
              ...leg,
              delayMinutes: updates.legs?.[idx]?.delayMinutes ?? leg.delayMinutes,
              crowdLevel: updates.legs?.[idx]?.crowdLevel ?? leg.crowdLevel,
            }))
          }));
        }
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Live update failed", err);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Initial fetch after a small delay
    const initialTimeout = setTimeout(fetchLiveUpdates, 2000);

    // Periodic fetch every 30 seconds
    refreshInterval.current = setInterval(fetchLiveUpdates, 30000);

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
      clearTimeout(initialTimeout);
    };
  }, [option.id]);

  const totalDuration = option.legs.reduce((acc, leg) => acc + leg.duration + (leg.delayMinutes || 0), 0);
  
  const handleBookingToggle = (show: boolean) => {
    setShowBooking(show);
    onModalToggle?.(show);
  };

  const speakStep = (idx: number, instructions: string) => {
    if (activeVoiceGuidance === idx) {
      window.speechSynthesis.cancel();
      setActiveVoiceGuidance(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(instructions);
    utterance.lang = 'en-IN';
    utterance.onend = () => setActiveVoiceGuidance(null);
    window.speechSynthesis.speak(utterance);
    setActiveVoiceGuidance(idx);
    
    if (profile.settings.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  };

  const getProviderLink = (mode: TransportMode, provider?: string) => {
    if (provider === 'Uber') return 'uber://?action=setPickup&pickup=my_location';
    if (provider === 'Ola') return 'olacabs://booking';
    if (provider === 'Rapido') return 'rapido://booking';
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="mt-10 space-y-8 overflow-hidden pb-12 relative z-30"
    >
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#FB923C] rounded-full"></div>
              <h2 className="text-xl font-black text-[#334155] dark:text-[#FFFBEB] tracking-tight">Trip Details</h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isRefreshing ? 'animate-ping' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live Tracking</span>
              </div>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowSafety(true)}
              className="p-2.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:border-rose-900 shadow-sm transition-transform active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onSaveRoute({ title: option.title })}
              className={`p-2.5 rounded-full border transition-all ${isSaved ? 'bg-[#FB923C]/10 border-[#FB923C] text-[#FB923C]' : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
          {option.legs.map((leg, idx) => {
            const config = getModeConfig(leg.mode);
            const width = ((leg.duration + (leg.delayMinutes || 0)) / totalDuration) * 100;
            return (
              <motion.div 
                key={`progress-${idx}`} 
                layout
                initial={{ width: 0 }} 
                animate={{ width: `${width}%` }} 
                className={`${config.color} ${config.darkColor} rounded-full`} 
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-6 relative">
        {option.legs.map((leg, idx) => {
          const config = getModeConfig(leg.mode);
          const Icon = config.icon;
          const providerLink = getProviderLink(leg.mode, leg.provider);
          const isDelayed = (leg.delayMinutes || 0) > 0;

          return (
            <div key={`leg-${idx}`} className="relative pl-14">
              {idx < option.legs.length - 1 && (
                <div className="absolute left-[1.625rem] top-12 bottom-[-1.5rem] w-1 bg-gradient-to-b from-[#FB923C]/20 to-transparent rounded-full" />
              )}
              
              <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${config.color} ${config.darkColor}`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <h4 className="font-black text-base text-[#334155] dark:text-[#FFFBEB] capitalize">{leg.mode.toLowerCase()}</h4>
                    <div className="flex items-center gap-2">
                       {leg.provider && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{leg.provider}</span>}
                       {leg.crowdLevel && (
                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                           leg.crowdLevel === 'Quiet' ? 'bg-emerald-50 text-emerald-600' :
                           leg.crowdLevel === 'Busy' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                         }`}>
                           {leg.crowdLevel}
                         </span>
                       )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {providerLink && (
                      <a href={providerLink} className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 active:scale-95 transition-transform">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => speakStep(idx, leg.instructions)} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 active:scale-95 transition-transform">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">{leg.instructions}</p>
                
                <div className="flex flex-wrap items-center gap-3 mt-4">
                   <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
                     <Clock className="w-3.5 h-3.5 text-slate-400" /> 
                     <span className={isDelayed ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}>
                       {leg.duration + (leg.delayMinutes || 0)} min
                     </span>
                     {isDelayed && <span className="text-rose-400 ml-1">({leg.delayMinutes}m delay)</span>}
                   </div>
                   {!isDelayed && (
                     <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                       On Time
                     </div>
                   )}
                   {leg.isSurgePricing && (
                     <div className="flex items-center gap-1 text-[9px] font-black uppercase text-[#FB923C] bg-[#FB923C]/10 px-2.5 py-1 rounded-lg">
                       <Zap className="w-3 h-3 fill-current" /> High Demand
                     </div>
                   )}
                </div>

                {/* Surge Transparency UI */}
                {leg.isSurgePricing && (
                   <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900 flex items-start gap-2">
                      <TrendingUp className="w-3 h-3 text-amber-600 mt-0.5" />
                      <div className="text-[8px] font-bold text-amber-800 dark:text-amber-400 uppercase leading-normal">
                        Fares are currently higher due to dynamic surge pricing.
                      </div>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Summary Bar with Total Real-time ETA */}
      <div className="p-6 bg-[#334155] rounded-[2.5rem] text-white shadow-2xl flex items-center justify-between mx-2 border border-[#FB923C]/20">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-[#FB923C]">Estimated Arrival</div>
            {isRefreshing && <RefreshCw className="w-2.5 h-2.5 animate-spin text-slate-400" />}
          </div>
          <div className="text-3xl font-black flex items-center gap-2">
            {totalDuration} <span className="text-sm font-bold opacity-60 uppercase">min total</span>
          </div>
          <div className="text-[10px] font-bold text-slate-300 mt-1 flex items-center gap-1">
             <IndianRupee className="w-2.5 h-2.5" /> {option.totalCost} Fare 
             <span className="mx-1 opacity-30">•</span>
             <Activity className="w-2.5 h-2.5" /> {option.trafficStatus} Traffic
          </div>
        </div>
        <button 
          onClick={() => handleBookingToggle(true)}
          className="bg-[#FB923C] text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl hover:bg-[#EA580C] active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-5 h-5" /> Confirm Now
        </button>
      </div>

      <AnimatePresence>
        {showBooking && (
          <BookingModal 
            option={option} 
            onClose={() => handleBookingToggle(false)} 
            onConfirm={onBookingConfirmed}
            preferredPayment={preferredPayment}
          />
        )}
        {showSafety && (
          <SafetyHub onClose={() => setShowSafety(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RouteDetail;
