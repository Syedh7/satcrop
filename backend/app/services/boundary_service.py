import math
from typing import Dict, Any, Optional, List

# Approximate administrative polygon boundaries for Indian States
STATE_BOUNDARIES: Dict[str, List[List[float]]] = {
    "Madhya Pradesh": [
        [74.04, 21.08], [74.88, 22.02], [76.55, 21.30], [78.60, 21.60], [80.20, 21.50],
        [81.80, 23.20], [82.80, 24.10], [81.50, 25.20], [78.90, 25.70], [78.10, 26.80],
        [76.80, 26.00], [75.00, 24.80], [74.30, 23.10], [74.04, 21.08]
    ],
    "Maharashtra": [
        [72.60, 19.80], [73.50, 20.50], [75.20, 21.40], [78.50, 21.60], [80.30, 21.30],
        [80.90, 18.90], [78.50, 19.80], [77.50, 18.20], [75.80, 17.50], [73.80, 15.80],
        [73.30, 16.50], [72.80, 18.90], [72.60, 19.80]
    ],
    "Punjab": [
        [74.00, 30.10], [75.80, 29.80], [76.80, 30.50], [76.60, 31.30], [75.80, 32.30],
        [74.90, 32.10], [74.50, 31.20], [74.00, 30.10]
    ],
    "Haryana": [
        [74.50, 29.50], [76.00, 28.10], [77.30, 27.80], [77.40, 29.80], [76.80, 30.80],
        [75.20, 30.00], [74.50, 29.50]
    ],
    "Uttar Pradesh": [
        [77.10, 28.70], [78.50, 27.80], [79.90, 27.20], [81.50, 25.50], [83.30, 24.00],
        [83.90, 25.40], [84.40, 27.30], [82.10, 28.40], [80.10, 29.00], [77.50, 30.40],
        [77.10, 28.70]
    ],
    "Gujarat": [
        [68.50, 23.50], [70.50, 24.50], [73.20, 24.30], [74.30, 22.00], [72.90, 20.20],
        [72.50, 21.70], [70.10, 20.80], [68.90, 22.30], [68.50, 23.50]
    ],
    "Rajasthan": [
        [69.50, 27.00], [72.00, 29.80], [75.50, 28.80], [77.20, 27.50], [76.80, 24.20],
        [73.50, 24.50], [71.00, 25.50], [69.50, 27.00]
    ],
    "Karnataka": [
        [74.10, 14.80], [75.50, 17.50], [77.60, 18.40], [77.80, 14.00], [76.60, 11.60],
        [74.80, 12.80], [74.10, 14.80]
    ],
    "Andhra Pradesh": [
        [77.00, 14.00], [79.20, 13.50], [80.20, 15.80], [82.50, 17.00], [84.00, 18.80],
        [83.20, 18.20], [80.50, 16.50], [78.20, 15.00], [77.00, 14.00]
    ]
}

# Approximate district boundaries
DISTRICT_BOUNDARIES: Dict[str, Dict[str, Any]] = {
    "Jabalpur": {
        "state": "Madhya Pradesh",
        "center": [79.95, 23.18],
        "coords": [
            [79.60, 23.45], [80.25, 23.55], [80.40, 23.25], [80.15, 22.85],
            [79.65, 22.90], [79.45, 23.20], [79.60, 23.45]
        ]
    },
    "Indore": {
        "state": "Madhya Pradesh",
        "center": [75.85, 22.71],
        "coords": [
            [75.60, 22.90], [76.10, 22.95], [76.15, 22.50], [75.65, 22.45], [75.60, 22.90]
        ]
    },
    "Bhopal": {
        "state": "Madhya Pradesh",
        "center": [77.41, 23.25],
        "coords": [
            [77.15, 23.40], [77.65, 23.45], [77.60, 23.10], [77.20, 23.05], [77.15, 23.40]
        ]
    },
    "Pune": {
        "state": "Maharashtra",
        "center": [73.85, 18.52],
        "coords": [
            [73.30, 18.90], [74.50, 19.10], [74.90, 18.40], [74.30, 18.00],
            [73.50, 18.10], [73.30, 18.90]
        ]
    },
    "Nagpur": {
        "state": "Maharashtra",
        "center": [79.08, 21.14],
        "coords": [
            [78.60, 21.50], [79.40, 21.60], [79.60, 20.90], [78.70, 20.80], [78.60, 21.50]
        ]
    },
    "Ludhiana": {
        "state": "Punjab",
        "center": [75.85, 30.90],
        "coords": [
            [75.50, 31.10], [76.20, 31.15], [76.30, 30.70], [75.60, 30.65], [75.50, 31.10]
        ]
    },
    "Amritsar": {
        "state": "Punjab",
        "center": [74.87, 31.63],
        "coords": [
            [74.60, 31.85], [75.15, 31.80], [75.10, 31.40], [74.65, 31.45], [74.60, 31.85]
        ]
    },
    "Karnal": {
        "state": "Haryana",
        "center": [76.98, 29.68],
        "coords": [
            [76.70, 29.90], [77.20, 29.95], [77.25, 29.45], [76.75, 29.40], [76.70, 29.90]
        ]
    }
}

def generate_local_boundary(center_lng: float, center_lat: float, radius_km: float = 18.0, points: int = 12) -> List[List[float]]:
    """Generates a smooth polygon boundary around a central coordinate."""
    coords = []
    # 1 deg lat ~ 111 km, 1 deg lng ~ 111 * cos(lat) km
    lat_deg = radius_km / 111.0
    lng_deg = radius_km / (111.0 * math.cos(math.radians(center_lat)))
    
    for i in range(points):
        angle = (2 * math.pi * i) / points
        # Add slight pseudo-random natural variations
        variation = 0.85 + 0.3 * math.sin(i * 1.5)
        r_lat = lat_deg * variation
        r_lng = lng_deg * variation
        
        d_lat = r_lat * math.sin(angle)
        d_lng = r_lng * math.cos(angle)
        coords.append([round(center_lng + d_lng, 5), round(center_lat + d_lat, 5)])
        
    coords.append(coords[0]) # close polygon
    return coords

def get_state_geojson(state_name: str, fallback_lng: Optional[float] = None, fallback_lat: Optional[float] = None) -> Dict[str, Any]:
    """Returns GeoJSON Feature for a State Boundary."""
    coords = STATE_BOUNDARIES.get(state_name)
    if not coords and fallback_lng and fallback_lat:
        coords = generate_local_boundary(fallback_lng, fallback_lat, radius_km=140.0, points=16)
    elif not coords:
        coords = STATE_BOUNDARIES["Madhya Pradesh"]

    return {
        "type": "Feature",
        "properties": {
            "name": state_name,
            "type": "state",
            "fillColor": "#15803d",
            "strokeColor": "#16a34a",
            "strokeWeight": 3,
            "fillOpacity": 0.08
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [coords]
        }
    }

def get_district_geojson(district_name: str, state_name: str = "", center_lng: Optional[float] = None, center_lat: Optional[float] = None) -> Dict[str, Any]:
    """Returns GeoJSON Feature for a District Boundary."""
    district_info = DISTRICT_BOUNDARIES.get(district_name)
    if district_info:
        coords = district_info["coords"]
    elif center_lng and center_lat:
        coords = generate_local_boundary(center_lng, center_lat, radius_km=25.0, points=14)
    else:
        coords = DISTRICT_BOUNDARIES["Jabalpur"]["coords"]

    return {
        "type": "Feature",
        "properties": {
            "name": district_name,
            "state": state_name,
            "type": "district",
            "fillColor": "#22c55e",
            "strokeColor": "#15803d",
            "strokeWeight": 2,
            "fillOpacity": 0.15
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [coords]
        }
    }

def get_boundaries_for_location(district: str, state: str, lng: float, lat: float) -> Dict[str, Any]:
    """Returns combined District & State boundary GeoJSON."""
    return {
        "district_boundary": get_district_geojson(district, state, lng, lat),
        "state_boundary": get_state_geojson(state, lng, lat),
        "field_sample_boundary": {
            "type": "Feature",
            "properties": {"name": "Field Boundary", "type": "field"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [generate_local_boundary(lng, lat, radius_km=0.35, points=8)]
            }
        }
    }
