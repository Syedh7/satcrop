import React from 'react';
import { Calendar, Clock, CheckCircle2, Circle, Sprout, ArrowRight } from 'lucide-react';

interface CropTimelineCardProps {
  cropName: string;
  currentStage: string;
  daysAfterSowing?: number;
}

const CROP_STAGES: Record<string, { stages: string[]; totalDays: number }> = {
  Wheat: {
    stages: ['Germination (0-10 DAS)', 'Crown Root (15-25 DAS)', 'Tillering (35-45 DAS)', 'Jointing (60-70 DAS)', 'Flowering / Heading (80-90 DAS)', 'Milking / Dough (100-110 DAS)', 'Maturity / Harvest (120-130 DAS)'],
    totalDays: 125
  },
  Soybean: {
    stages: ['Emergence (0-7 DAS)', 'Vegetative V3 (15-25 DAS)', 'Flowering R1 (35-45 DAS)', 'Pod Formation R3 (55-65 DAS)', 'Seed Fill R5 (75-85 DAS)', 'Maturity R8 (95-105 DAS)'],
    totalDays: 100
  },
  'Rice (Paddy)': {
    stages: ['Nursery / Seedling (0-20 DAS)', 'Tillering Stage (25-45 DAS)', 'Panicle Initiation (55-65 DAS)', 'Flowering Stage (80-90 DAS)', 'Grain Filling (100-110 DAS)', 'Maturity & Harvest (120-135 DAS)'],
    totalDays: 130
  },
  Maize: {
    stages: ['Seedling (0-10 DAS)', 'Knee High V6 (20-30 DAS)', 'Tasseling / Silking (50-60 DAS)', 'Milk Stage (70-80 DAS)', 'Dough Stage (90-100 DAS)', 'Maturity & Harvest (110-120 DAS)'],
    totalDays: 115
  },
  Cotton: {
    stages: ['Germination (0-10 DAS)', 'Vegetative (20-40 DAS)', 'Squaring (45-60 DAS)', 'Flowering & Boll (70-110 DAS)', 'Boll Bursting (120-150 DAS)', 'Harvest (150-180 DAS)'],
    totalDays: 165
  }
};

export const CropTimelineCard: React.FC<CropTimelineCardProps> = ({
  cropName,
  currentStage,
  daysAfterSowing = 42
}) => {
  const cropConfig = CROP_STAGES[cropName] || CROP_STAGES.Wheat;
  const stages = cropConfig.stages;
  const totalDays = cropConfig.totalDays;

  const currentIdx = stages.findIndex(s => s.toLowerCase().includes(currentStage.toLowerCase().split(' ')[0])) !== -1
    ? stages.findIndex(s => s.toLowerCase().includes(currentStage.toLowerCase().split(' ')[0]))
    : 2; // default to stage 3

  const daysRemaining = Math.max(1, totalDays - daysAfterSowing);
  const progressPercent = Math.min(100, Math.round((daysAfterSowing / totalDays) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Crop Growth Timeline
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {cropName} Crop Lifecycle Tracker
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800">
            {daysAfterSowing} DAS (Days After Sowing)
          </span>
        </div>
      </div>

      {/* Progress Bar & Countdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>Growth Progress: {progressPercent}%</span>
          <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            ~{daysRemaining} Days to Harvest
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-brand-500 to-amber-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Horizontal Stage Timeline */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Biological Phenological Milestones
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {stages.map((stageName, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-xs flex items-center space-x-2.5 transition-all ${
                  isCurrent
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200 font-bold ring-1 ring-brand-500/30'
                    : isCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Sprout className="w-4 h-4 text-brand-600 shrink-0 animate-bounce" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className="truncate">{stageName}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
