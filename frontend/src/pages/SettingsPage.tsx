import React, { useState } from 'react';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Satellite, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  Check, 
  Database,
  Info
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (screen: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [satelliteProvider, setSatelliteProvider] = useState<'sentinel' | 'gee' | 'demo'>('demo');

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure preferences, language, satellite feeds, and system options
        </p>
      </div>

      {/* Language Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-extrabold text-slate-900 dark:text-white">
          <Globe className="w-4 h-4 text-brand-600" />
          <span>Regional Language / भाषा</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { code: 'en', label: 'English (EN)' },
            { code: 'hi', label: 'हिंदी (Hindi)' },
            { code: 'mr', label: 'मराठी (Marathi)' },
            { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
            { code: 'te', label: 'తెలుగు (Telugu)' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code as LanguageCode)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${
                language === item.code
                  ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              {language === item.code && <Check className="w-4 h-4 text-brand-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Theme & Display */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-extrabold text-slate-900 dark:text-white">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>Theme & Appearance</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</div>
            <div className="text-[11px] text-slate-500">Reduce glare during night field operations</div>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              theme === 'dark' ? 'bg-brand-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* Satellite Feeds & API Architecture */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-sm font-extrabold text-slate-900 dark:text-white">
          <Satellite className="w-4 h-4 text-brand-600" />
          <span>Satellite Engine Provider</span>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="satellite"
                checked={satelliteProvider === 'demo'}
                onChange={() => setSatelliteProvider('demo')}
                className="text-brand-600 focus:ring-brand-500"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">DEMO_AI Mode (Sentinel-2 Synthetic BOA)</div>
                <div className="text-[11px] text-slate-500">Zero API key setup required • Instant high-precision spectral calculation</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">Active</span>
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer opacity-75">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="satellite"
                checked={satelliteProvider === 'sentinel'}
                onChange={() => setSatelliteProvider('sentinel')}
                className="text-brand-600 focus:ring-brand-500"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Copernicus Sentinel Hub API (Direct)</div>
                <div className="text-[11px] text-slate-500">Configured via SENTINEL_HUB_CLIENT_ID env variable</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* System Information Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
        <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200">
          <Info className="w-4 h-4 text-brand-600" />
          <span>About SatCrop / KrishiVision AI</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          SatCrop empowers farmers with AI-powered satellite analysis to monitor crop health, growth stage, and estimated harvest in real time.
        </p>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono flex justify-between">
          <span>Version: 2.0.0</span>
          <span>FastAPI + SQLite + Leaflet</span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3.5 px-6 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-extrabold text-sm border border-rose-200 dark:border-rose-800/60 transition-colors flex items-center justify-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of SatCrop</span>
      </button>

    </div>
  );
};
