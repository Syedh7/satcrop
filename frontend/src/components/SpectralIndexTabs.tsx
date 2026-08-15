import React, { useState } from 'react';
import { Layers, Activity, Droplet, Sprout, ShieldAlert, Sparkles } from 'lucide-react';

interface SpectralIndexTabsProps {
  indices: {
    ndvi: number;
    ndwi?: number;
    ndre?: number;
    evi?: number;
    savi?: number;
    water_stress_status?: string;
    chlorophyll_activity?: string;
  };
}

export const SpectralIndexTabs: React.FC<SpectralIndexTabsProps> = ({ indices }) => {
  const [activeTab, setActiveTab] = useState<'ndvi' | 'ndwi' | 'ndre' | 'evi' | 'savi'>('ndvi');

  const ndviVal = indices.ndvi ?? 0.72;
  const ndwiVal = indices.ndwi ?? 0.42;
  const ndreVal = indices.ndre ?? 0.61;
  const eviVal = indices.evi ?? 0.68;
  const saviVal = indices.savi ?? 0.58;

  const getActiveData = () => {
    switch (activeTab) {
      case 'ndwi':
        return {
          title: 'NDWI (Canopy Moisture / Water Stress)',
          score: ndwiVal,
          formula: '(NIR - SWIR) / (NIR + SWIR)',
          badge: indices.water_stress_status || (ndwiVal > 0.3 ? 'Hydrated' : 'Mild Water Stress'),
          badgeColor: ndwiVal > 0.3 ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-800 border-amber-200',
          desc: 'Quantifies internal leaf water content. High values indicate healthy hydration, while dips signal early drought stress before visual wilting.',
          gradient: 'linear-gradient(to right, #ef4444 0%, #f59e0b 35%, #3b82f6 75%, #1d4ed8 100%)'
        };
      case 'ndre':
        return {
          title: 'NDRE (Red-Edge Chlorophyll Activity)',
          score: ndreVal,
          formula: '(NIR - RedEdge) / (NIR + RedEdge)',
          badge: indices.chlorophyll_activity || (ndreVal > 0.45 ? 'High Activity' : 'Moderate'),
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          desc: 'Penetrates deeper into dense canopies than standard NDVI, measuring active chlorophyll and nitrogen assimilation without saturation.',
          gradient: 'linear-gradient(to right, #ef4444 0%, #f59e0b 45%, #22c55e 75%, #15803d 100%)'
        };
      case 'evi':
        return {
          title: 'EVI (Enhanced Vegetation Biomass)',
          score: eviVal,
          formula: '2.5 * (NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1)',
          badge: 'Dense Biomass',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          desc: 'Corrects for atmospheric aerosols and soil background reflections, offering superior sensitivity in high biomass regions.',
          gradient: 'linear-gradient(to right, #ef4444 0%, #f59e0b 45%, #22c55e 75%, #15803d 100%)'
        };
      case 'savi':
        return {
          title: 'SAVI (Soil-Adjusted Vegetation Index)',
          score: saviVal,
          formula: '((NIR - Red) / (NIR + Red + L)) * (1 + L)',
          badge: 'Soil Compensated',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          desc: 'Optimized for early crop growth stages and sparse vegetation where bare soil brightness typically distorts NDVI readings.',
          gradient: 'linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #84cc16 75%, #16a34a 100%)'
        };
      default: // ndvi
        return {
          title: 'NDVI (Vegetation Vigour Index)',
          score: ndviVal,
          formula: '(NIR - Red) / (NIR + Red)',
          badge: ndviVal > 0.6 ? 'Vigorous' : (ndviVal > 0.4 ? 'Moderate' : 'Low Vigour'),
          badgeColor: ndviVal > 0.6 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200',
          desc: 'The gold standard benchmark for overall greenness, plant health, and fractional photosynthetically active radiation (fPAR).',
          gradient: 'linear-gradient(to right, #ef4444 0%, #f59e0b 45%, #22c55e 75%, #15803d 100%)'
        };
    }
  };

  const currentInfo = getActiveData();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      
      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800">
        {[
          { id: 'ndvi', label: 'NDVI', icon: '🌿' },
          { id: 'ndwi', label: 'NDWI (Moisture)', icon: '💧' },
          { id: 'ndre', label: 'NDRE (Chlorophyll)', icon: '🧪' },
          { id: 'evi', label: 'EVI (Biomass)', icon: '🌱' },
          { id: 'savi', label: 'SAVI (Soil)', icon: '🌾' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Index Details */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {currentInfo.title}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Formula: {currentInfo.formula}</span>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black font-mono text-brand-600 dark:text-brand-400">
              {currentInfo.score.toFixed(2)}
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${currentInfo.badgeColor}`}>
              {currentInfo.badge}
            </span>
          </div>
        </div>

        {/* Color Gradient Track */}
        <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div 
            className="h-full w-full rounded-full"
            style={{ background: currentInfo.gradient }}
          />
          <div 
            className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-white border-2 border-slate-900 rounded-full shadow-md transition-all duration-500"
            style={{ left: `${Math.max(5, Math.min(95, currentInfo.score * 100))}%` }}
          />
        </div>

        {/* Scientific Agronomic Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          {currentInfo.desc}
        </p>
      </div>

    </div>
  );
};
