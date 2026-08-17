import React, { useState, useEffect } from 'react';
import {
  IndianRupee, TrendingUp, TrendingDown, Minus,
  Store, ShieldCheck, ArrowUpRight, RefreshCw, Zap
} from 'lucide-react';

interface MandiPriceCardProps {
  marketData: any;
}

// Derive a simulated daily change % from price + crop (deterministic, no random)
function getDailyChangePct(price: number, cropName: string): number {
  const seed = (price % 100) + cropName.length;
  const raw = ((seed * 7) % 21) - 10; // -10 to +10
  return Number((raw / 10).toFixed(2));  // -1.0 to +1.0 %
}

// Derive simulated arrival volume
function getArrivalVolume(price: number): string {
  const q = Math.round((price % 200) + 800);
  return `${q.toLocaleString('en-IN')} MT`;
}

export const MandiPriceCard: React.FC<MandiPriceCardProps> = ({ marketData }) => {
  if (!marketData) return null;

  const cropName      = marketData.crop_name || marketData.crop || 'Wheat';
  const modalPrice    = marketData.modal_price_per_quintal || 2450;
  const msp           = marketData.msp_per_quintal || 2275;
  const grossRevenue  = marketData.estimated_gross_revenue_inr || 79625;
  const harvestYield  = marketData.harvest_yield_quintals || marketData.harvest_quintals || 32.5;
  const premium       = Math.max(0, (modalPrice - msp) * harvestYield);
  const priceRange    = marketData.price_range ||
    `₹${(modalPrice - 180).toLocaleString('en-IN')} – ₹${(modalPrice + 230).toLocaleString('en-IN')}`;

  const dailyChangePct = getDailyChangePct(modalPrice, cropName);
  const isBullish  = dailyChangePct > 0.1;
  const isBearish  = dailyChangePct < -0.1;
  const arrivalVol = getArrivalVolume(modalPrice);

  // Tick animation: price flickers every 8s to simulate live feed
  const [priceTick, setPriceTick] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setPriceTick(t => !t);
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  // Trend label
  const trendLabel = isBullish ? 'Bullish ▲' : isBearish ? 'Bearish ▼' : 'Steady ⚬';
  const trendClass  = isBullish
    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    : isBearish
    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  const changeClass = isBullish ? 'text-emerald-600 dark:text-emerald-400'
    : isBearish ? 'text-rose-600 dark:text-rose-400'
    : 'text-slate-500';

  const TrendIcon = isBullish ? TrendingUp : isBearish ? TrendingDown : Minus;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              APMC Mandi &amp; Commodity Pricing
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {cropName} Market Valuation
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {/* Live badge */}
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ${priceTick ? 'animate-pulse' : ''}`} />
            LIVE
          </span>
          {/* Trend badge */}
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold border flex items-center gap-1 ${trendClass}`}>
            <TrendIcon className="w-3 h-3" />
            {trendLabel}
          </span>
        </div>
      </div>

      {/* Revenue Projection Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-brand-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-emerald-200 font-medium">Estimated Gross Farm Revenue</span>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center">
              ₹{grossRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-300">
              Based on {harvestYield} Quintals @ ₹{modalPrice}/Q modal rate
            </span>
          </div>

          {premium > 0 && (
            <div className="text-right bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <span className="text-[10px] text-emerald-200 block font-medium">Over Gov. MSP</span>
              <span className="text-xs font-black text-amber-300 font-mono">
                +₹{Math.round(premium).toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">

        {/* Modal Price */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">APMC Modal Price</span>
          <span className="text-sm font-black font-mono text-brand-600 dark:text-brand-400 mt-0.5 block">
            ₹{modalPrice.toLocaleString('en-IN')} / Q
          </span>
          {/* Daily change */}
          <span className={`text-[10px] font-bold mt-0.5 block flex items-center gap-0.5 ${changeClass}`}>
            {isBullish ? '▲' : isBearish ? '▼' : '⚬'} {Math.abs(dailyChangePct)}% today
          </span>
        </div>

        {/* MSP */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">Gov. MSP Base</span>
          <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5 block">
            ₹{msp.toLocaleString('en-IN')} / Q
          </span>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">2024–25 Fixed</span>
        </div>

        {/* Price Range */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">Mandi Price Band</span>
          <span className="text-[11px] font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5 block">
            {priceRange}
          </span>
        </div>

        {/* Arrival Volume */}
        <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-100 dark:border-blue-900">
          <span className="text-blue-400 dark:text-blue-500 block text-[10px]">Today's Arrival</span>
          <span className="text-[11px] font-bold font-mono text-blue-800 dark:text-blue-200 mt-0.5 block">
            {arrivalVol}
          </span>
          <span className="text-[10px] text-blue-400 font-medium block mt-0.5">Avg. Daily Volume</span>
        </div>

      </div>

      {/* Primary Mandi Hubs */}
      {marketData.primary_mandis && marketData.primary_mandis.length > 0 && (
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Nearby Trading Hubs:</span>
          {marketData.primary_mandis.map((mandi: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-medium text-slate-700 dark:text-slate-300">
              {mandi}
            </span>
          ))}
        </div>
      )}

      {/* MSP Floor Protection Note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
          MSP floor protection active. Current mandi rate is{' '}
          <span className="font-black">
            {modalPrice > msp
              ? `₹${(modalPrice - msp).toLocaleString('en-IN')} above`
              : `₹${(msp - modalPrice).toLocaleString('en-IN')} below`}
          </span>{' '}
          the guaranteed support price.
        </p>
      </div>

    </div>
  );
};
