import React from 'react';

interface HealthDonutChartProps {
  healthy?: number;
  moderate?: number;
  poor?: number;
}

export const HealthDonutChart: React.FC<HealthDonutChartProps> = ({ 
  healthy = 65, 
  moderate = 25, 
  poor = 10 
}) => {
  const total = Math.max(1, (healthy || 0) + (moderate || 0) + (poor || 0));
  const healthyPct = Math.round(((healthy || 0) / total) * 100);
  const moderatePct = Math.round(((moderate || 0) / total) * 100);
  const poorPct = Math.max(0, 100 - healthyPct - moderatePct);

  // Circumference for r=40 is 2 * PI * 40 ≈ 251.2
  const circumference = 251.2;
  const strokeHealthy = (healthyPct / 100) * circumference;
  const strokeModerate = (moderatePct / 100) * circumference;
  const strokePoor = (poorPct / 100) * circumference;

  const offsetModerate = -strokeHealthy;
  const offsetPoor = -(strokeHealthy + strokeModerate);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Pure SVG Donut Chart (Bulletproof on all mobile WebViews) */}
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Healthy segment */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#16a34a"
            strokeWidth="12"
            strokeDasharray={`${strokeHealthy} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* Moderate segment */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#eab308"
            strokeWidth="12"
            strokeDasharray={`${strokeModerate} ${circumference}`}
            strokeDashoffset={offsetModerate}
          />
          {/* Poor segment */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#ef4444"
            strokeWidth="12"
            strokeDasharray={`${strokePoor} ${circumference}`}
            strokeDashoffset={offsetPoor}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Healthy</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {healthyPct}%
          </span>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="flex-1 w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shadow-sm" />
            <span>Healthy Crop</span>
          </div>
          <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{healthyPct}%</span>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm" />
            <span>Moderate Condition</span>
          </div>
          <span className="font-extrabold font-mono text-amber-600 dark:text-amber-400">{moderatePct}%</span>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm" />
            <span>Poor / Stressed</span>
          </div>
          <span className="font-extrabold font-mono text-rose-600 dark:text-rose-400">{poorPct}%</span>
        </div>
      </div>
    </div>
  );
};
