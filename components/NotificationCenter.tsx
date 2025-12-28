
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../types';
import { Bell, X, AlertTriangle, Tag, Clock, Gift, ArrowRight } from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onClear: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onClose, onClear }) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 p-6 md:max-w-md md:left-auto md:shadow-2xl md:border-l dark:border-slate-800"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          Alerts
        </h2>
        <div className="flex gap-2">
          <button onClick={onClear} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">Clear All</button>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"><X className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[80vh] scrollbar-hide">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div key={notif.id} className={`p-5 rounded-3xl border-2 transition-all ${notif.isRead ? 'border-slate-50 dark:border-slate-900 bg-white dark:bg-slate-900 opacity-60' : 'border-blue-100 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20'}`}>
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  notif.type === 'delay' ? 'bg-rose-50 text-rose-600' :
                  notif.type === 'price_drop' ? 'bg-emerald-50 text-emerald-600' :
                  notif.type === 'offer' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {notif.type === 'delay' && <AlertTriangle className="w-6 h-6" />}
                  {notif.type === 'price_drop' && <Tag className="w-6 h-6" />}
                  {notif.type === 'reminder' && <Clock className="w-6 h-6" />}
                  {notif.type === 'offer' && <Gift className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-sm text-slate-800 dark:text-slate-200">{notif.title}</h4>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{notif.message}</p>
                  <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                    See Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
               <Bell className="w-8 h-8" />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No New Notifications</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationCenter;
