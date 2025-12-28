
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="mt-8 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-5 w-32 skeleton rounded-md"></div>
              <div className="h-3 w-20 skeleton rounded-md"></div>
            </div>
            <div className="h-8 w-16 skeleton rounded-md"></div>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map(j => (
              <div key={j} className="h-10 w-10 skeleton rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 skeleton rounded-xl"></div>
            <div className="h-8 skeleton rounded-xl"></div>
            <div className="h-8 skeleton rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
