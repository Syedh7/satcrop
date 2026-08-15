import React from 'react';
import { IndianRupee, TrendingUp, Store, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface MandiPriceCardProps {
  marketData: any;
}

export const MandiPriceCard: React.FC<MandiPriceCardProps> = ({ marketData }) => {
  if (!marketData) return null;

  const modalPrice = marketData.modal_price_per_quintal || 2450;
  const msp = marketData.msp_per_quintal || 2275;
  const grossRevenue = marketData.estimated_gross_revenue_inr || 79625;
  const harvestYield = marketData.harvest_yield_quintals || 32.5;
  const premium = marketData.market_premium_inr || 5687;

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
              APMC Mandi & Commodity Pricing
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {marketData.crop_name || 'Wheat'} Market Valuation
            </h3>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {marketData.market_trend || 'Bullish'}
        </span>
      </div>

      {/* Revenue Projection Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-brand-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-emerald-200 font-medium">Estimated Gross Farm Revenue</span>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center">
              <span>₹{grossRevenue.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[11px] text-emerald-300">
              Based on {harvestYield} Quintals @ ₹{modalPrice}/Q modal rate
            </span>
          </div>

          {premium > 0 && (
            <div className="text-right bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <span className="text-[10px] text-emerald-200 block font-medium">Over Gov. MSP</span>
              <span className="text-xs font-black text-amber-300 font-mono">+₹{premium.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">APMC Modal Price</span>
          <span className="text-sm font-black font-mono text-brand-600 dark:text-brand-400 mt-0.5 block">
            ₹{modalPrice} / Quintal
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">Gov. MSP Base</span>
          <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5 block">
            ₹{msp} / Quintal
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-slate-400 block text-[10px]">Active Mandi Range</span>
          <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5 block">
            {marketData.price_range || '₹2,300 - ₹2,680'}
          </span>
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

    </div>
  );
};
