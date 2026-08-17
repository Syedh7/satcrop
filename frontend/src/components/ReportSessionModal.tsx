import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle, 
  Sprout, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Droplet, 
  FlaskConical, 
  Bug,
  Share2,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { WhatsAppShareButton } from './WhatsAppShareButton';

interface ReportSessionModalProps {
  analysis: any;
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportSessionModal: React.FC<ReportSessionModalProps> = ({
  analysis,
  user,
  isOpen,
  onClose
}) => {
  if (!isOpen || !analysis) return null;

  const handlePrint = () => {
    window.print();
  };

  const cropName = analysis.crop_name || 'Wheat';
  const cropHealth = analysis.crop_health || 'Healthy';
  const ndvi = analysis.ndvi || 0.72;
  const district = analysis.district || 'Jabalpur';
  const state = analysis.state || 'Madhya Pradesh';
  const harvestYield = analysis.estimated_harvest || 32.5;
  const harvestUnit = analysis.harvest_unit || 'Quintal';
  const fieldArea = analysis.field_area || 2.45;
  const growthStage = analysis.growth_stage || 'Tillering Stage';
  const estRevenue = Math.round(harvestYield * 2450);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Action Header (Excluded from Print) */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Agronomy Field Report Session
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <WhatsAppShareButton
              cropName={cropName}
              cropHealth={cropHealth}
              ndvi={ndvi}
              district={district}
              state={state}
              harvestYield={harvestYield}
              estRevenue={estRevenue}
            />

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div id="printable-report" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
          
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-emerald-600 pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-brand-600 tracking-tight">SATCROP</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Official Agronomy Report
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                AI Powered Satellite Crop Monitoring & Precision Agronomy System
              </p>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-slate-500 space-y-0.5">
              <div><strong>Report ID:</strong> SAT-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div><strong>Sensor:</strong> Sentinel-2 Level-2A BOA (10m)</div>
            </div>
          </div>

          {/* Farmer & Location Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Farmer Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{user?.name || 'Ramesh Kumar'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Location</span>
              <span className="font-bold text-slate-900 dark:text-white">{district}, {state}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Field Parcel Size</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{fieldArea} Acres</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Coordinates</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                {analysis.latitude?.toFixed(4) || 23.1815}°, {analysis.longitude?.toFixed(4) || 79.9864}°
              </span>
            </div>
          </div>

          {/* Core Findings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300">Identified Crop</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">{cropName}</div>
              <span className="text-xs text-slate-500">Growth: {growthStage}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300">Vegetation Health Index</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{ndvi.toFixed(2)} NDVI</div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{cropHealth} Status</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300">Yield & Valuation</span>
              <div className="text-xl font-black text-brand-600 dark:text-brand-400 font-mono">{harvestYield} {harvestUnit}</div>
              <span className="text-xs text-slate-500 font-mono">Est. Value: ₹{estRevenue.toLocaleString('en-IN')}</span>
            </div>

          </div>

          {/* Actionable Agronomy Advisories */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Agronomic Action Plan & Guidelines
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong className="text-blue-600 dark:text-blue-400">💧 Irrigation Schedule:</strong>
                <p className="mt-0.5 text-slate-700 dark:text-slate-300">{analysis.advisory_irrigation}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong className="text-emerald-600 dark:text-emerald-400">🌱 Nutrient & Fertilizer Dosage:</strong>
                <p className="mt-0.5 text-slate-700 dark:text-slate-300">{analysis.advisory_fertilizer}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong className="text-amber-600 dark:text-amber-400">🛡️ Crop Protection & Pest Management:</strong>
                <p className="mt-0.5 text-slate-700 dark:text-slate-300">{analysis.advisory_pest}</p>
              </div>
            </div>
          </div>

          {/* Official Verification Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <div>
              <span>Validated by Sentinel-2 Optical Engine & KrishiVision AI</span>
            </div>
            <div>
              <span>https://satcrop.vercel.app</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
