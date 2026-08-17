from typing import Dict, Any, List
import random

class LeafDoctorService:
    """
    Simulated Computer Vision & Deep Learning Leaf Disease Diagnostic Engine.
    Analyzes uploaded leaf photos or leaf symptom descriptions and identifies
    pathogens with confidence scores and immediate treatment instructions.
    """

    DISEASE_PROFILES = [
        {
            "diagnosis": "Early Stage Leaf Blight (Alternaria / Helminthosporium)",
            "confidence": 0.94,
            "severity": "Moderate",
            "visual_indicators": "Concentric dark brown circular spots with yellow halo rings along leaf margins.",
            "immediate_action": "Foliar spray of Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1 ml/L.",
            "organic_cure": "Spray Trichoderma viride bio-fungicide @ 5 g/L + 3% fermented sour buttermilk.",
            "urgency": "Treat within 48-72 hours to prevent secondary spread to upper canopy."
        },
        {
            "diagnosis": "Yellow Rust (Stripe Rust - Puccinia striiformis)",
            "confidence": 0.96,
            "severity": "High",
            "visual_indicators": "Linear yellow-orange pustules arranged in parallel stripes between leaf veins.",
            "immediate_action": "Spray Propiconazole 25% EC (Tilt) @ 1 ml/liter of water.",
            "organic_cure": "Apply 5% Neem Seed Kernel Extract (NSKE) + cow urine foliar spray.",
            "urgency": "Urgent — airborne spores can spread across the entire field rapidly."
        },
        {
            "diagnosis": "Nitrogen / Chlorophyll Deficiency (Chlorosis)",
            "confidence": 0.91,
            "severity": "Mild",
            "visual_indicators": "Uniform pale yellowing starting from tip of older lower leaves moving inward (V-shape).",
            "immediate_action": "Foliar spray of 2% Urea solution (20 g/liter) + Zinc Sulphate @ 5 g/L.",
            "organic_cure": "Apply enriched Vermicompost @ 200 kg/acre + Jeevamrutha soil drenching.",
            "urgency": "Correct within 5-7 days before tillering/panicle initiation."
        },
        {
            "diagnosis": "Healthy Canopy (No Active Pathogen Detected)",
            "confidence": 0.98,
            "severity": "None",
            "visual_indicators": "Lush emerald green pigmentation, strong turgidity, uniform cellular structure.",
            "immediate_action": "No chemical intervention needed. Continue standard scheduled irrigation.",
            "organic_cure": "Preventive spray of Panchagavya @ 3% every 15 days.",
            "urgency": "Monitor during morning field walks."
        }
    ]

    @classmethod
    def diagnose_leaf(cls, crop_name: str = "Wheat", filename: str = "leaf_sample.jpg") -> Dict[str, Any]:
        # Deterministic but realistic classification based on crop and sample
        seed = sum(ord(c) for c in (crop_name + filename)) % len(cls.DISEASE_PROFILES)
        result = cls.DISEASE_PROFILES[seed]

        return {
            "crop_name": crop_name,
            "image_analyzed": filename,
            "diagnosis": result["diagnosis"],
            "confidence_percentage": round(result["confidence"] * 100, 1),
            "severity_level": result["severity"],
            "visual_indicators": result["visual_indicators"],
            "immediate_action": result["immediate_action"],
            "organic_cure": result["organic_cure"],
            "urgency_timeline": result["urgency"],
            "status": "Diagnostic Completed Successfully"
        }

leaf_doctor_service = LeafDoctorService()
