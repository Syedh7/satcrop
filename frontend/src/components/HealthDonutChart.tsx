import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface HealthDonutChartProps {
  healthy: number;
  moderate: number;
  poor: number;
}

export const HealthDonutChart: React.FC<HealthDonutChartProps> = ({ healthy, moderate, poor }) => {
  const data = [
    { name: 'Healthy', value: healthy, color: '#16a34a' },
    { name: 'Moderate', value: moderate, color: '#eab308' },
    { name: 'Poor', value: poor, color: '#ef4444' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Donut Chart */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={38}
              outerRadius={58}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => [`${val}%`, 'Proportion']}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-semibold text-slate-400">Total</span>
          <span className="text-sm font-black text-slate-800 dark:text-white">100%</span>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="flex-1 w-full space-y-2.5">
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-sm" />
            <span>Healthy Crop</span>
          </div>
          <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{healthy}%</span>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
            <span>Moderate Condition</span>
          </div>
          <span className="font-extrabold font-mono text-amber-600 dark:text-amber-400">{moderate}%</span>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-200">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm" />
            <span>Poor / Stressed</span>
          </div>
          <span className="font-extrabold font-mono text-rose-600 dark:text-rose-400">{poor}%</span>
        </div>
      </div>
    </div>
  );
};
