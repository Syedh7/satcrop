import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HealthDonutChart } from '../components/HealthDonutChart';
import { api } from '../services/api';
import { DashboardStats, Analysis } from '../types';
import { 
  Sprout, 
  MapPin, 
  CloudSun, 
  ChevronRight, 
  PlusCircle, 
  History, 
  Map, 
  TrendingUp, 
  Activity, 
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (screen: string) => void;
  onSelectAnalysis: (analysis: Analysis) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectAnalysis }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.warn('Dashboard fallback triggered:', err);
        // Fallback default stats matching reference
        setStats({
          total_fields: 3,
          total_acreage: 8.45,
          healthy_percent: 65,
          moderate_percent: 25,
          poor_percent: 10,
          healthy_count: 2,
          moderate_count: 1,
          poor_count: 0,
          recent_analyses: [
            {
              id: 'an-001',
              user_id: 'user-01',
              crop_name: 'Wheat',
              crop_health: 'Healthy',
              growth_stage: 'Tillering Stage',
              ndvi: 0.72,
              district: 'Jabalpur',
              state: 'Madhya Pradesh',
              latitude: 23.1815,
              longitude: 79.9864,
              field_area: 2.45,
              estimated_harvest: 32.5,
              harvest_unit: 'Quintal',
              confidence_score: 0.96,
              health_explanation: 'The vegetation appears healthy based on current Sentinel-2 analysis.',
              source: 'DEMO_AI',
              analysis_date: new Date().toISOString(),
              created_at: new Date().toISOString()
            },
            {
              id: 'an-002',
              user_id: 'user-01',
              crop_name: 'Soybean',
              crop_health: 'Moderate',
              growth_stage: 'Pod Development (R3-R4)',
              ndvi: 0.54,
              district: 'Jabalpur',
              state: 'Madhya Pradesh',
              latitude: 23.1650,
              longitude: 79.9520,
              field_area: 4.20,
              estimated_harvest: 38.6,
              harvest_unit: 'Quintal',
              confidence_score: 0.92,
              health_explanation: 'Mild moisture deficit detected in western quadrant.',
              source: 'DEMO_AI',
              analysis_date: new Date(Date.now() - 86400000 * 5).toISOString(),
              created_at: new Date(Date.now() - 86400000 * 5).toISOString()
            }
          ],
          current_location: {
            district: user?.district || 'Jabalpur',
            state: user?.state || 'Madhya Pradesh',
            latitude: 23.1815,
            longitude: 79.9864
          },
          weather: {
            temp: 28.5,
            condition: 'Partly Sunny',
            humidity: 62,
            rain_probability: 15,
            wind_speed: '12 km/h'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Top Greeting & Location Card */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Background Subtle Radar Effect */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 border-4 border-white/10 rounded-full pointer-events-none" />
        <div className="absolute right-[-10px] top-[-10px] w-48 h-48 border-2 border-white/10 rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Satellite Crop Intelligence</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {user?.name ? user.name.split(' ')[0] : 'Farmer'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            {getGreetingTime()} • Welcome to your agricultural dashboard
          </p>

          <div className="inline-flex items-center space-x-2 pt-2 text-xs font-semibold bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl">
            <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              {stats?.current_location?.district || 'Jabalpur'}, {stats?.current_location?.state || 'Madhya Pradesh'}
            </span>
          </div>
        </div>

        {/* Live Weather Widget */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center space-x-4 self-start md:self-auto">
          <div className="p-2.5 rounded-xl bg-white/20">
            <CloudSun className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono">
              {stats?.weather?.temp || 28.5}°C
            </div>
            <div className="text-xs font-semibold text-emerald-100">
              {stats?.weather?.condition || 'Partly Sunny'}
            </div>
            <div className="text-[10px] text-emerald-200 mt-0.5">
              Humidity: {stats?.weather?.humidity || 62}% • Rain: {stats?.weather?.rain_probability || 15}%
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions Grid (Matching Reference UI) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Quick Actions
          </h2>
          <button 
            onClick={() => onNavigate('map')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Analyze Field (Primary) */}
          <button
            onClick={() => onNavigate('map')}
            className="group p-4 sm:p-5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-left shadow-lg shadow-brand-600/25 transition-all flex flex-col justify-between h-32"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold">{t('analyzeField')}</div>
              <div className="text-[11px] text-emerald-100 font-medium">Select on Map & Scan</div>
            </div>
          </button>

          {/* My Fields */}
          <button
            onClick={() => onNavigate('fields')}
            className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left shadow-sm transition-all flex flex-col justify-between h-32"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">{t('myFields')}</div>
              <div className="text-[11px] text-slate-500">{stats?.total_fields || 3} Saved Plots</div>
            </div>
          </button>

          {/* History */}
          <button
            onClick={() => onNavigate('history')}
            className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left shadow-sm transition-all flex flex-col justify-between h-32"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">{t('history')}</div>
              <div className="text-[11px] text-slate-500">Past Analysis Records</div>
            </div>
          </button>

          {/* Interactive Map */}
          <button
            onClick={() => onNavigate('map')}
            className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left shadow-sm transition-all flex flex-col justify-between h-32"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">{t('map')}</div>
              <div className="text-[11px] text-slate-500">Satellite Imagery</div>
            </div>
          </button>

        </div>
      </div>

      {/* Main Stats & Health Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Crop Health Overview (Donut Chart) */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {t('cropHealthOverview')}
          </h2>
          <HealthDonutChart
            healthy={stats?.healthy_percent || 65}
            moderate={stats?.moderate_percent || 25}
            poor={stats?.poor_percent || 10}
          />
        </div>

        {/* Quick Land & Acreage Card */}
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Farm Overview
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Registered Land</span>
              <span className="text-lg font-extrabold text-brand-700 dark:text-brand-400 font-mono">
                {stats?.total_acreage || 8.45} Acres
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500">Total Monitored Plots</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {stats?.total_fields || 3} Fields
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500">Satellite Revisit Cycle</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Sentinel-2 (5 Days)
              </span>
            </div>

            <button
              onClick={() => onNavigate('map')}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Scan New Field</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Analyses List (Matching Reference UI) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {t('recentAnalyses')}
          </h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {stats?.recent_analyses?.map((analysis) => {
            const isHealthy = analysis.crop_health === 'Healthy';
            const isModerate = analysis.crop_health === 'Moderate';

            return (
              <div
                key={analysis.id}
                onClick={() => {
                  onSelectAnalysis(analysis);
                  onNavigate('result');
                }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {analysis.crop_name === 'Wheat' ? '🌾' : (analysis.crop_name === 'Soybean' ? '🫘' : (analysis.crop_name === 'Maize' ? '🌽' : '🌱'))}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {analysis.crop_name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHealthy
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : isModerate
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        {analysis.crop_health}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {analysis.growth_stage} • {analysis.district}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      NDVI: {analysis.ndvi?.toFixed(2)} • Area: {analysis.field_area} Acres
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 block">
                    {analysis.estimated_harvest} Q
                  </span>
                  <span className="text-[10px] text-slate-400">Est. Harvest</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
