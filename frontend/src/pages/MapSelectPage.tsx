import React, { useState } from 'react';
import { MapPicker } from '../components/MapPicker';
import { Sprout, ArrowRight, ShieldCheck, MapPin, Layers, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LocationData {
  lat: number;
  lng: number;
  district: string;
  state: string;
  area: number;
  polygon?: any;
}

interface MapSelectPageProps {
  onStartAnalysis: (locationData: LocationData) => void;
  onCancel: () => void;
}

export const MapSelectPage: React.FC<MapSelectPageProps> = ({ onStartAnalysis, onCancel }) => {
  const { t } = useLanguage();

  // null = user has NOT selected a location yet — no default Jabalpur
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  const handleLocationChange = (loc: LocationData) => {
    setCurrentLocation(loc);
  };

  const handleAnalyzeClick = () => {
    if (!currentLocation) return;
    onStartAnalysis(currentLocation);
  };

  const canAnalyze = currentLocation !== null && currentLocation.lat !== 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-24 md:pb-12">
      
      {/* Top Banner & Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <button
            onClick={onCancel}
            className="mt-1 p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all active:scale-95 sm:hidden"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 dark:text-brand-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Satellite Geolocation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Field Location
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {canAnalyze
                ? `📍 ${currentLocation!.district}, ${currentLocation!.state} — Ready to analyse`
                : 'Tap anywhere on the map to drop a pin on your agricultural land.'}
            </p>
          </div>
        </div>

        {/* Action Buttons — Desktop */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onCancel}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleAnalyzeClick}
            disabled={!canAnalyze}
            className={`hidden sm:flex items-center space-x-2 px-6 py-3 rounded-xl font-extrabold text-sm shadow-lg transition-all ${
              canAnalyze
                ? 'bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-brand-600/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
            }`}
          >
            <Sprout className="w-5 h-5" />
            <span>{canAnalyze ? t('analyzeField') : 'Select a location first'}</span>
            {canAnalyze && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Map Component — no initial location passed */}
      <MapPicker
        onLocationChange={handleLocationChange}
      />

      {/* Mobile Sticky CTA */}
      <div className="sm:hidden fixed bottom-16 left-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={onCancel}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold shadow-xl border border-slate-200 dark:border-slate-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleAnalyzeClick}
          disabled={!canAnalyze}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all ${
            canAnalyze
              ? 'bg-brand-600 hover:bg-brand-700 active:scale-95 text-white shadow-brand-600/40'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
          }`}
        >
          <Sprout className="w-5 h-5" />
          <span>{canAnalyze ? t('analyzeField') : 'Select a location first'}</span>
          {canAnalyze && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
};
