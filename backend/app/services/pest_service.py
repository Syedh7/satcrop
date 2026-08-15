from typing import Dict, Any, List

class PestDiseaseService:
    """
    AI Diagnostic Database for crop pests, diseases, fungal infections,
    and climate-triggered risk alerts.
    """

    DISEASE_CATALOG = {
        "Wheat": [
            {
                "id": "wheat_yellow_rust",
                "name": "Yellow Rust (Stripe Rust)",
                "type": "Fungal Infection (Puccinia striiformis)",
                "symptoms": "Yellowish-orange powder stripes on upper leaves, stunted tillering.",
                "weather_trigger": "High humidity (>70%) and cool temperatures (10-20°C).",
                "chemical_control": "Spray Propiconazole 25% EC (Tilt) @ 1 ml/liter of water.",
                "organic_remedy": "Foliar spray of 5% Neem Seed Kernel Extract (NSKE) + cow urine solution.",
                "prevention": "Use resistant varieties like HD-2967, PBW-550; avoid excessive nitrogen."
            },
            {
                "id": "wheat_aphids",
                "name": "Wheat Aphids (Mahuro)",
                "type": "Insect Pest",
                "symptoms": "Sucking sap from leaves and earheads, black sooty mold on honeydew.",
                "weather_trigger": "Dry and cloudy weather during earhead emergence.",
                "chemical_control": "Spray Thiamethoxam 25% WG @ 0.5 g/liter or Dimethoate 30% EC.",
                "organic_remedy": "Yellow sticky traps (15 traps/acre) + Neem oil spray (1500 ppm @ 3 ml/L).",
                "prevention": "Encourage natural ladybird beetles and lacewings in field margins."
            }
        ],
        "Soybean": [
            {
                "id": "soybean_girdle_beetle",
                "name": "Girdle Beetle (Obereopsis brevis)",
                "type": "Insect Pest",
                "symptoms": "Two parallel rings on petioles/stems; withered drooping leaves above the girdle.",
                "weather_trigger": "Continuous humid conditions in monsoon.",
                "chemical_control": "Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Triazophos 40% EC @ 1.5 ml/L.",
                "organic_remedy": "Collection and destruction of infested plant parts during early infestation.",
                "prevention": "Maintain optimal plant spacing; seed treatment with Thiamethoxam 30% FS."
            },
            {
                "id": "soybean_yellow_mosaic",
                "name": "Yellow Mosaic Virus (YMV)",
                "type": "Viral Disease (Transmitted by Whitefly)",
                "symptoms": "Bright yellow patches interspersed with green on leaves, stunted pods.",
                "weather_trigger": "Dry spells promoting high whitefly vector multiplication.",
                "chemical_control": "Control whitefly vector with Acetamiprid 20% SP @ 0.4 g/L.",
                "organic_remedy": "Yellow sticky cards + spray of 2% castor oil emulsion.",
                "prevention": "Use YMV-resistant cultivars (JS 95-60, NRC 37)."
            }
        ],
        "Rice (Paddy)": [
            {
                "id": "paddy_blast",
                "name": "Rice Blast (Pyricularia oryzae)",
                "type": "Fungal Disease",
                "symptoms": "Diamond/spindle-shaped lesions with grey centers and brown margins on leaves and neck.",
                "weather_trigger": "High relative humidity (>90%) with night dew and light drizzle.",
                "chemical_control": "Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC.",
                "organic_remedy": "Pseudomonas fluorescens biological foliar spray @ 2.5 kg/ha.",
                "prevention": "Avoid split heavy urea applications; maintain balanced potassium."
            }
        ],
        "Maize": [
            {
                "id": "maize_fall_armyworm",
                "name": "Fall Armyworm (Spodoptera frugiperda)",
                "type": "Lepidopteran Pest",
                "symptoms": "Pin-hole and ragged feeding holes in whorl leaves with sawdust-like frass.",
                "weather_trigger": "Warm tropical conditions during seedling and knee-high stage.",
                "chemical_control": "Spray Emamectin Benzoate 5% SG @ 0.4 g/L or Spinetoram 11.7% SC.",
                "organic_remedy": "Application of sand + lime powder (9:1) directly into whorls; release Trichogramma egg parasitoids.",
                "prevention": "Install pheromone traps @ 5 per acre for monitoring."
            }
        ],
        "Cotton": [
            {
                "id": "cotton_pink_bollworm",
                "name": "Pink Bollworm (Pectinophora gossypiella)",
                "type": "Lepidopteran Pest",
                "symptoms": "Rosetted flowers, stained lint, premature boll opening with hollow seeds.",
                "weather_trigger": "Warm and moderately humid post-flowering season.",
                "chemical_control": "Spray Chlorpyrifos 20% EC @ 2 ml/L or Profenofos 50% EC.",
                "organic_remedy": "Pheromone traps (Pectino-lure) @ 8 per acre + Trichogramma release.",
                "prevention": "Avoid ratoon cropping; timely harvest and shredding of crop residues."
            }
        ]
    }

    @classmethod
    def get_crop_diagnostics(cls, crop_name: str, humidity: float = 62.0, temp: float = 28.5) -> Dict[str, Any]:
        diseases = cls.DISEASE_CATALOG.get(crop_name, cls.DISEASE_CATALOG["Wheat"])
        
        # Determine climate risk levels
        high_humidity = humidity > 68.0
        
        risk_alerts = []
        for d in diseases:
            if "humidity" in d["weather_trigger"].lower() and high_humidity:
                risk_alerts.append({
                    "disease_name": d["name"],
                    "risk_level": "High Risk",
                    "reason": f"Current humidity ({humidity}%) exceeds threshold favorability."
                })
            else:
                risk_alerts.append({
                    "disease_name": d["name"],
                    "risk_level": "Moderate / Guarded",
                    "reason": "Scouting recommended."
                })

        return {
            "crop_name": crop_name,
            "total_threats_monitored": len(diseases),
            "threats": diseases,
            "climate_risk_alerts": risk_alerts
        }

pest_service = PestDiseaseService()
