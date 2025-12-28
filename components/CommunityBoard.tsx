
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommunityReport, TransportMode } from '../types';
import { getModeConfig } from '../constants';
import { MessageSquare, ThumbsUp, MapPin, Plus, Send, X, AlertCircle } from 'lucide-react';

interface CommunityBoardProps {
  reports: CommunityReport[];
  onAddReport: (report: Partial<CommunityReport>) => void;
  onUpvote: (id: string) => void;
}

const CommunityBoard: React.FC<CommunityBoardProps> = ({ reports, onAddReport, onUpvote }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newIssue, setNewIssue] = useState('');
  const [selectedMode, setSelectedMode] = useState<TransportMode>(TransportMode.METRO);
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIssue.trim()) {
      onAddReport({ issue: newIssue, mode: selectedMode, location });
      setNewIssue('');
      setLocation('');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Live Community Feed
        </h3>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-3 h-3" /> Report
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((report, i) => {
          const config = getModeConfig(report.mode);
          const Icon = config.icon;
          return (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color} ${config.darkColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-black text-xs text-slate-800 dark:text-slate-200">{report.userName}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase">{report.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">
                    <MapPin className="w-2.5 h-2.5" /> {report.location}
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {report.issue}
                  </p>
                  <button 
                    onClick={() => onUpvote(report.id)}
                    className="flex items-center gap-2 text-[10px] font-black px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful ({report.upvotes})
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                   <AlertCircle className="w-5 h-5 text-rose-500" />
                   Report an Issue
                </h2>
                <button onClick={() => setShowAdd(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transport Mode</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {Object.values(TransportMode).map(mode => {
                      const cfg = getModeConfig(mode);
                      const Icon = cfg.icon;
                      return (
                        <button 
                          key={mode} type="button" 
                          onClick={() => setSelectedMode(mode)}
                          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${selectedMode === mode ? 'border-indigo-600 ' + cfg.color : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" placeholder="e.g. Bandra West, BKC Gate 2" 
                      value={location} onChange={e => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">What's the issue?</label>
                  <textarea 
                    placeholder="Describe the crowd, delay, or mechanical issue..." 
                    value={newIssue} onChange={e => setNewIssue(e.target.value)}
                    className="w-full h-28 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Post Report
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityBoard;
