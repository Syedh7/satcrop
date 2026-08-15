from typing import Dict, Any

class AgronomyAdvisoryService:
    """
    Generates actionable farmer advisory recommendations based on crop, stage, health, and NDVI.
    """

    @classmethod
    def generate_advisory(cls, crop_name: str, health: str, stage: str, ndvi: float) -> Dict[str, str]:
        if health == "Healthy":
            irrigation = "Maintain current light irrigation schedule (every 7-10 days). Soil moisture levels are optimal."
            fertilizer = "Apply balanced micronutrient spray (Zinc + Boron 0.2%) during early morning hours to maintain green vigor."
            pest = "Low pest incidence detected. Continue regular scouting at field margins for aphids or bollworms."
        elif health == "Moderate":
            irrigation = "Schedule irrigation within the next 48 hours. Field shows early signs of moisture deficit."
            fertilizer = f"Top-dress with Urea @ 25 kg/acre + DAP @ 15 kg/acre. Foliar spray of NPK 19:19:19 recommended for {stage}."
            pest = "Inspect lower leaves for fungal leaf spots or rust symptoms. Keep Neem-based biopesticide on standby."
        else: # Poor
            irrigation = "Urgent: Deep irrigation required immediately to alleviate root zone dehydration."
            fertilizer = "Split application of Ammonium Sulphate (30 kg/acre) + Potassium (15 kg/acre) to revive stunted vegetative growth."
            pest = "High vulnerability alert: Scout for stem borer or root rot. Apply recommended fungicide / insecticide as per Krishi Vigyan Kendra protocol."

        return {
            "advisory_irrigation": irrigation,
            "advisory_fertilizer": fertilizer,
            "advisory_pest": pest
        }

advisory_service = AgronomyAdvisoryService()
