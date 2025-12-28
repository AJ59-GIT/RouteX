
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile, LeaderboardEntry } from '../types';
import { Leaf, Flame, TreePine, Trophy, Share2, Medal, Users } from 'lucide-react';

interface SustainabilityDashboardProps {
  profile: UserProfile;
  leaderboard: LeaderboardEntry[];
  onShare: () => void;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ profile, leaderboard, onShare }) => {
  const treesSaved = (profile.totalCarbonSaved / 20).toFixed(1);

  return (
    <div className="space-y-8 pb-12 relative z-30">
      {/* Carbon Savings Card - Slate & Coral Gradient */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#334155] to-[#475569] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-[#FB923C]/20"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Leaf className="w-40 h-40 text-[#FB923C]" />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FB923C] mb-1.5">Your Green Impact</div>
            <div className="text-4xl font-black flex items-baseline gap-2">
              {profile.totalCarbonSaved.toFixed(1)} <span className="text-sm font-bold opacity-80">kg CO₂</span>
            </div>
          </div>
          <button 
            onClick={onShare}
            className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all"
          >
            <Share2 className="w-5 h-5 text-[#FB923C]" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="w-4 h-4 text-[#FB923C]" />
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-300">Trees Saved</div>
            </div>
            <div className="text-2xl font-black">{treesSaved}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-[#FB923C]" />
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-300">Streak</div>
            </div>
            <div className="text-2xl font-black">{profile.currentStreak}d</div>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Section */}
      <section>
        <div className="flex items-center justify-between mb-5 px-2">
          <h3 className="text-lg font-black text-[#334155] dark:text-[#FFFBEB] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FB923C]" />
            Community Rankings
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-lg overflow-hidden divide-y divide-slate-50 dark:divide-slate-700">
          {leaderboard.map((entry) => (
            <div 
              key={entry.rank}
              className={`flex items-center justify-between p-6 transition-colors ${entry.isUser ? 'bg-[#FB923C]/5 dark:bg-[#FB923C]/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                  entry.rank <= 3 ? 'bg-[#FB923C]/10 text-[#FB923C]' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                }`}>
                  {entry.rank === 1 ? <Medal className="w-5 h-5" /> : entry.rank}
                </div>
                <div>
                  <div className="font-black text-sm text-[#334155] dark:text-[#FFFBEB] flex items-center gap-2">
                    {entry.name}
                    {entry.isUser && <span className="bg-[#FB923C] text-white text-[8px] font-black px-2 py-0.5 rounded-lg">YOU</span>}
                  </div>
                </div>
              </div>
              <div className="font-black text-[#FB923C] text-base">{entry.carbonSaved}kg</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SustainabilityDashboard;
