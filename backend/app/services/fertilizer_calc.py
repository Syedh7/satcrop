from typing import Dict, Any

class FertilizerCalculator:
    """
    Calculates precision NPK (Nitrogen, Phosphorus, Potassium) and secondary nutrient
    dosages in kg for any crop and field acreage.
    """

    RECOMMENDED_NPK_KG_PER_ACRE = {
        "Wheat": {"N": 50, "P": 24, "K": 16, "Zinc": 5},
        "Soybean": {"N": 12, "P": 32, "K": 16, "Sulphur": 8},
        "Rice (Paddy)": {"N": 48, "P": 24, "K": 20, "Zinc": 10},
        "Maize": {"N": 60, "P": 30, "K": 20, "Zinc": 6},
        "Cotton": {"N": 45, "P": 22, "K": 22, "Magnesium": 5},
        "Gram (Chickpea)": {"N": 10, "P": 20, "K": 10, "Sulphur": 6},
        "Mustard": {"N": 35, "P": 20, "K": 15, "Sulphur": 10}
    }

    @classmethod
    def calculate_dosage(cls, crop_name: str, area_acres: float, growth_stage: str = "Tillering Stage") -> Dict[str, Any]:
        npk = cls.RECOMMENDED_NPK_KG_PER_ACRE.get(crop_name, cls.RECOMMENDED_NPK_KG_PER_ACRE["Wheat"])
        
        # DAP contains 18% N and 46% P2O5
        # Urea contains 46% N
        # MOP (Muriate of Potash) contains 60% K2O
        
        dap_kg_per_acre = round((npk["P"] / 0.46), 1)
        nitrogen_from_dap = dap_kg_per_acre * 0.18
        remaining_nitrogen = max(0, npk["N"] - nitrogen_from_dap)
        urea_kg_per_acre = round((remaining_nitrogen / 0.46), 1)
        mop_kg_per_acre = round((npk["K"] / 0.60), 1)

        total_dap_kg = round(dap_kg_per_acre * area_acres, 1)
        total_urea_kg = round(urea_kg_per_acre * area_acres, 1)
        total_mop_kg = round(mop_kg_per_acre * area_acres, 1)

        # 50kg bag equivalents
        dap_bags_50kg = round(total_dap_kg / 50.0, 1)
        urea_bags_45kg = round(total_urea_kg / 45.0, 1)
        mop_bags_50kg = round(total_mop_kg / 50.0, 1)

        # Stage specific splitting advice
        if "tiller" in growth_stage.lower() or "vegetative" in growth_stage.lower():
            stage_action = f"Apply 1st top-dressing of Urea ({round(total_urea_kg * 0.5, 1)} kg) after first weeding/irrigation."
        elif "flower" in growth_stage.lower() or "heading" in growth_stage.lower():
            stage_action = f"Apply 2nd top-dressing of Urea ({round(total_urea_kg * 0.3, 1)} kg) + foliar 13:0:45 (Potassium Nitrate) @ 1.5 kg/acre."
        else:
            stage_action = "Basal application of full DAP + MOP + 1/3rd Urea at sowing time."

        return {
            "crop_name": crop_name,
            "field_area_acres": area_acres,
            "growth_stage": growth_stage,
            "fertilizer_plan": {
                "dap": {
                    "name": "DAP (Diammonium Phosphate 18:46:0)",
                    "total_kg": total_dap_kg,
                    "bags_50kg": dap_bags_50kg,
                    "timing": "100% Basal at sowing"
                },
                "urea": {
                    "name": "Neem Coated Urea (46% N)",
                    "total_kg": total_urea_kg,
                    "bags_45kg": urea_bags_45kg,
                    "timing": "Split into 3 equal doses (Basal, Tillering, Flowering)"
                },
                "mop": {
                    "name": "MOP (Muriate of Potash 60% K2O)",
                    "total_kg": total_mop_kg,
                    "bags_50kg": mop_bags_50kg,
                    "timing": "100% Basal dose at sowing"
                }
            },
            "micronutrient_advice": f"Apply Zinc Sulphate 21% @ {round(5 * area_acres, 1)} kg to enhance chlorophyll density and satellite NDVI reflection.",
            "stage_specific_action": stage_action
        }

fertilizer_calculator = FertilizerCalculator()
