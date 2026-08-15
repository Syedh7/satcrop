import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sprout, Sun, Moon, Globe, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => onNavigate(user ? 'dashboard' : 'splash')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                SATCROP
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'dashboard'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('map')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'map'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => onNavigate('fields')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'fields'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              My Fields
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'history'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              History
            </button>
          </nav>
        )}

        {/* Right Controls (Language, Theme, Profile / Logout) */}
        <div className="flex items-center space-x-2.5">
          
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="pa">ਪੰਜਾਬੀ (PA)</option>
              <option value="te">తెలుగు (TE)</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
