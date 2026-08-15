import React from 'react';
import { CloudSun, Droplets, Wind, Thermometer, Layers, SunMedium, Compass } from 'lucide-react';

interface WeatherSoilCardProps {
  weather: any;
}

export const WeatherSoilCard: React.FC<WeatherSoilCardProps> = ({ weather }) => {
  if (!weather) return null;

  const current = weather.current || {};
  const forecast = weather.daily_forecast || [];
  const topsoilMoisture = current.soil_moisture_topsoil_pct ?? 27.5;
  const subsoilMoisture = current.soil_moisture_subsoil_pct ?? 32.0;

  const getMoistureColor = (pct: number) => {
    if (pct >= 25) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200';
    if (pct >= 15) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-xl shadow-inner">
            {current.weather_icon || '⛅'}
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Live Agrometeorology
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {current.weather_condition || 'Partly Sunny'}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {current.temperature_c ?? 28.5}°C
          </span>
          <span className="text-[10px] text-slate-400 block font-medium">Real-time Satellite Feed</span>
        </div>
      </div>

      {/* Grid Metrics (Humidity, Wind, Soil Topsoil & Subsoil) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Humidity */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Humidity</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200">
            {current.humidity_pct ?? 62}%
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            <span>Wind Speed</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200">
            {current.wind_speed_kmh ?? 12} km/h
          </div>
        </div>

        {/* Soil Moisture 0-7cm */}
        <div className={`p-3 rounded-2xl border space-y-1 ${getMoistureColor(topsoilMoisture)}`}>
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Topsoil Moisture</span>
          </div>
          <div className="text-sm sm:text-base font-black font-mono">
            {topsoilMoisture}%
          </div>
          <span className="text-[9px] uppercase font-bold block">{current.soil_health_status || 'Optimal'}</span>
        </div>

        {/* Soil Moisture 7-28cm */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Subsoil (28cm)</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200">
            {subsoilMoisture}%
          </div>
          <span className="text-[9px] text-slate-400 block font-medium">Root Zone Moisture</span>
        </div>

      </div>

      {/* 7-Day Rainfall & Evapotranspiration Forecast */}
      {forecast.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">7-Day Agro Precipitation Forecast</span>
            <span className="text-[11px] text-slate-400 font-mono">Avg ET₀: {weather.avg_et0_mm_day ?? 4.3} mm/day</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 overflow-x-auto text-center">
            {forecast.map((day: any, idx: number) => {
              const rainChance = day.rain_chance ?? 10;
              const hasRain = rainChance >= 40;

              return (
                <div 
                  key={idx} 
                  className={`p-2 rounded-xl border text-[10px] space-y-1 transition-all ${
                    hasRain
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-semibold">{day.date ? day.date.slice(5) : `D${idx+1}`}</div>
                  <div className="text-xs">{hasRain ? '🌧️' : '🌤️'}</div>
                  <div className="font-extrabold font-mono">{Math.round(day.max_temp)}°</div>
                  <div className={`font-mono text-[9px] font-bold ${hasRain ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    {rainChance}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
