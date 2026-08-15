import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Analysis } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  ChevronRight, 
  Filter, 
  Calendar, 
  MapPin, 
  Sprout, 
  Layers 
} from 'lucide-react';

interface HistoryPageProps {
  onSelectAnalysis: (analysis: Analysis) => void;
  onNavigateToMap: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectAnalysis, onNavigateToMap }) => {
  const { t } = useLanguage();
  const [historyList, setHistoryList] = useState<Analysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHealth, setFilterHealth] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analysis/history');
      setHistoryList(res.data);
    } catch (err) {
      console.warn('History fetch fallback:', err);
      // Fallback sample data matching reference design
      setHistoryList([
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
          health_explanation: 'The vegetation appears healthy based on current Sentinel-2 multispectral analysis.',
          source: 'DEMO_AI',
          analysis_date: '2026-05-12T10:00:00Z',
          created_at: '2026-05-12T10:00:00Z'
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
          analysis_date: '2026-05-05T10:00:00Z',
          created_at: '2026-05-05T10:00:00Z'
        },
        {
          id: 'an-003',
          user_id: 'user-01',
          crop_name: 'Maize',
          crop_health: 'Poor',
          growth_stage: 'Tasseling Stage',
          ndvi: 0.38,
          district: 'Jabalpur',
          state: 'Madhya Pradesh',
          latitude: 23.2100,
          longitude: 80.0120,
          field_area: 1.80,
          estimated_harvest: 14.2,
          harvest_unit: 'Quintal',
          confidence_score: 0.89,
          health_explanation: 'Significant moisture stress and nitrogen deficiency observed.',
          source: 'DEMO_AI',
          analysis_date: '2026-04-28T10:00:00Z',
          created_at: '2026-04-28T10:00:00Z'
        },
        {
          id: 'an-004',
          user_id: 'user-01',
          crop_name: 'Wheat',
          crop_health: 'Healthy',
          growth_stage: 'Crown Root Stage',
          ndvi: 0.68,
          district: 'Jabalpur',
          state: 'Madhya Pradesh',
          latitude: 23.1815,
          longitude: 79.9864,
          field_area: 2.45,
          estimated_harvest: 30.0,
          harvest_unit: 'Quintal',
          confidence_score: 0.94,
          health_explanation: 'Initial root initiation is strong and uniform.',
          source: 'DEMO_AI',
          analysis_date: '2026-04-20T10:00:00Z',
          created_at: '2026-04-20T10:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await api.delete(`/analysis/${id}`);
      setHistoryList(prev => prev.filter(item => item.id !== id));
    } catch {
      setHistoryList(prev => prev.filter(item => item.id !== id));
    }
  };

  const filtered = historyList.filter(item => {
    const matchesQuery = 
      item.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.growth_stage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesHealth = filterHealth === 'all' || item.crop_health.toLowerCase() === filterHealth.toLowerCase();

    return matchesQuery && matchesHealth;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 pb-24 md:pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review past satellite scans, NDVI timelines, and yield records
          </p>
        </div>

        <button
          onClick={onNavigateToMap}
          className="self-start sm:self-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
        >
          <Sprout className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, stage, or district..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Health Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Healthy', 'Moderate', 'Poor'].map((h) => (
            <button
              key={h}
              onClick={() => setFilterHealth(h)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                filterHealth === h
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {h === 'all' ? 'All Health' : h}
            </button>
          ))}
        </div>
      </div>

      {/* History Cards List (Matching Reference Screen Flow) */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading analysis history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <HistoryIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Analysis Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'No results matched your search criteria.' : 'Analyze your first agricultural field to generate and save satellite insights here.'}
          </p>
          <button
            onClick={onNavigateToMap}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Analyze First Field
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isHealthy = item.crop_health === 'Healthy';
            const isModerate = item.crop_health === 'Moderate';

            return (
              <div
                key={item.id}
                onClick={() => onSelectAnalysis(item)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                {/* Left Preview Thumbnail & Info */}
                <div className="flex items-center space-x-4">
                  {/* Satellite Thumbnail / Crop Icon */}
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-slate-900 flex items-center justify-center text-3xl shadow-inner shrink-0 overflow-hidden border border-emerald-500/30">
                    <span className="relative z-10">
                      {item.crop_name === 'Wheat' ? '🌾' : (item.crop_name === 'Soybean' ? '🫘' : (item.crop_name === 'Maize' ? '🌽' : '🌱'))}
                    </span>
                    {/* Simulated raster scanline overlay */}
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                        {item.crop_name}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isHealthy
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : isModerate
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}>
                        {item.crop_health}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span>{item.growth_stage}</span>
                      <span>•</span>
                      <span>{item.district}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{item.field_area} Acres</span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2 font-mono">
                      <span>NDVI: {item.ndvi.toFixed(2)}</span>
                      <span>•</span>
                      <span>{new Date(item.analysis_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action & Harvest Tag */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-sm font-black text-slate-900 dark:text-white block font-mono">
                      {item.estimated_harvest} Q
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Yield Est.</span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    title="Delete record"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
