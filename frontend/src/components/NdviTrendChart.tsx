import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Orbit } from 'lucide-react';

interface NdviTrendChartProps {
  timeseriesData: any;
}

export const NdviTrendChart: React.FC<NdviTrendChartProps> = ({ timeseriesData }) => {
  if (!timeseriesData) return null;

  // Normalize passes array
  const rawPasses = Array.isArray(timeseriesData) 
    ? timeseriesData 
    : (timeseriesData.historical_passes || timeseriesData.passes || []);

  if (rawPasses.length === 0) return null;

  const passes = rawPasses.map((p: any) => ({
    date: p.date || 'Recent',
    field_ndvi: typeof p.field_ndvi === 'number' ? p.field_ndvi : (typeof p.ndvi === 'number' ? p.ndvi : 0.70),
    regional_avg_ndvi: typeof p.regional_avg_ndvi === 'number' ? p.regional_avg_ndvi : (typeof p.district_avg === 'number' ? p.district_avg : 0.65),
    ndwi_moisture: typeof p.ndwi_moisture === 'number' ? p.ndwi_moisture : (typeof p.ndwi === 'number' ? p.ndwi : 0.45),
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
            <Orbit className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Sentinel-2 Multi-temporal Analysis
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Vegetation Vigour Trajectory (Past 75 Days)
            </h3>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {timeseriesData.growth_trend || 'Active Growth'}
        </span>
      </div>

      {/* Chart */}
      <div className="h-60 w-full pt-2 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <LineChart data={passes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              domain={[0, 1.0]} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderRadius: '16px', 
                border: 'none', 
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="field_ndvi" 
              name="My Field NDVI" 
              stroke="#16a34a" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="regional_avg_ndvi" 
              name="District Benchmark NDVI" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
        <span>Sentinel-2 Revisit Interval: 15 Days</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">Green line indicates your canopy biomass trajectory.</span>
      </div>

    </div>
  );
};
