from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query
import requests
from ..services.boundary_service import get_boundaries_for_location, get_district_geojson, get_state_geojson, DISTRICT_BOUNDARIES, STATE_BOUNDARIES

router = APIRouter(prefix="/geo", tags=["Geographical Services & Boundaries"])

INDIAN_LOCATIONS = [
    {"name": "Jabalpur, Madhya Pradesh", "district": "Jabalpur", "state": "Madhya Pradesh", "lat": 23.1815, "lng": 79.9864},
    {"name": "Indore, Madhya Pradesh", "district": "Indore", "state": "Madhya Pradesh", "lat": 22.7196, "lng": 75.8577},
    {"name": "Bhopal, Madhya Pradesh", "district": "Bhopal", "state": "Madhya Pradesh", "lat": 23.2599, "lng": 77.4126},
    {"name": "Pune, Maharashtra", "district": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567},
    {"name": "Nagpur, Maharashtra", "district": "Nagpur", "state": "Maharashtra", "lat": 21.1458, "lng": 79.0882},
    {"name": "Ludhiana, Punjab", "district": "Ludhiana", "state": "Punjab", "lat": 30.9010, "lng": 75.8573},
    {"name": "Amritsar, Punjab", "district": "Amritsar", "state": "Punjab", "lat": 31.6340, "lng": 74.8723},
    {"name": "Karnal, Haryana", "district": "Karnal", "state": "Haryana", "lat": 29.6857, "lng": 76.9905},
    {"name": "Ahmedabad, Gujarat", "district": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714},
    {"name": "Jaipur, Rajasthan", "district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873},
    {"name": "Guntur, Andhra Pradesh", "district": "Guntur", "state": "Andhra Pradesh", "lat": 16.3067, "lng": 80.4365},
    {"name": "Bellary, Karnataka", "district": "Bellary", "state": "Karnataka", "lat": 15.1394, "lng": 76.9214}
]

@router.get("/search")
def search_locations(q: str = Query(..., min_length=1)):
    """Searches agricultural locations and districts in India."""
    q_lower = q.lower().strip()
    matches = [
        loc for loc in INDIAN_LOCATIONS
        if q_lower in loc["name"].lower() or q_lower in loc["district"].lower() or q_lower in loc["state"].lower()
    ]
    
    # If no local match, return synthesized result with reasonable coordinates
    if not matches:
        matches = [{
            "name": f"{q.title()}, India",
            "district": q.title(),
            "state": "Madhya Pradesh",
            "lat": 23.1815,
            "lng": 79.9864
        }]
    return matches

@router.get("/reverse")
def reverse_geocode(lat: float = Query(...), lng: float = Query(...)):
    """Reverse geocodes coordinates to District and State with fallback."""
    # Find nearest known location
    nearest = min(
        INDIAN_LOCATIONS,
        key=lambda loc: (loc["lat"] - lat)**2 + (loc["lng"] - lng)**2
    )
    return {
        "latitude": lat,
        "longitude": lng,
        "district": nearest["district"],
        "state": nearest["state"],
        "formatted_address": f"{nearest['district']}, {nearest['state']}, India"
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
