
import React from 'react';
import { motion } from 'framer-motion';
import { CarpoolRide } from '../types';
import { Users, Clock, IndianRupee, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface CarpoolSectionProps {
  rides: CarpoolRide[];
  onSelect: (ride: CarpoolRide) => void;
}

const CarpoolSection: React.FC<CarpoolSectionProps> = ({ rides, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-500" />
          Community Carpools
        </h3>
        <span className="text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest">Verified Drivers</span>
      </div>

      <div className="space-y-3">
        {rides.map((ride, i) => (
          <motion.div 
            key={ride.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(ride)}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                   <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <div className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    {ride.driverName}
                    <div className="flex items-center gap-0.5 text-amber-500 text-[9px] font-black">
                      <Star className="w-2.5 h-2.5 fill-current" /> {ride.rating}
                    </div>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Identity
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end text-lg">
                  <IndianRupee className="w-4 h-4 stroke-[3px]" /> {ride.cost}
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">{ride.seatsAvailable} Seats Left</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
               <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Departs {ride.departureTime}</div>
               <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
               <div className="truncate max-w-[120px]">{ride.source} → {ride.destination}</div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
               <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">OmniPool Matching</div>
               <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                 Join Ride <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CarpoolSection;
