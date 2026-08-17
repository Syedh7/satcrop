from fastapi import APIRouter, Query
from ..services.irrigation_service import irrigation_service

router = APIRouter(prefix="/irrigation", tags=["Smart Irrigation Engine"])

@router.get("/calculate")
def calculate_irrigation(
    crop: str = Query("Wheat", description="Crop Name"),
    area: float = Query(2.45, description="Field Area in Acres"),
    stage: str = Query("Tillering Stage", description="Crop Growth Stage"),
    et0: float = Query(4.3, description="Reference Evapotranspiration ET0 mm/day"),
    soil: str = Query("Black Cotton / Clay Loam", description="Soil Type"),
    pump_hp: float = Query(5.0, description="Tube-well / Motor Pump Horsepower")
):
    """Calculates precision water requirements in Liters/m³ and pump run-time hours."""
    return irrigation_service.calculate_irrigation(crop, area, stage, et0, soil, pump_hp)
