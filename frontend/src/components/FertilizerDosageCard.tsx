import React from 'react';
import { FlaskConical, Package, Clock, Sparkles } from 'lucide-react';

interface FertilizerDosageCardProps {
  dosagePlan: any;
}

export const FertilizerDosageCard: React.FC<FertilizerDosageCardProps> = ({ dosagePlan }) => {
  if (!dosagePlan || !dosagePlan.fertilizer_plan) return null;

  const plan = dosagePlan.fertilizer_plan;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Precision Nutrient Management
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Fertilizer Requirement Plan ({dosagePlan.field_area_acres} Acres)
            </h3>
          </div>
        </div>
      </div>

      {/* 3 Main Fertilizers (DAP, Urea, MOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* DAP */}
        {plan.dap && (
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300">DAP (18:46:0)</span>
                <div className="text-xl font-black font-mono text-emerald-900 dark:text-emerald-200">
                  {plan.dap.total_kg} <span className="text-xs font-sans font-bold">kg</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold font-mono">
                ~{plan.dap.bags_50kg} Bags
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{plan.dap.timing}</span>
            </div>
          </div>
        )}

        {/* Urea */}
        {plan.urea && (
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/40 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-800 dark:text-blue-300">Neem Coated Urea</span>
                <div className="text-xl font-black font-mono text-blue-900 dark:text-blue-200">
                  {plan.urea.total_kg} <span className="text-xs font-sans font-bold">kg</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-200/80 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold font-mono">
                ~{plan.urea.bags_45kg} Bags
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{plan.urea.timing}</span>
            </div>
          </div>
        )}

        {/* MOP (Potash) */}
        {plan.mop && (
          <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/40 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300">MOP Potash (60%)</span>
                <div className="text-xl font-black font-mono text-amber-900 dark:text-amber-200">
                  {plan.mop.total_kg} <span className="text-xs font-sans font-bold">kg</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold font-mono">
                ~{plan.mop.bags_50kg} Bags
              </span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{plan.mop.timing}</span>
            </div>
          </div>
        )}

      </div>

      {/* Stage Specific Application Instruction */}
      {dosagePlan.stage_specific_action && (
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Current Stage Recommendation: </span>
            <span>{dosagePlan.stage_specific_action}</span>
          </div>
        </div>
      )}

    </div>
  );
};
