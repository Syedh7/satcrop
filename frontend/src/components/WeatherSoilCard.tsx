import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, Thermometer, Layers, Compass, RefreshCw, Zap, Sun } from 'lucide-react';
import { getLiveTimestampLabel } from '../services/liveAgroService';

interface WeatherSoilCardProps {
  weather: any;
  onRefresh?: () => Promise<void>;
}

export const WeatherSoilCard: React.FC<WeatherSoilCardProps> = ({ weather, onRefresh }) => {
  if (!weather) return null;

  const current = weather.current || weather || {};
  const forecast = weather.daily_forecast || current.weekly_forecast || [];
  const topsoilMoisture = current.soil_moisture_topsoil_pct ?? current.soil_moisture_0_7cm ?? 27.5;
  const subsoilMoisture = current.soil_moisture_subsoil_pct ?? current.soil_moisture_7_28cm ?? 32.0;
  const windGusts = current.wind_gusts_kmh ?? null;
  const dewPoint = current.dew_point_c ?? null;
  const solarRadiation = current.solar_radiation_wm2 ?? null;
  const dataSource = current.data_source ?? weather.data_source ?? null;
  const liveFetchedAt = current.live_fetched_at ?? weather.live_fetched_at ?? null;

  const [timeLabel, setTimeLabel] = useState<string>(getLiveTimestampLabel(liveFetchedAt));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update the "X seconds ago" label every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLabel(getLiveTimestampLabel(liveFetchedAt));
    }, 5_000);
    return () => clearInterval(interval);
  }, [liveFetchedAt]);

  // Update label immediately when liveFetchedAt changes (new data arrived)
  useEffect(() => {
    setTimeLabel(getLiveTimestampLabel(liveFetchedAt));
  }, [liveFetchedAt]);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getMoistureColor = (pct: number) => {
    if (pct >= 25) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (pct >= 15) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
  };

  const isLiveData = dataSource?.includes('Open-Meteo') || liveFetchedAt != null;

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
              {current.weather_condition || current.condition || 'Partly Sunny'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* LIVE Badge */}
          <div className="flex items-center gap-1.5">
            {isLiveData ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                LIVE
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                OFFLINE
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {current.temperature_c ?? current.temp ?? 28.5}°C
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">{timeLabel}</span>
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh live weather data"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Primary Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Humidity */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Humidity</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200">
            {current.humidity_pct ?? current.humidity ?? 62}%
          </div>
          {dewPoint !== null && (
            <span className="text-[9px] text-slate-400 font-medium block">Dew: {dewPoint}°C</span>
          )}
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            <span>Wind Speed</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200">
            {current.wind_speed_kmh ?? current.wind_speed ?? 12} km/h
          </div>
          {windGusts !== null && (
            <span className="text-[9px] text-slate-400 font-medium block">Gusts: {windGusts} km/h</span>
          )}
        </div>

        {/* Soil Moisture 0-7cm */}
        <div className={`p-3 rounded-2xl border space-y-1 ${getMoistureColor(topsoilMoisture)}`}>
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Topsoil Moisture</span>
          </div>
          <div className="text-sm sm:text-base font-black font-mono">
            {typeof topsoilMoisture === 'number' ? topsoilMoisture.toFixed(1) : topsoilMoisture}%
          </div>
          <span className="text-[9px] uppercase font-bold block">
            {current.soil_health_status || (topsoilMoisture >= 25 ? 'Optimal' : topsoilMoisture >= 15 ? 'Moderate' : 'Deficit')}
          </span>
        </div>

        {/* Soil Moisture 7-28cm */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Subsoil (28cm)</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold font-mono text-slate-800 dark:text-slate-200">
            {typeof subsoilMoisture === 'number' ? subsoilMoisture.toFixed(1) : subsoilMoisture}%
          </div>
          <span className="text-[9px] text-slate-400 block font-medium">Root Zone Moisture</span>
        </div>
      </div>

      {/* Extended Telemetry Row: Solar Radiation + Soil Temp */}
      {(solarRadiation !== null || current.soil_temp_c !== null) && (
        <div className="grid grid-cols-2 gap-3">
          {solarRadiation !== null && (
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-100 dark:border-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <Sun className="w-3.5 h-3.5" />
                <span>Solar Radiation</span>
              </div>
              <div className="text-sm font-extrabold font-mono text-amber-800 dark:text-amber-200">
                {solarRadiation} W/m²
              </div>
              <span className="text-[9px] text-amber-600 dark:text-amber-500 font-medium block">
                {solarRadiation > 600 ? 'High Photosynthesis' : solarRadiation > 300 ? 'Moderate Light' : 'Low Light'}
              </span>
            </div>
          )}

          {(current.soil_temp_c ?? current.soil_temperature_c) !== undefined && (
            <div className="bg-orange-50 dark:bg-orange-950/40 p-3 rounded-2xl border border-orange-100 dark:border-orange-900 space-y-1">
              <div className="flex items-center space-x-1.5 text-orange-600 dark:text-orange-400 text-xs font-semibold">
                <Thermometer className="w-3.5 h-3.5" />
                <span>Soil Temperature</span>
              </div>
              <div className="text-sm font-extrabold font-mono text-orange-800 dark:text-orange-200">
                {current.soil_temp_c ?? current.soil_temperature_c}°C
              </div>
              <span className="text-[9px] text-orange-600 dark:text-orange-500 font-medium block">
                {(current.soil_temp_c ?? current.soil_temperature_c) > 30
                  ? 'Warm — Active Microbial'
                  : (current.soil_temp_c ?? current.soil_temperature_c) < 15
                  ? 'Cold — Slow Root Growth'
                  : 'Optimal Root Activity'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Data Source Badge */}
      {dataSource && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>{dataSource}</span>
        </div>
      )}

      {/* 7-Day Rainfall & Evapotranspiration Forecast */}
      {forecast.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">7-Day Agro Precipitation Forecast</span>
            <span className="text-[11px] text-slate-400 font-mono">Avg ET₀: {weather.avg_et0_mm_day ?? 4.3} mm/day</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 overflow-x-auto text-center">
            {forecast.map((day: any, idx: number) => {
              const rainChanceVal = day.rain_chance ?? day.precipitation_probability ?? 10;
              const hasRain = rainChanceVal >= 40;
              const dateLabel = day.date
                ? day.date.slice(5)
                : day.day ?? `D${idx + 1}`;

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border text-[10px] space-y-1 transition-all ${
                    hasRain
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-semibold">{dateLabel}</div>
                  <div className="text-xs">{hasRain ? '🌧️' : '🌤️'}</div>
                  <div className="font-extrabold font-mono">{Math.round(day.max_temp)}°</div>
                  <div className={`font-mono text-[9px] font-bold ${hasRain ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    {Math.round(rainChanceVal)}%
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
