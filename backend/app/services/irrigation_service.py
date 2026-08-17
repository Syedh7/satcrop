from typing import Dict, Any

class SmartIrrigationService:
    """
    Precision Irrigation Water Engine using FAO-56 Penman-Monteith methodology:
    ETc = ET0 * Kc
    Computes total liters, m³ volume, and electric/diesel pump operating duration.
    """

    CROP_KC_VALUES = {
        "Wheat": {"Initial": 0.40, "Tillering": 0.85, "Flowering": 1.15, "Maturity": 0.45},
        "Soybean": {"Initial": 0.35, "Vegetative": 0.75, "Pod Formation": 1.10, "Maturity": 0.50},
        "Rice (Paddy)": {"Initial": 1.05, "Tillering": 1.20, "Heading": 1.35, "Maturity": 0.90},
        "Maize": {"Initial": 0.40, "Vegetative": 0.80, "Tasseling": 1.20, "Maturity": 0.60},
        "Cotton": {"Initial": 0.45, "Squaring": 0.75, "Boll Development": 1.15, "Maturity": 0.65}
    }

    @classmethod
    def calculate_irrigation(
        cls,
        crop_name: str = "Wheat",
        field_area_acres: float = 2.45,
        growth_stage: str = "Tillering Stage",
        et0_mm_day: float = 4.3,
        soil_type: str = "Black Cotton / Clay Loam",
        pump_hp: float = 5.0
    ) -> Dict[str, Any]:
        
        # Get crop Kc coefficient
        crop_kc_map = cls.CROP_KC_VALUES.get(crop_name, cls.CROP_KC_VALUES["Wheat"])
        matched_kc = 0.85
        for stage_key, val in crop_kc_map.items():
            if stage_key.lower() in growth_stage.lower():
                matched_kc = val
                break

        # Daily Crop Evapotranspiration (mm/day)
        etc_mm_day = round(et0_mm_day * matched_kc, 2)

        # 1 mm of water over 1 Acre = 4,046.86 Liters (approx 4.05 m³)
        # Total daily water requirement
        daily_liters = round(etc_mm_day * 4046.86 * field_area_acres)
        daily_m3 = round(daily_liters / 1000.0, 1)

        # Scheduled irrigation for a 5-day cycle
        cycle_days = 5
        cycle_liters = daily_liters * cycle_days
        cycle_m3 = round(cycle_liters / 1000.0, 1)

        # Pump discharge capacity:
        # Standard 5 HP agricultural submersible pump delivers approx 45,000 Liters/hour (~45 m³/h)
        pump_discharge_liters_per_hour = pump_hp * 9000.0
        pump_running_hours_per_cycle = round(cycle_liters / max(pump_discharge_liters_per_hour, 1000), 1)

        # Power consumption estimate (1 HP ~ 0.746 kWh, 5 HP ~ 3.73 kWh per hour)
        kwh_per_cycle = round(pump_hp * 0.746 * pump_running_hours_per_cycle, 1)
        power_cost_inr = round(kwh_per_cycle * 4.5, 1) # ~₹4.5 per unit subsidy rate

        return {
            "crop_name": crop_name,
            "growth_stage": growth_stage,
            "field_area_acres": field_area_acres,
            "crop_coefficient_kc": matched_kc,
            "reference_et0_mm_day": et0_mm_day,
            "daily_crop_water_etc_mm": etc_mm_day,
            "daily_water_liters": daily_liters,
            "daily_water_m3": daily_m3,
            "recommended_cycle_days": cycle_days,
            "cycle_water_liters": cycle_liters,
            "cycle_water_m3": cycle_m3,
            "pump_specifications": {
                "pump_hp": pump_hp,
                "pump_discharge_rate_lph": round(pump_discharge_liters_per_hour),
                "required_pump_run_hours": pump_running_hours_per_cycle,
                "estimated_power_kwh": kwh_per_cycle,
                "estimated_cost_inr": power_cost_inr
            },
            "irrigation_method_advice": f"For {soil_type}, operate your {pump_hp} HP pump for {pump_running_hours_per_cycle} hours every {cycle_days} days to maintain optimal root zone moisture without waterlogging."
        }

irrigation_service = SmartIrrigationService()
