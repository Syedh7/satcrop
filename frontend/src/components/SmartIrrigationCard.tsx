import React, { useState } from 'react';
import { Droplet, Waves, Clock, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface SmartIrrigationCardProps {
  irrigationPlan: any;
}

export const SmartIrrigationCard: React.FC<SmartIrrigationCardProps> = ({ irrigationPlan }) => {
  if (!irrigationPlan) return null;

  const [selectedHp, setSelectedHp] = useState<number>(5);

  const dailyLiters = irrigationPlan.daily_water_liters || 42500;
  const cycleLiters = irrigationPlan.cycle_water_liters || 212500;
  const cycleM3 = irrigationPlan.cycle_water_m3 || 212.5;
  const pumpRate = selectedHp * 9000; // liters per hour
  const pumpHours = Math.round((cycleLiters / Math.max(pumpRate, 1000)) * 10) / 10;
  const powerCost = Math.round(selectedHp * 0.746 * pumpHours * 4.5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              FAO-56 Precision Hydro-Agronomy
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Smart Irrigation & Pump Run-Time
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
            {irrigationPlan.recommended_cycle_days || 5}-Day Scheduled Cycle
          </span>
        </div>
      </div>

      {/* Main Water Volumes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/40 space-y-1">
          <span className="text-[10px] font-bold uppercase text-blue-800 dark:text-blue-300">Daily Water Need</span>
          <div className="text-2xl font-black font-mono text-blue-900 dark:text-blue-200">
            {dailyLiters.toLocaleString('en-IN')} <span className="text-xs font-sans font-bold">Liters</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">~{(dailyLiters / 1000).toFixed(1)} m³ / Day</span>
        </div>

        <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/40 space-y-1">
          <span className="text-[10px] font-bold uppercase text-blue-800 dark:text-blue-300">5-Day Cycle Volume</span>
          <div className="text-2xl font-black font-mono text-blue-900 dark:text-blue-200">
            {cycleLiters.toLocaleString('en-IN')} <span className="text-xs font-sans font-bold">L</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{cycleM3} Cubic Meters</span>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-4 rounded-2xl shadow-md space-y-1">
          <span className="text-[10px] font-bold uppercase text-blue-200">Pump Operating Time</span>
          <div className="text-2xl font-black font-mono text-amber-300">
            {pumpHours} <span className="text-xs font-sans font-bold text-white">Hours</span>
          </div>
          <span className="text-[10px] text-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-300" />
            Every {irrigationPlan.recommended_cycle_days || 5} days with {selectedHp} HP motor
          </span>
        </div>

      </div>

      {/* Interactive Pump HP Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Select Tube-well Motor Power:</span>
        </div>

        <div className="flex gap-1.5">
          {[3, 5, 7.5, 10].map((hp) => (
            <button
              key={hp}
              onClick={() => setSelectedHp(hp)}
              className={`px-3 py-1 rounded-xl font-bold font-mono text-xs transition-all border ${
                selectedHp === hp
                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {hp} HP
            </button>
          ))}
        </div>
      </div>

      {/* Agronomic Irrigation Advice */}
      <div className="text-xs text-slate-600 dark:text-slate-300 bg-emerald-50/60 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 flex items-start space-x-2">
        <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <p>{irrigationPlan.irrigation_method_advice}</p>
      </div>

    </div>
  );
};
