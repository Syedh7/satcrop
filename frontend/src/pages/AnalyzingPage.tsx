import React, { useState, useEffect } from 'react';
import { StepProgress } from '../components/StepProgress';
import { api } from '../services/api';
import { fetchRealtimeAgroAnalysis } from '../services/liveAgroService';
import { Satellite, Sparkles } from 'lucide-react';

interface AnalyzingPageProps {
  locationData: {
    lat: number;
    lng: number;
    district: string;
    state: string;
    area: number;
    polygon?: any;
    fieldId?: string;
  };
  onComplete: (resultData: any) => void;
  onError: (errorMsg: string) => void;
}

export const AnalyzingPage: React.FC<AnalyzingPageProps> = ({ locationData, onComplete, onError }) => {
  const [progress, setProgress] = useState<number>(10);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    // Start API / Live calculation request
    const startAnalysis = async () => {
      try {
        // First try FastAPI backend if reachable
        const res = await api.post('/analysis/process', {
          latitude: locationData.lat,
          longitude: locationData.lng,
          district: locationData.district,
          state: locationData.state,
          field_area: locationData.area || 2.45,
          field_id: locationData.fieldId,
          polygon_geojson: locationData.polygon ? JSON.stringify(locationData.polygon) : undefined
        });
        if (isMounted) {
          setAnalysisResult(res.data);
        }
      } catch (err: any) {
        console.info('Using real-time live satellite agro engine:', err?.message);
        // Execute real-time client-side live engine with direct Open-Meteo REST API
        try {
          const liveResult = await fetchRealtimeAgroAnalysis(locationData);
          if (isMounted) {
            setAnalysisResult(liveResult);
          }
        } catch (fallbackErr) {
          console.error('Real-time engine error:', fallbackErr);
        }
      }
    };

    startAnalysis();

    // Multi-step progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 14;
        const nextStep = Math.min(7, Math.floor((next / 100) * 8));
        setCurrentStepIndex(nextStep);
        return next;
      });
    }, 320);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [locationData]);

  // Once 100% and result is ready, transition to results screen
  useEffect(() => {
    if (progress >= 100 && analysisResult) {
      const timer = setTimeout(() => {
        onComplete(analysisResult);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, analysisResult, onComplete]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6 text-center">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-brand-800 dark:text-brand-300 text-xs font-black animate-pulse">
            <Satellite className="w-4 h-4" />
            <span>Fetching Live Sentinel-2 & Weather Stream</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Analyzing Field
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Processing live agrometeorology and vegetation index for{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {locationData.district}, {locationData.state}
            </span>
          </p>
        </div>

        {/* Step Progress Component */}
        <StepProgress
          currentStepIndex={currentStepIndex}
          progressPercent={Math.min(100, progress)}
        />

        {/* Sub-note */}
        <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time Sentinel-2 BOA & Open-Meteo Agro Engine</span>
        </div>

      </div>
    </div>
  );
};
