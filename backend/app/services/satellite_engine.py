import math
import random
from typing import Dict, Any, List

class SatelliteEngine:
    """
    Simulates Sentinel-2 MSI / Google Earth Engine multispectral satellite data processing.
    Computes spectral indices:
    - NDVI (Normalized Difference Vegetation Index): (B8 - B4) / (B8 + B4)
    - NDRE (Normalized Difference Red Edge Index): (B8 - B5) / (B8 + B5)
    - EVI (Enhanced Vegetation Index): 2.5 * ((B8 - B4) / (B8 + 6*B4 - 7.5*B2 + 1))
    """

    @staticmethod
    def process_spectral_bands(lat: float, lng: float, crop_hint: str = None) -> Dict[str, Any]:
        # Seed deterministic pseudo-random variation based on coordinates
        coord_seed = int((abs(lat) * 1000 + abs(lng) * 100) % 10000)
        rng = random.Random(coord_seed)
        
        # Base simulated reflectance values (0.0 to 1.0)
        # Healthy green vegetation reflects strongly in NIR (B8) and absorbs Red (B4)
        base_health = rng.uniform(0.55, 0.88)
        
        b2_blue = round(rng.uniform(0.02, 0.06), 4)
        b3_green = round(rng.uniform(0.06, 0.12), 4)
        b4_red = round(rng.uniform(0.03, 0.09) * (1.2 - base_health * 0.4), 4)
        b5_red_edge = round(rng.uniform(0.18, 0.32), 4)
        b8_nir = round(rng.uniform(0.42, 0.78) * (0.6 + base_health * 0.5), 4)
        b11_swir = round(rng.uniform(0.12, 0.25), 4)
        
        # Calculate NDVI
        ndvi = (b8_nir - b4_red) / max((b8_nir + b4_red), 0.001)
        ndvi = round(min(max(ndvi, 0.15), 0.92), 2)
        
        # Calculate NDRE
        ndre = (b8_nir - b5_red_edge) / max((b8_nir + b5_red_edge), 0.001)
        ndre = round(min(max(ndre, 0.10), 0.75), 2)
        
        # Calculate EVI
        evi = 2.5 * ((b8_nir - b4_red) / max((b8_nir + 6.0 * b4_red - 7.5 * b2_blue + 1.0), 0.01))
        evi = round(min(max(evi, 0.12), 0.88), 2)
        
        # Cloud cover estimate
        cloud_cover_percent = round(rng.uniform(0.0, 4.5), 1)
        
        # Generate 5x5 simulated NDVI pixel matrix for spatial heatmap preview
        matrix_size = 5
        ndvi_matrix = []
        for r in range(matrix_size):
            row = []
            for c in range(matrix_size):
                # Add minor spatial micro-variability (+- 0.05)
                jitter = rng.uniform(-0.06, 0.06)
                pixel_val = round(min(max(ndvi + jitter, 0.1), 0.95), 2)
                row.append(pixel_val)
            ndvi_matrix.append(row)
            
        return {
            "satellite_mission": "Sentinel-2 MSI (Level-2A BOA)",
            "spatial_resolution": "10m per pixel",
            "cloud_cover_percent": cloud_cover_percent,
            "bands": {
                "B2_Blue": b2_blue,
                "B3_Green": b3_green,
                "B4_Red": b4_red,
                "B5_RedEdge": b5_red_edge,
                "B8_NIR": b8_nir,
                "B11_SWIR": b11_swir
            },
            "indices": {
                "ndvi": ndvi,
                "ndre": ndre,
                "evi": evi
            },
            "ndvi_matrix": ndvi_matrix
        }

satellite_engine = SatelliteEngine()
