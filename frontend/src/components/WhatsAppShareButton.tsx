import React from 'react';
import { Share2, MessageCircle } from 'lucide-react';

interface WhatsAppShareButtonProps {
  cropName: string;
  cropHealth: string;
  ndvi: number;
  district: string;
  state: string;
  harvestYield: number;
  estRevenue: number;
}

export const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({
  cropName,
  cropHealth,
  ndvi,
  district,
  state,
  harvestYield,
  estRevenue
}) => {
  const handleShareWhatsApp = () => {
    const text = `🌾 *SATCROP Field Intelligence Report* 🌾%0A%0A📍 *Location:* ${district}, ${state}%0A🌱 *Crop:* ${cropName} (${cropHealth})%0A🛰️ *NDVI Health Score:* ${ndvi.toFixed(2)} (High Vigour)%0A🚜 *Estimated Harvest:* ${harvestYield} Quintals%0A💰 *Projected Mandi Revenue:* ₹${estRevenue.toLocaleString('en-IN')}%0A%0A_Generated with SatCrop AI Smart Farming Platform_%0Ahttps://satcrop.vercel.app`;

    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <button
      type="button"
      onClick={handleShareWhatsApp}
      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
      title="Share Crop Advisory on WhatsApp"
    >
      <MessageCircle className="w-4 h-4" />
      <span>Share on WhatsApp</span>
    </button>
  );
};
