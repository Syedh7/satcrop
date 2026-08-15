import React, { useState } from 'react';
import { X, ShieldAlert, Bug, Leaf, AlertTriangle, CheckCircle, Droplet, Sparkles } from 'lucide-react';

interface PestDiagnosticModalProps {
  pestData: any;
  isOpen: boolean;
  onClose: () => void;
}

export const PestDiagnosticModal: React.FC<PestDiagnosticModalProps> = ({ pestData, isOpen, onClose }) => {
  if (!isOpen || !pestData) return null;

  const [selectedThreat, setSelectedThreat] = useState<any>(pestData.threats?.[0] || null);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-inner">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Crop Pest & Disease AI Diagnostics
              </h2>
              <span className="text-[11px] text-slate-500">{pestData.crop_name} Disease Shield Protocol</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Threats Tabs */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Monitored Pathogens & Pests
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {pestData.threats?.map((threat: any) => (
                <button
                  key={threat.id}
                  onClick={() => setSelectedThreat(threat)}
                  className={`px-3 py-2 rounded-xl font-bold text-xs shrink-0 transition-all border ${
                    selectedThreat?.id === threat.id
                      ? 'bg-amber-600 text-white border-amber-700 shadow-md shadow-amber-600/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {threat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Threat Detailed Protocol */}
          {selectedThreat && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedThreat.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-200">
                    {selectedThreat.type}
                  </span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Visual Symptoms to Look For:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-5">
                  {selectedThreat.symptoms}
                </p>
              </div>

              {/* Weather Trigger */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Environmental Trigger Conditions:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-5">
                  {selectedThreat.weather_trigger}
                </p>
              </div>

              {/* Remedies Grid (Organic vs Chemical) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                {/* Organic / Biological Remedy */}
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1">
                    🌿 Organic / Bio Solution
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {selectedThreat.organic_remedy}
                  </p>
                </div>

                {/* Recommended Chemical Spray */}
                <div className="bg-blue-50/70 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/50 space-y-1">
                  <span className="font-bold text-blue-800 dark:text-blue-300 text-xs flex items-center gap-1">
                    🧪 Chemical Protocol
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {selectedThreat.chemical_control}
                  </p>
                </div>

              </div>

              {/* Prevention Advice */}
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <strong>🛡️ Preventive Best Practice:</strong> {selectedThreat.prevention}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
