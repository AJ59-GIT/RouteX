
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'error' | 'warning' | 'info' | 'neutral';
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  onRetry, 
  retryLabel = "Try Again",
  type = 'neutral'
}) => {
  const themes = {
    error: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30',
    warning: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
    info: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
    neutral: 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mt-12 text-center p-10 rounded-[2.5rem] border transition-colors shadow-sm ${themes[type]}`}
    >
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ${
        type === 'error' ? 'bg-rose-100 dark:bg-rose-900/40' : 
        type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/40' :
        type === 'info' ? 'bg-blue-100 dark:bg-blue-900/40' :
        'bg-white dark:bg-slate-800'
      }`}>
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black tracking-tight mb-3 text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="font-medium max-w-[280px] mx-auto leading-relaxed mb-8 opacity-80">
        {description}
      </p>
      
      {onRetry && (
        <button
          onClick={() => {
            if ('vibrate' in navigator) navigator.vibrate(10);
            onRetry();
          }}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 mx-auto shadow-lg ${
            type === 'error' ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none' :
            type === 'warning' ? 'bg-amber-600 text-white shadow-amber-200 dark:shadow-none' :
            'bg-blue-600 text-white shadow-blue-200 dark:shadow-none'
          }`}
        >
          <RefreshCcw className="w-4 h-4" />
          {retryLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
