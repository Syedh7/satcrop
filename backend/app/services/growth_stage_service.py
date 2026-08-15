from typing import Dict, Any

class GrowthStageService:
    """
    Computes Crop Health Category, Growth Stage, and Harvest Yield Estimation.
    """

    STAGES_BY_CROP = {
        "Wheat": ["Crown Root Initiation", "Tillering Stage", "Jointing Stage", "Booting Stage", "Flowering / Heading", "Milking / Grain Filling", "Maturity / Ready to Harvest"],
        "Soybean": ["Emergence (VE)", "Vegetative (V2-V4)", "Flowering (R1-R2)", "Pod Development (R3-R4)", "Seed Filling (R5-R6)", "Maturity (R8)"],
        "Rice (Paddy)": ["Seedling Stage", "Tillering Stage", "Stem Elongation", "Panicle Initiation", "Flowering / Anthesis", "Ripening / Dough Stage"],
        "Maize": ["Knee-high Stage", "Tasseling Stage", "Silking Stage", "Milky Stage", "Dent Stage", "Physiological Maturity"],
        "Cotton": ["Seedling", "Square Formation", "Flowering", "Boll Development", "Boll Bursting / Picking"],
        "Sugarcane": ["Germination", "Tillering", "Grand Growth Phase", "Maturity & Ripening"],
        "Mustard": ["Seedling Stage", "Rosette Stage", "Branching & Flowering", "Pod Formation (Siliqua)", "Maturity"],
        "Gram (Chickpea)": ["Branching Stage", "Vegetative Growth", "Pod Formation", "Grain Filling", "Maturity"]
    }

    @classmethod
    def evaluate_health_and_stage(cls, crop_name: str, ndvi: float, field_area_acres: float, base_yield: float) -> Dict[str, Any]:
        # Health categorization
        if ndvi >= 0.65:
            health = "Healthy"
            health_color = "#16a34a" # green
            explanation = "The vegetation appears vigorous, dense, and healthy with strong chlorophyll absorption and minimal water stress."
            yield_multiplier = 1.08 + (ndvi - 0.65) * 0.5
        elif ndvi >= 0.40:
            health = "Moderate"
            health_color = "#ca8a04" # yellow/amber
            explanation = "Vegetation density is moderate. Field exhibits slight moisture or nutrient variance requiring mild fertilization and irrigation."
            yield_multiplier = 0.85 + (ndvi - 0.40) * 0.4
        else:
            health = "Poor"
            health_color = "#dc2626" # red
            explanation = "Vegetation shows low canopy density or signs of stress (water deficit, nutrient deficiency, or early weed infestation)."
            yield_multiplier = 0.55 + (ndvi / 0.40) * 0.25

        # Determine growth stage based on NDVI curve
        stages = cls.STAGES_BY_CROP.get(crop_name, cls.STAGES_BY_CROP["Wheat"])
        if ndvi < 0.35:
            stage = stages[0]
        elif ndvi < 0.55:
            stage = stages[1]
        elif ndvi < 0.70:
            stage = stages[2]
        elif ndvi < 0.82:
            stage = stages[3] if len(stages) > 3 else stages[-2]
        else:
            stage = stages[4] if len(stages) > 4 else stages[-1]

        # Calculate estimated harvest
        estimated_harvest = round(field_area_acres * base_yield * yield_multiplier, 1)

        return {
            "crop_health": health,
            "health_color": health_color,
            "health_explanation": explanation,
            "growth_stage": stage,
            "estimated_harvest": estimated_harvest,
            "harvest_unit": "Quintal",
            "yield_per_acre": round(estimated_harvest / max(field_area_acres, 0.1), 1)
        }

growth_stage_service = GrowthStageService()
