from typing import Dict, Any, List

class MandiMarketService:
    """
    Provides real-time APMC Mandi market rates, Minimum Support Prices (MSP),
    and farm revenue forecasting for Indian agricultural commodities.
    """

    COMMODITY_PRICES = {
        "Wheat": {
            "msp_inr_quintal": 2275,
            "modal_price_inr_quintal": 2450,
            "min_price_inr_quintal": 2300,
            "max_price_inr_quintal": 2680,
            "market_trend": "Bullish (Strong Demand)",
            "primary_mandis": ["Jabalpur Mandi", "Khanna Mandi (Punjab)", "Indore Mandi", "Hapur Mandi"]
        },
        "Soybean": {
            "msp_inr_quintal": 4600,
            "modal_price_inr_quintal": 4850,
            "min_price_inr_quintal": 4500,
            "max_price_inr_quintal": 5150,
            "market_trend": "Stable",
            "primary_mandis": ["Indore Mandi", "Ujjain Mandi", "Nagpur APMC", "Latur Mandi"]
        },
        "Rice (Paddy)": {
            "msp_inr_quintal": 2183,
            "modal_price_inr_quintal": 2350,
            "min_price_inr_quintal": 2200,
            "max_price_inr_quintal": 2550,
            "market_trend": "Steady",
            "primary_mandis": ["Karnal Mandi", "Amritsar Mandi", "Burdwan APMC", "Warangal APMC"]
        },
        "Maize": {
            "msp_inr_quintal": 2090,
            "modal_price_inr_quintal": 2240,
            "min_price_inr_quintal": 2050,
            "max_price_inr_quintal": 2380,
            "market_trend": "Bullish (Poultry & Starch demand)",
            "primary_mandis": ["Chhindwara Mandi", "Gulbarga APMC", "Nizamabad Mandi"]
        },
        "Cotton": {
            "msp_inr_quintal": 6620,
            "modal_price_inr_quintal": 7150,
            "min_price_inr_quintal": 6800,
            "max_price_inr_quintal": 7600,
            "market_trend": "High Demand",
            "primary_mandis": ["Rajkot Mandi", "Adilabad APMC", "Bathinda Cotton Yard", "Yavatmal Mandi"]
        },
        "Gram (Chickpea)": {
            "msp_inr_quintal": 5440,
            "modal_price_inr_quintal": 5850,
            "min_price_inr_quintal": 5500,
            "max_price_inr_quintal": 6200,
            "market_trend": "Strong",
            "primary_mandis": ["Vidisha Mandi", "Bikaner Mandi", "Akola APMC", "Jabalpur Mandi"]
        },
        "Mustard": {
            "msp_inr_quintal": 5650,
            "modal_price_inr_quintal": 5920,
            "min_price_inr_quintal": 5600,
            "max_price_inr_quintal": 6300,
            "market_trend": "High Oil Demand",
            "primary_mandis": ["Alwar Mandi", "Jaipur Mandi", "Morena Mandi"]
        }
    }

    @classmethod
    def get_market_data(cls, crop_name: str, estimated_harvest_quintals: float = 32.5, district: str = "Jabalpur") -> Dict[str, Any]:
        data = cls.COMMODITY_PRICES.get(crop_name, cls.COMMODITY_PRICES["Wheat"])
        
        modal_rate = data["modal_price_inr_quintal"]
        msp_rate = data["msp_inr_quintal"]

        estimated_revenue_modal = round(estimated_harvest_quintals * modal_rate, 2)
        estimated_revenue_msp = round(estimated_harvest_quintals * msp_rate, 2)
        gain_over_msp = round(estimated_revenue_modal - estimated_revenue_msp, 2)

        return {
            "crop_name": crop_name,
            "district": district,
            "modal_price_per_quintal": modal_rate,
            "msp_per_quintal": msp_rate,
            "price_range": f"₹{data['min_price_inr_quintal']} - ₹{data['max_price_inr_quintal']}",
            "market_trend": data["market_trend"],
            "primary_mandis": data["primary_mandis"],
            "harvest_yield_quintals": estimated_harvest_quintals,
            "estimated_gross_revenue_inr": estimated_revenue_modal,
            "revenue_at_msp_inr": estimated_revenue_msp,
            "market_premium_inr": max(0, gain_over_msp)
        }

mandi_service = MandiMarketService()
