import React, { useState } from 'react';
import { MapPicker } from '../components/MapPicker';
import { Sprout, ArrowRight, ShieldCheck, MapPin, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MapSelectPageProps {
  onStartAnalysis: (locationData: {
    lat: number;
    lng: number;
    district: string;
    state: string;
    area: number;
    polygon?: any;
  }) => void;
  onCancel: () => void;
}

export const MapSelectPage: React.FC<MapSelectPageProps> = ({ onStartAnalysis, onCancel }) => {
  const { t } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    district: string;
    state: string;
    area: number;
    polygon?: any;
  }>({
    lat: 23.1815,
    lng: 79.9864,
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    area: 2.45
  });

  const handleLocationChange = (loc: any) => {
    setCurrentLocation(loc);
  };

  const handleAnalyzeClick = () => {
    onStartAnalysis(currentLocation);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 pb-24 md:pb-12">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 dark:text-brand-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Satellite Geolocation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Select Field Location
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search location or drop a pin on your agricultural land to initiate AI analysis.
          </p>
        </div>

        {/* Action Button Desktop */}
        <button
          onClick={handleAnalyzeClick}
          className="hidden sm:flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-brand-600/30 transition-all"
        >
          <Sprout className="w-5 h-5" />
          <span>{t('analyzeField')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map Component */}
      <MapPicker
        initialLat={currentLocation.lat}
        initialLng={currentLocation.lng}
        initialDistrict={currentLocation.district}
        initialState={currentLocation.state}
        onLocationChange={handleLocationChange}
      />

      {/* Mobile Sticky CTA */}
      <div className="sm:hidden fixed bottom-16 left-4 right-4 z-30">
        <button
          onClick={handleAnalyzeClick}
          className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-base shadow-xl shadow-brand-600/40 flex items-center justify-center space-x-2 transition-all"
        >
          <Sprout className="w-5 h-5" />
          <span>{t('analyzeField')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
