import React from 'react';

interface NdviGaugeProps {
  value: number; // e.g. 0.72
  health: 'Healthy' | 'Moderate' | 'Poor';
}

export const NdviGauge: React.FC<NdviGaugeProps> = ({ value, health }) => {
  // Map NDVI (-1.0 to 1.0) to percentage (0% to 100%)
  const clamped = Math.max(0, Math.min(1, value));
  const percentage = clamped * 100;

  const getStatusColor = () => {
    if (health === 'Healthy') return 'text-emerald-600 dark:text-emerald-400';
    if (health === 'Moderate') return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getBadgeStyle = () => {
    if (health === 'Healthy') return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200';
    if (health === 'Moderate') return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200';
    return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Vegetation Index
          </span>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            NDVI Score
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${getBadgeStyle()}`}>
              {health}
            </span>
          </h3>
        </div>
        <div className={`text-3xl font-black font-mono ${getStatusColor()}`}>
          {value.toFixed(2)}
        </div>
      </div>

      {/* Color Gradient Track */}
      <div className="relative w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
        <div 
          className="h-full w-full rounded-full"
          style={{
            background: 'linear-gradient(to right, #ef4444 0%, #f59e0b 45%, #22c55e 75%, #15803d 100%)'
          }}
        />
        {/* Pointer indicator */}
        <div 
          className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-white border-2 border-slate-900 dark:border-white rounded-full shadow-md transition-all duration-700 ease-out"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1.5 font-mono">
        <span>0.00 (Bare Soil)</span>
        <span>0.40 (Sparse)</span>
        <span>0.70 (Dense)</span>
        <span>1.00 (Vigorous)</span>
      </div>
    </div>
  );
};
