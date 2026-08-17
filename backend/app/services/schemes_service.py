from typing import List, Dict, Any

class KrishiSchemesService:
    """
    Central Database and eligibility checker for Central and State Agricultural Schemes.
    """

    SCHEMES_LIST = [
        {
            "id": "pm_kisan",
            "name": "PM-KISAN Samman Nidhi",
            "category": "Direct Income Support",
            "benefit_amount": "₹6,000 / year (in 3 equal installments of ₹2,000)",
            "eligibility": "All landholding farmer families with cultivable landholding in their names.",
            "documents_needed": "Aadhaar Card, Land Ownership Papers (Khatauni/7/12), Bank Account linked with Aadhaar.",
            "official_portal": "https://pmkisan.gov.in",
            "status_check_available": True
        },
        {
            "id": "pmfby",
            "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            "category": "Crop Insurance & Disaster Relief",
            "benefit_amount": "Up to 100% sum insured against natural calamities, pests, and drought.",
            "eligibility": "All farmers growing notified crops in notified areas (Kharif premium 2%, Rabi premium 1.5%).",
            "documents_needed": "Sowing Certificate, Land Possession Document, Aadhaar Card, Bank Passbook.",
            "official_portal": "https://pmfby.gov.in",
            "status_check_available": True
        },
        {
            "id": "pmksy_drip",
            "name": "PM Krishi Sinchayee Yojana (Per Drop More Crop)",
            "category": "Micro-Irrigation Subsidy",
            "benefit_amount": "Up to 55% subsidy for Small/Marginal Farmers and 45% for other farmers on Drip/Sprinkler systems.",
            "eligibility": "Farmers with valid land ownership and assured water source.",
            "documents_needed": "Land Record (7/12, 8A), Aadhaar, Water Source Certificate, Soil/Water Test Report.",
            "official_portal": "https://pmksy.gov.in",
            "status_check_available": True
        },
        {
            "id": "smam_machinery",
            "name": "Sub-Mission on Agricultural Mechanization (SMAM)",
            "category": "Farm Machinery Subsidy",
            "benefit_amount": "40% to 50% subsidy on Tractors, Laser Levelers, Seed Drills, Harvesters, and Power Tillers.",
            "eligibility": "Individual farmers, Farmer Producer Organizations (FPOs), Custom Hiring Centers.",
            "documents_needed": "Aadhaar, Land Registration, Caste Certificate (if applicable), Bank Details.",
            "official_portal": "https://agrimachinery.nic.in",
            "status_check_available": True
        },
        {
            "id": "soil_health_card",
            "name": "Soil Health Card Scheme",
            "category": "Soil Testing & NPK Advisory",
            "benefit_amount": "Free laboratory testing for 12 soil parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC).",
            "eligibility": "All farmers nationwide every 2 years.",
            "documents_needed": "Aadhaar, Farm GPS location, Sample collection token.",
            "official_portal": "https://soilhealth.dac.gov.in",
            "status_check_available": True
        }
    ]

    @classmethod
    def get_schemes(cls) -> List[Dict[str, Any]]:
        return cls.SCHEMES_LIST

schemes_service = KrishiSchemesService()
