import React, { useState, useEffect } from 'react';
import { X, Landmark, ExternalLink, ShieldCheck, FileCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

interface KrishiSchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KrishiSchemesModal: React.FC<KrishiSchemesModalProps> = ({ isOpen, onClose }) => {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchSchemes = async () => {
        try {
          const res = await api.get('/schemes/list');
          setSchemes(res.data);
          setSelectedScheme(res.data[0]);
        } catch {
          const fallback = [
            {
              id: "pm_kisan",
              name: "PM-KISAN Samman Nidhi",
              category: "Direct Income Support",
              benefit_amount: "₹6,000 / year (in 3 installments of ₹2,000)",
              eligibility: "All landholding farmer families with cultivable landholding.",
              documents_needed: "Aadhaar Card, Land Ownership (Khatauni/7/12), Bank Account.",
              official_portal: "https://pmkisan.gov.in"
            },
            {
              id: "pmfby",
              name: "PM Fasal Bima Yojana (PMFBY)",
              category: "Crop Insurance",
              benefit_amount: "Up to 100% sum insured against natural calamities, pests, and drought.",
              eligibility: "All farmers growing notified crops (1.5% to 2% premium).",
              documents_needed: "Sowing Certificate, Land Possession Document, Aadhaar Card.",
              official_portal: "https://pmfby.gov.in"
            },
            {
              id: "pmksy_drip",
              name: "PM Krishi Sinchayee Yojana (Drip Subsidy)",
              category: "Micro-Irrigation Subsidy",
              benefit_amount: "Up to 55% subsidy on Drip and Sprinkler irrigation systems.",
              eligibility: "Farmers with valid land ownership and assured water source.",
              documents_needed: "Land Record (7/12), Aadhaar, Water Source Certificate.",
              official_portal: "https://pmksy.gov.in"
            }
          ];
          setSchemes(fallback);
          setSelectedScheme(fallback[0]);
        }
      };
      fetchSchemes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-inner">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Government Krishi Schemes & Subsidies
              </h2>
              <span className="text-[11px] text-slate-500">Central & State Agricultural Benefits Guide</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Scheme Selection Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {schemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className={`px-3 py-2 rounded-xl font-bold text-xs shrink-0 transition-all border ${
                  selectedScheme?.id === scheme.id
                    ? 'bg-brand-600 text-white border-brand-700 shadow-md shadow-brand-600/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {scheme.name.split(' (')[0]}
              </button>
            ))}
          </div>

          {/* Detailed Selected Scheme Card */}
          {selectedScheme && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {selectedScheme.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedScheme.name}
                </h3>
              </div>

              {/* Benefit Amount */}
              <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-4 rounded-2xl shadow-md space-y-1">
                <span className="text-xs text-emerald-200 font-medium">Subsidy / Financial Benefit</span>
                <div className="text-base sm:text-lg font-extrabold text-amber-300">
                  {selectedScheme.benefit_amount}
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-1 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Farmer Eligibility Criteria:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 pl-5">
                  {selectedScheme.eligibility}
                </p>
              </div>

              {/* Required Documents */}
              <div className="space-y-1 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  Documents Required:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 pl-5">
                  {selectedScheme.documents_needed}
                </p>
              </div>

              {/* Portal Link */}
              {selectedScheme.official_portal && (
                <a
                  href={selectedScheme.official_portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-brand-600/20"
                >
                  <span>Open Official Government Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
