import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User as UserIcon, 
  Edit3, 
  Layers, 
  Settings, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck,
  CheckCircle,
  X
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (screen: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, logout, updateUser } = useAuth();
  const { t } = useLanguage();

  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.name || 'Ramesh Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [district, setDistrict] = useState(user?.district || 'Jabalpur');
  const [state, setState] = useState(user?.state || 'Madhya Pradesh');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, phone, district, state });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowEditModal(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 pb-24 md:pb-12">
      
      {/* Profile Avatar Card (Matching Reference Screen Flow) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
        
        {/* Farmer Avatar */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 p-1 shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-brand-700 dark:text-brand-300">
              {user?.name ? user.name.charAt(0) : 'R'}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px]">
            ✓
          </div>
        </div>

        {/* Farmer Name & Contact */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {user?.name || 'Ramesh Kumar'}
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {user?.email || 'ramesh@satcrop.com'}
          </div>
          <div className="text-xs text-brand-600 dark:text-brand-400 font-mono font-semibold">
            {user?.phone || '+91 9876543210'}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-brand-600" />
            {user?.district || 'Jabalpur'}, {user?.state || 'Madhya Pradesh'}
          </div>
        </div>

      </div>

      {/* Profile Actions Menu (Matching Reference Screen Flow) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
        
        {/* Edit Profile */}
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full px-4 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Edit Profile
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
        </button>

        {/* My Fields */}
        <button
          onClick={() => onNavigate('fields')}
          className="w-full px-4 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              My Fields
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate('settings')}
          className="w-full px-4 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Settings & Preferences
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full px-4 py-3.5 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-between transition-colors group text-rose-600 dark:text-rose-400"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm font-extrabold">
              Logout
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Edit Farmer Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Farmer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all mt-2"
              >
                {savedSuccess ? 'Profile Updated ✓' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
