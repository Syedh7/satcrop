import random
from typing import Dict, Any

class AICropClassifier:
    """
    AI model simulating Deep Learning Crop Type Classification (ResNet/Vision Transformer).
    Identifies crop based on spectral reflectance, geographical coordinates, and seasonality.
    """

    CROP_CATALOG = {
        "Wheat": {
            "icon": "🌾",
            "optimal_ndvi_range": (0.60, 0.85),
            "common_states": ["Madhya Pradesh", "Punjab", "Haryana", "Uttar Pradesh", "Rajasthan"],
            "base_yield_per_acre": 13.5  # Quintals per acre
        },
        "Soybean": {
            "icon": "🫘",
            "optimal_ndvi_range": (0.55, 0.80),
            "common_states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka"],
            "base_yield_per_acre": 9.2
        },
        "Rice (Paddy)": {
            "icon": "🌾",
            "optimal_ndvi_range": (0.65, 0.90),
            "common_states": ["Punjab", "Andhra Pradesh", "West Bengal", "Uttar Pradesh", "Chhattisgarh"],
            "base_yield_per_acre": 18.0
        },
        "Maize": {
            "icon": "🌽",
            "optimal_ndvi_range": (0.58, 0.82),
            "common_states": ["Karnataka", "Madhya Pradesh", "Maharashtra", "Bihar", "Telangana"],
            "base_yield_per_acre": 16.5
        },
        "Cotton": {
            "icon": "☁️",
            "optimal_ndvi_range": (0.50, 0.78),
            "common_states": ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Punjab"],
            "base_yield_per_acre": 8.5
        },
        "Sugarcane": {
            "icon": "🎋",
            "optimal_ndvi_range": (0.68, 0.92),
            "common_states": ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu"],
            "base_yield_per_acre": 320.0
        },
        "Mustard": {
            "icon": "🌼",
            "optimal_ndvi_range": (0.52, 0.76),
            "common_states": ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh"],
            "base_yield_per_acre": 7.8
        },
        "Gram (Chickpea)": {
            "icon": "🌱",
            "optimal_ndvi_range": (0.48, 0.72),
            "common_states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka"],
            "base_yield_per_acre": 6.5
        }
    }

    @classmethod
    def classify_crop(cls, lat: float, lng: float, state: str, district: str, ndvi: float, crop_hint: str = None) -> Dict[str, Any]:
        if crop_hint and crop_hint in cls.CROP_CATALOG:
            selected_crop = crop_hint
            confidence = round(random.uniform(0.92, 0.98), 2)
        else:
            # Deterministic selection based on coordinates & state
            state_lower = state.lower()
            if "punjab" in state_lower or "haryana" in state_lower:
                candidates = ["Wheat", "Rice (Paddy)", "Maize", "Cotton"]
            elif "maharashtra" in state_lower:
                candidates = ["Soybean", "Cotton", "Sugarcane", "Gram (Chickpea)"]
            elif "gujarat" in state_lower:
                candidates = ["Cotton", "Groundnut", "Wheat", "Mustard"]
            else: # Madhya Pradesh / Central India
                candidates = ["Wheat", "Soybean", "Gram (Chickpea)", "Maize"]
                
            # Pick primary candidate based on coordinate hash
            idx = int((abs(lat) * 10 + abs(lng) * 5)) % len(candidates)
            selected_crop = candidates[idx]
            confidence = round(0.88 + 0.10 * (ndvi / 1.0), 2)
            confidence = min(confidence, 0.98)

        crop_data = cls.CROP_CATALOG.get(selected_crop, cls.CROP_CATALOG["Wheat"])

        return {
            "crop_name": selected_crop,
            "crop_icon": crop_data["icon"],
            "confidence_score": confidence,
            "optimal_ndvi_range": crop_data["optimal_ndvi_range"],
            "base_yield_per_acre": crop_data["base_yield_per_acre"]
        }

ai_classifier = AICropClassifier()
