import React from 'react';
import { X, Printer, Download, Share2, CheckCircle, ShieldCheck, Sprout, CloudSun, Calendar, MapPin } from 'lucide-react';
import { Analysis, User } from '../types';

interface ReportSessionModalProps {
  analysis: Analysis | any;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportSessionModal: React.FC<ReportSessionModalProps> = ({ analysis, user, isOpen, onClose }) => {
  if (!isOpen || !analysis) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportCode = `SC-${Math.abs(analysis.id ? analysis.id.split('').reduce((a: any, b: any) => ((a << 5) - a) + b.charCodeAt(0), 0) : 789456) % 1000000}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Action Header (Non-printable controls) */}
        <div className="no-print p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Report Session — Official Agronomy Summary
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 print:text-black">
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-brand-600 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Sprout className="w-7 h-7 text-brand-600" />
                <h1 className="text-2xl font-black text-brand-700 tracking-tight">SATCROP / KrishiVision AI</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Smart Farming. Better Tomorrow.</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-brand-800 dark:text-brand-300 font-extrabold text-xs rounded-md">
                OFFICIAL SATELLITE AGRONOMY REPORT
              </span>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">Report ID: {reportCode}</div>
            </div>
          </div>

          {/* Farmer & Location Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Farmer & Location</h3>
              <div className="text-sm font-semibold">{user?.name || 'Ramesh Kumar'}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                {analysis.district || 'Jabalpur'}, {analysis.state || 'Madhya Pradesh'}
              </div>
              <div className="text-xs font-mono text-slate-500 mt-1">
                Coordinates: {analysis.latitude?.toFixed(4)}° N, {analysis.longitude?.toFixed(4)}° E
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Satellite Mission Metadata</h3>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Sensor:</strong> Sentinel-2 MSI (10m Resolution)</div>
                <div><strong>Analysis Mode:</strong> {analysis.source || 'DEMO_AI'}</div>
                <div><strong>Field Area:</strong> {analysis.field_area || 2.45} Acres</div>
                <div><strong>Generated Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
          </div>

          {/* Crop Findings & NDVI Summary Card */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800/50 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Identified Crop</span>
                <div className="text-2xl font-black text-brand-800 dark:text-brand-300 flex items-center gap-2">
                  {analysis.crop_name || 'Wheat'}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold">
                    {analysis.crop_health || 'Healthy'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">NDVI Vegetation Index</div>
                <div className="text-3xl font-black font-mono text-brand-700 dark:text-brand-400">
                  {analysis.ndvi?.toFixed(2) || '0.72'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs">
              <div>
                <div className="text-slate-500">Growth Stage</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{analysis.growth_stage || 'Tillering Stage'}</div>
              </div>
              <div>
                <div className="text-slate-500">Est. Harvest</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {analysis.estimated_harvest || 32.5} {analysis.harvest_unit || 'Quintal'}
                </div>
              </div>
              <div>
                <div className="text-slate-500">AI Confidence</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {Math.round((analysis.confidence_score || 0.95) * 100)}%
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-3 rounded-lg border border-emerald-100 dark:border-slate-800">
              {analysis.health_explanation || 'The vegetation appears healthy based on current Sentinel-2 multispectral analysis.'}
            </p>
          </div>

          {/* Actionable Agronomy Advisory */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tailored Farmer Advisory</h3>
            
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border-l-4 border-blue-500 text-xs space-y-1">
              <div className="font-bold text-blue-700 dark:text-blue-400">💧 Irrigation Guidance</div>
              <div className="text-slate-600 dark:text-slate-300">
                {analysis.advisory_irrigation || 'Maintain light scheduled watering every 7-10 days.'}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border-l-4 border-emerald-500 text-xs space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-400">🧪 Fertilization Protocol</div>
              <div className="text-slate-600 dark:text-slate-300">
                {analysis.advisory_fertilizer || 'Top-dress with Urea @ 25 kg/acre + DAP @ 15 kg/acre.'}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border-l-4 border-amber-500 text-xs space-y-1">
              <div className="font-bold text-amber-700 dark:text-amber-400">🛡️ Plant Protection & Pest Risk</div>
              <div className="text-slate-600 dark:text-slate-300">
                {analysis.advisory_pest || 'Low pest incidence. Continue regular scouting.'}
              </div>
            </div>
          </div>

          {/* Report Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
            <div>Verified by KrishiVision AI • Sentinel-2 Earth Observation</div>
            <div className="flex items-center space-x-1 font-mono">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Digital Agronomy Seal</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
