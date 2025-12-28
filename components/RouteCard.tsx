
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TravelOption } from '../types';
import { getModeConfig, WEATHER_ICONS } from '../constants';
import { IndianRupee, Users, TrendingDown, TrendingUp, Sparkles, Clock } from 'lucide-react';

interface RouteCardProps {
  option: TravelOption;
  isSelected: boolean;
  onSelect: () => void;
}

const RouteCard: React.FC<RouteCardProps> = memo(({ option, isSelected, onSelect }) => {
  const mainInsight = option.insights?.[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={`p-5 md:p-6 rounded-[1.75rem] border-2 transition-all cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FB923C]/50 ${
        isSelected 
          ? 'border-[#FB923C] bg-[#FB923C]/5 dark:bg-[#FB923C]/10' 
          : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'
      }`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {/* Smart Insight Badge */}
      {mainInsight && (
        <div className="absolute top-0 right-0 p-1.5 flex items-center gap-1 bg-[#334155] text-[#FB923C] rounded-bl-2xl">
           <Sparkles className="w-2.5 h-2.5 fill-current" />
           <span className="text-[7px] font-black uppercase tracking-widest">AI Logic</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-4 pr-1">
        <div className="max-w-[70%]">
          <h3 className="font-black text-lg text-[#334155] dark:text-[#FFFBEB] truncate">{option.title}</h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {option.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="text-[7px] font-black px-1.5 py-0.5 bg-[#FB923C]/10 text-[#FB923C] rounded-md uppercase">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center justify-end text-xl font-black text-[#FB923C]">
            <IndianRupee className="w-4 h-4 stroke-[3px]" /> {option.totalCost}
          </div>
          <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{option.totalDuration}m • {option.totalDistance}km</div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {option.legs.map((leg, idx) => {
          const config = getModeConfig(leg.mode);
          const Icon = config.icon;
          return (
            <React.Fragment key={`${option.id}-leg-${idx}`}>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative ${config.color} ${config.darkColor}`}
                >
                  <Icon className="w-5 h-5" />
                  {leg.crowdLevel && (
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center ${
                      leg.crowdLevel === 'Quiet' ? 'bg-emerald-500' : 
                      leg.crowdLevel === 'Busy' ? 'bg-[#FB923C]' : 'bg-rose-500'
                    }`}>
                      <Users className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
              </div>
              {idx < option.legs.length - 1 && <div className="h-0.5 w-3 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0 mt-[-1rem]" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#FFFBEB] dark:bg-slate-900 p-2 rounded-xl text-center border border-slate-100 dark:border-slate-700">
          <div className="text-[7px] uppercase font-black text-slate-400 mb-1">Impact</div>
          <div className="font-black text-xs text-emerald-600">{option.carbonFootprint}kg</div>
        </div>
        <div className="bg-[#FFFBEB] dark:bg-slate-900 p-2 rounded-xl text-center border border-slate-100 dark:border-slate-700">
          <div className="text-[7px] uppercase font-black text-slate-400 mb-1">Score</div>
          <div className="font-black text-xs text-[#334155] dark:text-[#FFFBEB]">{option.score}%</div>
        </div>
        <div className="bg-[#FFFBEB] dark:bg-slate-900 p-2 rounded-xl text-center border border-slate-100 dark:border-slate-700">
          <div className="text-[7px] uppercase font-black text-slate-400 mb-1">Best Time</div>
          <div className="font-black text-[9px] text-[#FB923C] uppercase flex items-center justify-center gap-1">
            <Clock className="w-2 h-2" /> {option.bestTimeToLeave || 'Now'}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default RouteCard;
