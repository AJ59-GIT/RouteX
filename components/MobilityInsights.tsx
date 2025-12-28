
import React from 'react';
import { motion } from 'framer-motion';
import { RouteInsight, TravelOption } from '../types';
import { Sparkles, TrendingDown, TrendingUp, Users, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface MobilityInsightsProps {
  options: TravelOption[];
  onSelectBest: (option: TravelOption) => void;
}

const MobilityInsights: React.FC<MobilityInsightsProps> = ({ options, onSelectBest }) => {
  const allInsights = options.flatMap(o => (o.insights || []).map(i => ({ ...i, optionId: o.id, optionTitle: o.title })));
  
  const bestValue = options.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), options[0]);

  if (options.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-2 px-2">
        <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Mobility Insights</h3>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        {/* Smart Recommendation Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="flex-shrink-0 w-72 p-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white shadow-xl shadow-indigo-500/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 px-2 py-1 rounded-lg">AI Choice</div>
          </div>
          <h4 className="text-sm font-black mb-1">Smart Pick for You</h4>
          <p className="text-[10px] font-bold opacity-80 leading-tight mb-4">
            Based on current traffic & your history, {bestValue.title} is the optimal choice.
          </p>
          <button 
            onClick={() => onSelectBest(bestValue)}
            className="w-full py-2 bg-white text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Select Option <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>

        {/* Predictive Cards */}
        {allInsights.map((insight, idx) => (
          <div 
            key={idx}
            className="flex-shrink-0 w-64 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-xl ${
                insight.type === 'price' ? 'bg-emerald-50 text-emerald-600' :
                insight.type === 'crowd' ? 'bg-indigo-50 text-indigo-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {insight.type === 'price' && (insight.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />)}
                {insight.type === 'crowd' && <Users className="w-4 h-4" />}
                {insight.type === 'time' && <Clock className="w-4 h-4" />}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{insight.type} Prediction</span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {insight.message}
            </p>
            <div className="mt-4 flex items-center justify-between">
               <span className="text-[8px] font-black text-slate-400 uppercase truncate max-w-[120px]">{insight.optionTitle}</span>
               {insight.value && <span className="text-[10px] font-black text-indigo-600">{insight.value}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobilityInsights;
