import React from 'react';
import { Sprout, Satellite, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SplashPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onGetStarted, onLogin }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-4 py-8 max-w-lg mx-auto text-center">
      
      {/* Top Tag & Decorative Orbit */}
      <div className="pt-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-brand-800 dark:text-brand-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 shadow-sm animate-pulse">
          <Satellite className="w-3.5 h-3.5" />
          <span>KrishiVision AI Satellite Network</span>
        </div>
      </div>

      {/* Hero Visual & Branding (Matching Reference Splash Screen) */}
      <div className="my-auto space-y-6 w-full">
        
        {/* Visual Hero Card */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full bg-gradient-to-b from-brand-500 to-brand-800 p-1 shadow-2xl flex items-center justify-center overflow-hidden">
          
          {/* Background lush crop texture overlay */}
          <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.4) 0%, rgba(21, 128, 61, 0.95) 100%)'
          }} />

          {/* Animated Orbiting Ring */}
          <div className="absolute inset-2 border-2 border-dashed border-emerald-300/40 rounded-full radar-sweep pointer-events-none" />

          {/* Center Brand Sprout */}
          <div className="relative z-10 w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
            <Sprout className="w-14 h-14 text-white drop-shadow-md" />
          </div>

        </div>

        {/* Brand Titles */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('appName')}
          </h1>
          <p className="text-lg sm:text-xl font-extrabold text-brand-600 dark:text-brand-400">
            “{t('tagline')}”
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
            {t('subtitle')}
          </p>
        </div>

      </div>

      {/* Bottom CTA Buttons */}
      <div className="w-full space-y-3 pb-6">
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all"
        >
          <span>{t('getStarted')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={onLogin}
          className="w-full py-3 px-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors"
        >
          {t('login')}
        </button>
      </div>

    </div>
  );
};
