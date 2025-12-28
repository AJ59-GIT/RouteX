
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Map, MessageSquare, Terminal, Zap, Users, AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import TestDashboard from './TestDashboard';
import InteractiveMap from './InteractiveMap';
import CommunityBoard from './CommunityBoard';
import { useGlobalState } from '../context/GlobalContext';

const AdminDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'system' | 'fleet' | 'moderation'>('system');
  const { profile, communityReports, setRole } = useGlobalState();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white pt-14 pb-12 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Terminal className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h1 className="text-2xl font-black tracking-tighter">OmniCommand</h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Administrator Portal</p>
          </div>
          <button 
            onClick={() => setRole('customer')}
            className="px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all"
          >
            <RefreshCw className="w-3 h-3" /> Exit Admin
          </button>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex gap-2 relative z-10">
          {[
            { id: 'system', label: 'Health', icon: Activity },
            { id: 'fleet', label: 'Fleet', icon: Map },
            { id: 'moderation', label: 'Reports', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                activeAdminTab === tab.id ? 'bg-white text-slate-900 shadow-xl' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 mt-8 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {activeAdminTab === 'system' && (
            <motion.div 
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Users</div>
                  <div className="text-2xl font-black text-indigo-600">1,284</div>
                </div>
                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Latency (API)</div>
                  <div className="text-2xl font-black text-emerald-500">42ms</div>
                </div>
              </div>
              <TestDashboard />
            </motion.div>
          )}

          {activeAdminTab === 'fleet' && (
            <motion.div 
              key="fleet"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 mb-6 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Real-time Node Monitoring</h3>
                </div>
                <InteractiveMap selectedOption={null} allOptions={[]} />
              </div>
              <div className="space-y-3">
                 {[
                   { id: 'M-01', status: 'Optimal', load: '45%', icon: Users, color: 'text-emerald-500' },
                   { id: 'B-22', status: 'Delayed', load: '92%', icon: AlertTriangle, color: 'text-rose-500' },
                 ].map(node => (
                   <div key={node.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                            <node.icon className={`w-5 h-5 ${node.color}`} />
                         </div>
                         <div>
                            <div className="text-xs font-black uppercase">{node.id}</div>
                            <div className="text-[9px] font-bold text-slate-400">STATUS: {node.status}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-slate-800 dark:text-slate-100">{node.load}</div>
                         <div className="text-[8px] font-bold text-slate-400 uppercase">LOAD</div>
                      </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {activeAdminTab === 'moderation' && (
            <motion.div 
              key="moderation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 mb-6 border border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-black">Moderation Queue</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage community reports and alerts</p>
               </div>
               <CommunityBoard reports={communityReports} onAddReport={() => {}} onUpvote={() => {}} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
