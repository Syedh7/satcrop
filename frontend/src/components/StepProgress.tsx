import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface StepProgressProps {
  currentStepIndex: number;
  progressPercent: number;
}

const PIPELINE_STEPS = [
  'Fetching Satellite Data (Sentinel-2)',
  'Processing Multispectral Imagery',
  'Calculating NDVI & Vegetation Indices',
  'Running AI Crop Recognition Model',
  'Evaluating Crop Health & Stress',
  'Determining Growth Stage',
  'Estimating Harvest Yield',
  'Generating Agronomy Results & Report'
];

export const StepProgress: React.FC<StepProgressProps> = ({ currentStepIndex, progressPercent }) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      
      {/* Circular Progress Gauge */}
      <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            className="text-brand-600 dark:text-brand-500 transition-all duration-300 ease-out"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={2 * Math.PI * 50 * (1 - progressPercent / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            {progressPercent}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
            Processing
          </span>
        </div>
      </div>

      {/* Step by step checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 text-xs sm:text-sm transition-colors ${
                isDone
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                  : isCurrent
                  ? 'text-brand-600 dark:text-brand-300 font-bold'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-brand-600 animate-spin shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
