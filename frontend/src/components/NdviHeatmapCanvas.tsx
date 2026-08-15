import React, { useRef, useEffect } from 'react';

interface NdviHeatmapCanvasProps {
  matrix?: number[][];
  baseNdvi: number;
}

export const NdviHeatmapCanvas: React.FC<NdviHeatmapCanvasProps> = ({ matrix, baseNdvi }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 5;
    const cellWidth = canvas.width / size;
    const cellHeight = canvas.height / size;

    // Use provided matrix or fallback grid
    const grid = matrix || [
      [baseNdvi + 0.02, baseNdvi - 0.03, baseNdvi + 0.01, baseNdvi + 0.04, baseNdvi],
      [baseNdvi - 0.01, baseNdvi + 0.05, baseNdvi + 0.02, baseNdvi - 0.04, baseNdvi + 0.01],
      [baseNdvi + 0.03, baseNdvi + 0.01, baseNdvi - 0.02, baseNdvi + 0.03, baseNdvi + 0.02],
      [baseNdvi - 0.02, baseNdvi + 0.04, baseNdvi + 0.01, baseNdvi - 0.01, baseNdvi - 0.03],
      [baseNdvi + 0.01, baseNdvi - 0.02, baseNdvi + 0.03, baseNdvi + 0.02, baseNdvi + 0.04],
    ];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = Math.max(0.1, Math.min(0.95, grid[r][c]));
        // Color mapping from red (low NDVI) to bright green (high NDVI)
        let color = '#22c55e';
        if (val > 0.70) color = '#15803d'; // deep healthy green
        else if (val > 0.55) color = '#22c55e'; // vibrant green
        else if (val > 0.40) color = '#84cc16'; // light green
        else if (val > 0.25) color = '#eab308'; // yellow
        else color = '#ef4444'; // stressed red

        ctx.fillStyle = color;
        ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);
        
        // Draw subtle cell grid line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);
      }
    }
  }, [matrix, baseNdvi]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner border border-emerald-200 dark:border-emerald-800/60 bg-slate-900 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={180}
        className="w-full h-full object-cover filter blur-[2px] contrast-125"
      />
      {/* Overlay legend & radar grid */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none border border-emerald-500/30 rounded-xl" />
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 font-bold">
        🛰️ SENTINEL-2 FALSE COLOR NDVI
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono text-slate-300">
        10m Pixel Resolution
      </div>
    </div>
  );
};
