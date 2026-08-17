import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sprout, 
  Sun, 
  Moon, 
  Globe, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  ArrowLeft, 
  ChevronLeft,
  Home
} from 'lucide-react';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate, onBack, canGoBack = false }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const getScreenTitle = (screen: string) => {
    switch (screen) {
      case 'map': return 'Interactive Map';
      case 'analyzing': return 'Scanning Field...';
      case 'result': return 'Analysis Results';
      case 'fields': return 'My Saved Fields';
      case 'history': return 'Scan History';
      case 'profile': return 'Farmer Profile';
      case 'settings': return 'App Settings';
      default: return '';
    }
  };

  const isSubScreen = user && currentScreen !== 'dashboard' && currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'register';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Left Side: Back Button on Sub-screens OR Brand Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {isSubScreen ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBack ? onBack() : onNavigate('dashboard')}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center space-x-1 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
                title="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xs font-bold hidden sm:inline">Back</span>
              </button>

              <div 
                onClick={() => onNavigate('dashboard')}
                className="cursor-pointer"
              >
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {getScreenTitle(currentScreen)}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium sm:hidden">
                  Tap to home
                </span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => onNavigate(user ? 'dashboard' : 'splash')}
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                    SATCROP
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300">
                    AI
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  {t('tagline')}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Desktop Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'dashboard'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('map')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'map'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => onNavigate('fields')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'fields'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              My Fields
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === 'history'
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              History
            </button>
          </nav>
        )}

        {/* Right Controls (Language, Theme, Profile / Logout) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-6 pr-2 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 cursor-pointer max-w-[90px] sm:max-w-none"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-1.5 pl-1.5 pr-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 sm:p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onNavigate('login')}
                className="px-2.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-3 py-1 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition-colors"
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
