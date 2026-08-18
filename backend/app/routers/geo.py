from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query
import requests
from ..services.boundary_service import get_boundaries_for_location, get_district_geojson, get_state_geojson

router = APIRouter(prefix="/geo", tags=["Geographical Services & Boundaries"])

# ─── Expanded Indian Agricultural Locations (700+ districts covered via Nominatim + fallback) ───
INDIAN_LOCATIONS = [
    # Madhya Pradesh
    {"name": "Jabalpur, Madhya Pradesh", "district": "Jabalpur", "state": "Madhya Pradesh", "lat": 23.1815, "lng": 79.9864},
    {"name": "Indore, Madhya Pradesh", "district": "Indore", "state": "Madhya Pradesh", "lat": 22.7196, "lng": 75.8577},
    {"name": "Bhopal, Madhya Pradesh", "district": "Bhopal", "state": "Madhya Pradesh", "lat": 23.2599, "lng": 77.4126},
    {"name": "Gwalior, Madhya Pradesh", "district": "Gwalior", "state": "Madhya Pradesh", "lat": 26.2183, "lng": 78.1828},
    {"name": "Sagar, Madhya Pradesh", "district": "Sagar", "state": "Madhya Pradesh", "lat": 23.8388, "lng": 78.7378},
    {"name": "Rewa, Madhya Pradesh", "district": "Rewa", "state": "Madhya Pradesh", "lat": 24.5362, "lng": 81.2964},
    {"name": "Satna, Madhya Pradesh", "district": "Satna", "state": "Madhya Pradesh", "lat": 24.5694, "lng": 80.8314},
    {"name": "Ujjain, Madhya Pradesh", "district": "Ujjain", "state": "Madhya Pradesh", "lat": 23.1765, "lng": 75.7885},
    {"name": "Chhindwara, Madhya Pradesh", "district": "Chhindwara", "state": "Madhya Pradesh", "lat": 22.0574, "lng": 78.9382},
    {"name": "Hoshangabad, Madhya Pradesh", "district": "Hoshangabad", "state": "Madhya Pradesh", "lat": 22.7529, "lng": 77.7267},
    {"name": "Vidisha, Madhya Pradesh", "district": "Vidisha", "state": "Madhya Pradesh", "lat": 23.5251, "lng": 77.8082},
    {"name": "Raisen, Madhya Pradesh", "district": "Raisen", "state": "Madhya Pradesh", "lat": 23.3271, "lng": 77.7897},
    {"name": "Damoh, Madhya Pradesh", "district": "Damoh", "state": "Madhya Pradesh", "lat": 23.8330, "lng": 79.4419},
    {"name": "Narsinghpur, Madhya Pradesh", "district": "Narsinghpur", "state": "Madhya Pradesh", "lat": 22.9469, "lng": 79.1945},
    {"name": "Seoni, Madhya Pradesh", "district": "Seoni", "state": "Madhya Pradesh", "lat": 22.0869, "lng": 79.5447},
    {"name": "Balaghat, Madhya Pradesh", "district": "Balaghat", "state": "Madhya Pradesh", "lat": 21.8135, "lng": 80.1864},
    {"name": "Mandla, Madhya Pradesh", "district": "Mandla", "state": "Madhya Pradesh", "lat": 22.5991, "lng": 80.3817},
    {"name": "Katni, Madhya Pradesh", "district": "Katni", "state": "Madhya Pradesh", "lat": 23.8329, "lng": 80.3946},
    {"name": "Panna, Madhya Pradesh", "district": "Panna", "state": "Madhya Pradesh", "lat": 24.7180, "lng": 80.1859},
    {"name": "Chhatarpur, Madhya Pradesh", "district": "Chhatarpur", "state": "Madhya Pradesh", "lat": 24.9150, "lng": 79.5935},
    {"name": "Tikamgarh, Madhya Pradesh", "district": "Tikamgarh", "state": "Madhya Pradesh", "lat": 24.7444, "lng": 78.8304},
    {"name": "Sehore, Madhya Pradesh", "district": "Sehore", "state": "Madhya Pradesh", "lat": 23.2023, "lng": 77.0852},
    # Maharashtra
    {"name": "Pune, Maharashtra", "district": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567},
    {"name": "Nagpur, Maharashtra", "district": "Nagpur", "state": "Maharashtra", "lat": 21.1458, "lng": 79.0882},
    {"name": "Nashik, Maharashtra", "district": "Nashik", "state": "Maharashtra", "lat": 19.9975, "lng": 73.7898},
    {"name": "Aurangabad, Maharashtra", "district": "Aurangabad", "state": "Maharashtra", "lat": 19.8762, "lng": 75.3433},
    {"name": "Solapur, Maharashtra", "district": "Solapur", "state": "Maharashtra", "lat": 17.6805, "lng": 75.9064},
    {"name": "Kolhapur, Maharashtra", "district": "Kolhapur", "state": "Maharashtra", "lat": 16.7050, "lng": 74.2433},
    {"name": "Amravati, Maharashtra", "district": "Amravati", "state": "Maharashtra", "lat": 20.9320, "lng": 77.7523},
    {"name": "Latur, Maharashtra", "district": "Latur", "state": "Maharashtra", "lat": 18.4088, "lng": 76.5604},
    {"name": "Nanded, Maharashtra", "district": "Nanded", "state": "Maharashtra", "lat": 19.1383, "lng": 77.3210},
    {"name": "Sangli, Maharashtra", "district": "Sangli", "state": "Maharashtra", "lat": 16.8524, "lng": 74.5815},
    {"name": "Satara, Maharashtra", "district": "Satara", "state": "Maharashtra", "lat": 17.6805, "lng": 74.0183},
    {"name": "Yavatmal, Maharashtra", "district": "Yavatmal", "state": "Maharashtra", "lat": 20.3888, "lng": 78.1204},
    {"name": "Wardha, Maharashtra", "district": "Wardha", "state": "Maharashtra", "lat": 20.7453, "lng": 78.6022},
    # Punjab
    {"name": "Ludhiana, Punjab", "district": "Ludhiana", "state": "Punjab", "lat": 30.9010, "lng": 75.8573},
    {"name": "Amritsar, Punjab", "district": "Amritsar", "state": "Punjab", "lat": 31.6340, "lng": 74.8723},
    {"name": "Jalandhar, Punjab", "district": "Jalandhar", "state": "Punjab", "lat": 31.3260, "lng": 75.5762},
    {"name": "Patiala, Punjab", "district": "Patiala", "state": "Punjab", "lat": 30.3398, "lng": 76.3869},
    {"name": "Bathinda, Punjab", "district": "Bathinda", "state": "Punjab", "lat": 30.2110, "lng": 74.9455},
    {"name": "Moga, Punjab", "district": "Moga", "state": "Punjab", "lat": 30.8186, "lng": 75.1734},
    {"name": "Gurdaspur, Punjab", "district": "Gurdaspur", "state": "Punjab", "lat": 32.0378, "lng": 75.4056},
    {"name": "Firozpur, Punjab", "district": "Firozpur", "state": "Punjab", "lat": 30.9336, "lng": 74.6138},
    {"name": "Kapurthala, Punjab", "district": "Kapurthala", "state": "Punjab", "lat": 31.3813, "lng": 75.3807},
    {"name": "Hoshiarpur, Punjab", "district": "Hoshiarpur", "state": "Punjab", "lat": 31.5343, "lng": 75.9115},
    # Haryana
    {"name": "Karnal, Haryana", "district": "Karnal", "state": "Haryana", "lat": 29.6857, "lng": 76.9905},
    {"name": "Hisar, Haryana", "district": "Hisar", "state": "Haryana", "lat": 29.1492, "lng": 75.7217},
    {"name": "Rohtak, Haryana", "district": "Rohtak", "state": "Haryana", "lat": 28.8955, "lng": 76.6066},
    {"name": "Ambala, Haryana", "district": "Ambala", "state": "Haryana", "lat": 30.3782, "lng": 76.7767},
    {"name": "Kurukshetra, Haryana", "district": "Kurukshetra", "state": "Haryana", "lat": 29.9695, "lng": 76.8783},
    {"name": "Panipat, Haryana", "district": "Panipat", "state": "Haryana", "lat": 29.3909, "lng": 76.9635},
    {"name": "Sirsa, Haryana", "district": "Sirsa", "state": "Haryana", "lat": 29.5327, "lng": 75.0302},
    {"name": "Sonipat, Haryana", "district": "Sonipat", "state": "Haryana", "lat": 28.9931, "lng": 77.0151},
    {"name": "Jhajjar, Haryana", "district": "Jhajjar", "state": "Haryana", "lat": 28.6067, "lng": 76.6567},
    {"name": "Fatehabad, Haryana", "district": "Fatehabad", "state": "Haryana", "lat": 29.5141, "lng": 75.4546},
    # Uttar Pradesh
    {"name": "Lucknow, Uttar Pradesh", "district": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462},
    {"name": "Agra, Uttar Pradesh", "district": "Agra", "state": "Uttar Pradesh", "lat": 27.1767, "lng": 78.0081},
    {"name": "Varanasi, Uttar Pradesh", "district": "Varanasi", "state": "Uttar Pradesh", "lat": 25.3176, "lng": 82.9739},
    {"name": "Meerut, Uttar Pradesh", "district": "Meerut", "state": "Uttar Pradesh", "lat": 28.9845, "lng": 77.7064},
    {"name": "Kanpur, Uttar Pradesh", "district": "Kanpur", "state": "Uttar Pradesh", "lat": 26.4499, "lng": 80.3319},
    {"name": "Allahabad, Uttar Pradesh", "district": "Allahabad", "state": "Uttar Pradesh", "lat": 25.4358, "lng": 81.8463},
    {"name": "Bareilly, Uttar Pradesh", "district": "Bareilly", "state": "Uttar Pradesh", "lat": 28.3670, "lng": 79.4304},
    {"name": "Gorakhpur, Uttar Pradesh", "district": "Gorakhpur", "state": "Uttar Pradesh", "lat": 26.7606, "lng": 83.3732},
    {"name": "Moradabad, Uttar Pradesh", "district": "Moradabad", "state": "Uttar Pradesh", "lat": 28.8386, "lng": 78.7733},
    {"name": "Mathura, Uttar Pradesh", "district": "Mathura", "state": "Uttar Pradesh", "lat": 27.4924, "lng": 77.6737},
    {"name": "Muzaffarnagar, Uttar Pradesh", "district": "Muzaffarnagar", "state": "Uttar Pradesh", "lat": 29.4727, "lng": 77.7085},
    {"name": "Saharanpur, Uttar Pradesh", "district": "Saharanpur", "state": "Uttar Pradesh", "lat": 29.9640, "lng": 77.5460},
    {"name": "Aligarh, Uttar Pradesh", "district": "Aligarh", "state": "Uttar Pradesh", "lat": 27.8974, "lng": 78.0880},
    {"name": "Bulandshahr, Uttar Pradesh", "district": "Bulandshahr", "state": "Uttar Pradesh", "lat": 28.4069, "lng": 77.8498},
    {"name": "Etawah, Uttar Pradesh", "district": "Etawah", "state": "Uttar Pradesh", "lat": 26.7804, "lng": 79.0225},
    # Gujarat
    {"name": "Ahmedabad, Gujarat", "district": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714},
    {"name": "Surat, Gujarat", "district": "Surat", "state": "Gujarat", "lat": 21.1702, "lng": 72.8311},
    {"name": "Vadodara, Gujarat", "district": "Vadodara", "state": "Gujarat", "lat": 22.3072, "lng": 73.1812},
    {"name": "Rajkot, Gujarat", "district": "Rajkot", "state": "Gujarat", "lat": 22.3039, "lng": 70.8022},
    {"name": "Bhavnagar, Gujarat", "district": "Bhavnagar", "state": "Gujarat", "lat": 21.7645, "lng": 72.1519},
    {"name": "Anand, Gujarat", "district": "Anand", "state": "Gujarat", "lat": 22.5645, "lng": 72.9289},
    {"name": "Mehsana, Gujarat", "district": "Mehsana", "state": "Gujarat", "lat": 23.5880, "lng": 72.3693},
    {"name": "Gandhinagar, Gujarat", "district": "Gandhinagar", "state": "Gujarat", "lat": 23.2156, "lng": 72.6369},
    {"name": "Junagadh, Gujarat", "district": "Junagadh", "state": "Gujarat", "lat": 21.5222, "lng": 70.4579},
    {"name": "Banaskantha, Gujarat", "district": "Banaskantha", "state": "Gujarat", "lat": 24.1749, "lng": 72.4375},
    {"name": "Kheda, Gujarat", "district": "Kheda", "state": "Gujarat", "lat": 22.7478, "lng": 72.6831},
    # Rajasthan
    {"name": "Jaipur, Rajasthan", "district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873},
    {"name": "Jodhpur, Rajasthan", "district": "Jodhpur", "state": "Rajasthan", "lat": 26.2389, "lng": 73.0243},
    {"name": "Kota, Rajasthan", "district": "Kota", "state": "Rajasthan", "lat": 25.2138, "lng": 75.8648},
    {"name": "Bikaner, Rajasthan", "district": "Bikaner", "state": "Rajasthan", "lat": 28.0229, "lng": 73.3119},
    {"name": "Ajmer, Rajasthan", "district": "Ajmer", "state": "Rajasthan", "lat": 26.4499, "lng": 74.6399},
    {"name": "Alwar, Rajasthan", "district": "Alwar", "state": "Rajasthan", "lat": 27.5530, "lng": 76.6346},
    {"name": "Bhilwara, Rajasthan", "district": "Bhilwara", "state": "Rajasthan", "lat": 25.3458, "lng": 74.6314},
    {"name": "Sikar, Rajasthan", "district": "Sikar", "state": "Rajasthan", "lat": 27.6094, "lng": 75.1399},
    {"name": "Barmer, Rajasthan", "district": "Barmer", "state": "Rajasthan", "lat": 25.7463, "lng": 71.3928},
    {"name": "Nagaur, Rajasthan", "district": "Nagaur", "state": "Rajasthan", "lat": 27.2027, "lng": 73.7352},
    {"name": "Chittorgarh, Rajasthan", "district": "Chittorgarh", "state": "Rajasthan", "lat": 24.8887, "lng": 74.6269},
    {"name": "Ganganagar, Rajasthan", "district": "Ganganagar", "state": "Rajasthan", "lat": 29.9038, "lng": 73.8772},
    # Karnataka
    {"name": "Bellary, Karnataka", "district": "Bellary", "state": "Karnataka", "lat": 15.1394, "lng": 76.9214},
    {"name": "Bangalore Rural, Karnataka", "district": "Bangalore Rural", "state": "Karnataka", "lat": 13.0827, "lng": 77.5877},
    {"name": "Mysore, Karnataka", "district": "Mysore", "state": "Karnataka", "lat": 12.2958, "lng": 76.6394},
    {"name": "Hubli, Karnataka", "district": "Dharwad", "state": "Karnataka", "lat": 15.3647, "lng": 75.1240},
    {"name": "Tumkur, Karnataka", "district": "Tumkur", "state": "Karnataka", "lat": 13.3409, "lng": 77.1010},
    {"name": "Raichur, Karnataka", "district": "Raichur", "state": "Karnataka", "lat": 16.2076, "lng": 77.3463},
    {"name": "Bidar, Karnataka", "district": "Bidar", "state": "Karnataka", "lat": 17.9135, "lng": 77.5199},
    {"name": "Gulbarga, Karnataka", "district": "Gulbarga", "state": "Karnataka", "lat": 17.3297, "lng": 76.8202},
    {"name": "Gadag, Karnataka", "district": "Gadag", "state": "Karnataka", "lat": 15.4167, "lng": 75.6167},
    {"name": "Bijapur, Karnataka", "district": "Bijapur", "state": "Karnataka", "lat": 16.8302, "lng": 75.7100},
    # Andhra Pradesh
    {"name": "Guntur, Andhra Pradesh", "district": "Guntur", "state": "Andhra Pradesh", "lat": 16.3067, "lng": 80.4365},
    {"name": "Kurnool, Andhra Pradesh", "district": "Kurnool", "state": "Andhra Pradesh", "lat": 15.8281, "lng": 78.0373},
    {"name": "Vijayawada, Andhra Pradesh", "district": "Krishna", "state": "Andhra Pradesh", "lat": 16.5062, "lng": 80.6480},
    {"name": "Visakhapatnam, Andhra Pradesh", "district": "Visakhapatnam", "state": "Andhra Pradesh", "lat": 17.6868, "lng": 83.2185},
    {"name": "Nellore, Andhra Pradesh", "district": "Nellore", "state": "Andhra Pradesh", "lat": 14.4426, "lng": 79.9865},
    {"name": "Kadapa, Andhra Pradesh", "district": "Kadapa", "state": "Andhra Pradesh", "lat": 14.4753, "lng": 78.8242},
    {"name": "Anantapur, Andhra Pradesh", "district": "Anantapur", "state": "Andhra Pradesh", "lat": 14.6819, "lng": 77.6006},
    {"name": "Chittoor, Andhra Pradesh", "district": "Chittoor", "state": "Andhra Pradesh", "lat": 13.2172, "lng": 79.0999},
    {"name": "East Godavari, Andhra Pradesh", "district": "East Godavari", "state": "Andhra Pradesh", "lat": 17.3050, "lng": 81.7793},
    {"name": "West Godavari, Andhra Pradesh", "district": "West Godavari", "state": "Andhra Pradesh", "lat": 16.9174, "lng": 81.3347},
    # Telangana
    {"name": "Hyderabad, Telangana", "district": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867},
    {"name": "Warangal, Telangana", "district": "Warangal", "state": "Telangana", "lat": 17.9784, "lng": 79.5941},
    {"name": "Nizamabad, Telangana", "district": "Nizamabad", "state": "Telangana", "lat": 18.6725, "lng": 78.0941},
    {"name": "Karimnagar, Telangana", "district": "Karimnagar", "state": "Telangana", "lat": 18.4386, "lng": 79.1288},
    {"name": "Khammam, Telangana", "district": "Khammam", "state": "Telangana", "lat": 17.2473, "lng": 80.1514},
    {"name": "Adilabad, Telangana", "district": "Adilabad", "state": "Telangana", "lat": 19.6640, "lng": 78.5320},
    {"name": "Nalgonda, Telangana", "district": "Nalgonda", "state": "Telangana", "lat": 17.0575, "lng": 79.2674},
    {"name": "Mahbubnagar, Telangana", "district": "Mahbubnagar", "state": "Telangana", "lat": 16.7488, "lng": 78.0022},
    # West Bengal
    {"name": "Murshidabad, West Bengal", "district": "Murshidabad", "state": "West Bengal", "lat": 24.1797, "lng": 88.2701},
    {"name": "Bardhaman, West Bengal", "district": "Bardhaman", "state": "West Bengal", "lat": 23.2324, "lng": 87.8615},
    {"name": "Hooghly, West Bengal", "district": "Hooghly", "state": "West Bengal", "lat": 22.9016, "lng": 88.3926},
    {"name": "Bankura, West Bengal", "district": "Bankura", "state": "West Bengal", "lat": 23.2324, "lng": 87.0763},
    {"name": "Nadia, West Bengal", "district": "Nadia", "state": "West Bengal", "lat": 23.4700, "lng": 88.5600},
    {"name": "Birbhum, West Bengal", "district": "Birbhum", "state": "West Bengal", "lat": 23.8915, "lng": 87.5308},
    {"name": "Medinipur, West Bengal", "district": "Medinipur", "state": "West Bengal", "lat": 22.4210, "lng": 87.3189},
    # Bihar
    {"name": "Patna, Bihar", "district": "Patna", "state": "Bihar", "lat": 25.5941, "lng": 85.1376},
    {"name": "Muzaffarpur, Bihar", "district": "Muzaffarpur", "state": "Bihar", "lat": 26.1197, "lng": 85.3910},
    {"name": "Gaya, Bihar", "district": "Gaya", "state": "Bihar", "lat": 24.7914, "lng": 85.0002},
    {"name": "Bhagalpur, Bihar", "district": "Bhagalpur", "state": "Bihar", "lat": 25.2425, "lng": 86.9842},
    {"name": "Darbhanga, Bihar", "district": "Darbhanga", "state": "Bihar", "lat": 26.1542, "lng": 85.8918},
    {"name": "Samastipur, Bihar", "district": "Samastipur", "state": "Bihar", "lat": 25.8631, "lng": 85.7798},
    {"name": "Nalanda, Bihar", "district": "Nalanda", "state": "Bihar", "lat": 25.1377, "lng": 85.4437},
    {"name": "Begusarai, Bihar", "district": "Begusarai", "state": "Bihar", "lat": 25.4182, "lng": 86.1272},
    # Chhattisgarh
    {"name": "Raipur, Chhattisgarh", "district": "Raipur", "state": "Chhattisgarh", "lat": 21.2514, "lng": 81.6296},
    {"name": "Bilaspur, Chhattisgarh", "district": "Bilaspur", "state": "Chhattisgarh", "lat": 22.0796, "lng": 82.1391},
    {"name": "Durg, Chhattisgarh", "district": "Durg", "state": "Chhattisgarh", "lat": 21.1904, "lng": 81.2849},
    {"name": "Raigarh, Chhattisgarh", "district": "Raigarh", "state": "Chhattisgarh", "lat": 21.8974, "lng": 83.3950},
    {"name": "Rajnandgaon, Chhattisgarh", "district": "Rajnandgaon", "state": "Chhattisgarh", "lat": 21.0971, "lng": 81.0312},
    {"name": "Korba, Chhattisgarh", "district": "Korba", "state": "Chhattisgarh", "lat": 22.3595, "lng": 82.7501},
    # Odisha
    {"name": "Bhubaneswar, Odisha", "district": "Khordha", "state": "Odisha", "lat": 20.2961, "lng": 85.8245},
    {"name": "Cuttack, Odisha", "district": "Cuttack", "state": "Odisha", "lat": 20.4625, "lng": 85.8830},
    {"name": "Sambalpur, Odisha", "district": "Sambalpur", "state": "Odisha", "lat": 21.4669, "lng": 83.9756},
    {"name": "Balasore, Odisha", "district": "Balasore", "state": "Odisha", "lat": 21.4942, "lng": 86.9318},
    {"name": "Puri, Odisha", "district": "Puri", "state": "Odisha", "lat": 19.8135, "lng": 85.8312},
    {"name": "Bargarh, Odisha", "district": "Bargarh", "state": "Odisha", "lat": 21.3358, "lng": 83.6192},
]

# ─── Nominatim Reverse Geocode (OSM) — real location from coords ─────────────

def _nominatim_reverse(lat: float, lng: float) -> Optional[Dict[str, str]]:
    """Calls OpenStreetMap Nominatim to reverse-geocode any coordinate."""
    try:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={"lat": lat, "lon": lng, "format": "json", "zoom": 10, "addressdetails": 1},
            headers={"User-Agent": "SATCROP/2.0 (satcrop-agri-app)"},
            timeout=5
        )
        if resp.status_code == 200:
            data = resp.json()
            addr = data.get("address", {})
            district = (
                addr.get("county") or addr.get("district") or
                addr.get("state_district") or addr.get("city") or
                addr.get("town") or addr.get("village") or "Unknown"
            )
            state = addr.get("state", "India")
            return {"district": district, "state": state}
    except Exception:
        pass
    return None


def _nominatim_search(query: str) -> List[Dict]:
    """Calls OpenStreetMap Nominatim to search for a location by name."""
    try:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": f"{query}, India",
                "format": "json",
                "limit": 6,
                "addressdetails": 1,
                "countrycodes": "in"
            },
            headers={"User-Agent": "SATCROP/2.0 (satcrop-agri-app)"},
            timeout=5
        )
        if resp.status_code == 200:
            results = []
            for item in resp.json():
                addr = item.get("address", {})
                district = (
                    addr.get("county") or addr.get("district") or
                    addr.get("state_district") or addr.get("city") or
                    addr.get("town") or addr.get("village") or query.title()
                )
                state = addr.get("state", "India")
                results.append({
                    "name": f"{district}, {state}",
                    "district": district,
                    "state": state,
                    "lat": float(item["lat"]),
                    "lng": float(item["lon"])
                })
            return results
    except Exception:
        pass
    return []


def _fallback_nearest(lat: float, lng: float) -> Dict[str, str]:
    """Finds the nearest city from the expanded 150+ location table."""
    nearest = min(
        INDIAN_LOCATIONS,
        key=lambda loc: (loc["lat"] - lat) ** 2 + (loc["lng"] - lng) ** 2
    )
    return {"district": nearest["district"], "state": nearest["state"]}


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/search")
def search_locations(q: str = Query(..., min_length=1)):
    """Searches agricultural locations in India — real Nominatim first, fallback to local DB."""
    q_lower = q.lower().strip()

    # 1. Try Nominatim (live OSM search)
    nominatim_results = _nominatim_search(q)
    if nominatim_results:
        return nominatim_results

    # 2. Fallback: search expanded local table
    matches = [
        loc for loc in INDIAN_LOCATIONS
        if q_lower in loc["name"].lower() or
           q_lower in loc["district"].lower() or
           q_lower in loc["state"].lower()
    ]
    if matches:
        return matches

    # 3. Last resort: return best-guess with coords from nearest match
    return [{
        "name": f"{q.title()}, India",
        "district": q.title(),
        "state": "India",
        "lat": 22.9734,
        "lng": 78.6569  # geographic center of India
    }]


@router.get("/reverse")
def reverse_geocode(lat: float = Query(...), lng: float = Query(...)):
    """Reverse-geocodes any coordinate to District/State — real Nominatim first, local fallback."""

    # 1. Try live Nominatim reverse geocoding
    nominatim = _nominatim_reverse(lat, lng)
    if nominatim:
        district = nominatim["district"]
        state = nominatim["state"]
    else:
        # 2. Fallback: nearest city from expanded local table
        fallback = _fallback_nearest(lat, lng)
        district = fallback["district"]
        state = fallback["state"]

    return {
        "latitude": lat,
        "longitude": lng,
        "district": district,
        "state": state,
        "formatted_address": f"{district}, {state}, India"
    }


@router.get("/boundaries")
def get_boundaries(
    district: str = Query(..., description="District Name"),
    state: str = Query(..., description="State Name"),
    lat: float = Query(23.1815),
    lng: float = Query(79.9864)
):
    """Returns State and District boundary GeoJSON objects for map overlay."""
    return get_boundaries_for_location(district, state, lng, lat)
