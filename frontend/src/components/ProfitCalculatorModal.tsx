import React, { useState } from 'react';
import { X, Calculator, IndianRupee, TrendingUp, Sparkles, PieChart } from 'lucide-react';

interface ProfitCalculatorModalProps {
  cropName: string;
  fieldAreaAcres: number;
  estimatedHarvestQuintals: number;
  modalPricePerQuintal: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfitCalculatorModal: React.FC<ProfitCalculatorModalProps> = ({
  cropName,
  fieldAreaAcres,
  estimatedHarvestQuintals,
  modalPricePerQuintal,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  // Custom adjustable cost inputs per acre
  const [seedCost, setSeedCost] = useState<number>(2200);
  const [fertilizerCost, setFertilizerCost] = useState<number>(3800);
  const [pesticideCost, setPesticideCost] = useState<number>(1800);
  const [irrigationCost, setIrrigationCost] = useState<number>(2400);
  const [laborMachineryCost, setLaborMachineryCost] = useState<number>(3200);

  const costPerAcre = seedCost + fertilizerCost + pesticideCost + irrigationCost + laborMachineryCost;
  const totalCost = Math.round(costPerAcre * fieldAreaAcres);
  const grossRevenue = Math.round(estimatedHarvestQuintals * modalPricePerQuintal);
  const netProfit = Math.max(0, grossRevenue - totalCost);
  const roi = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-brand-700 dark:text-brand-300 flex items-center justify-center shadow-inner">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Farm Net Profit & ROI Estimator
              </h2>
              <span className="text-[11px] text-slate-500">{cropName} ({fieldAreaAcres} Acres)</span>
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
          
          {/* Net Profit Summary Box */}
          <div className="bg-gradient-to-br from-emerald-800 to-slate-950 rounded-2xl p-4 sm:p-5 text-white shadow-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-emerald-200 font-medium">Estimated Net Profit</span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-300">
                  ₹{netProfit.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-200">
                  Gross ₹{grossRevenue.toLocaleString('en-IN')} − Costs ₹{totalCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-right bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                <span className="text-[10px] text-emerald-200 block">Projected ROI</span>
                <span className="text-sm font-black text-amber-300 font-mono">+{roi}%</span>
              </div>
            </div>
          </div>

          {/* Cost breakdown inputs */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
              Adjust Input Costs Per Acre (₹ / Acre)
            </span>

            <div className="grid grid-cols-2 gap-3">
              
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Seeds & Treatment</label>
                <input
                  type="number"
                  value={seedCost}
                  onChange={(e) => setSeedCost(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-white"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Fertilizer & NPK</label>
                <input
                  type="number"
                  value={fertilizerCost}
                  onChange={(e) => setFertilizerCost(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-white"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Crop Protection / Spray</label>
                <input
                  type="number"
                  value={pesticideCost}
                  onChange={(e) => setPesticideCost(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-white"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Irrigation & Power</label>
                <input
                  type="number"
                  value={irrigationCost}
                  onChange={(e) => setIrrigationCost(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-white"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 col-span-2">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Tractor, Labor & Harvesting</label>
                <input
                  type="number"
                  value={laborMachineryCost}
                  onChange={(e) => setLaborMachineryCost(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-white"
                />
              </div>

            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
            <span className="font-bold">Total Estimated Production Cost:</span>
            <span className="font-black font-mono text-sm">₹{totalCost.toLocaleString('en-IN')}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
