from fastapi import APIRouter, Query
from ..services.pest_service import pest_service

router = APIRouter(prefix="/pest", tags=["Pest & Disease AI Diagnostics"])

@router.get("/diagnostics")
def get_crop_diagnostics(
    crop: str = Query("Wheat", description="Crop Name"),
    humidity: float = Query(62.0, description="Relative Humidity %"),
    temp: float = Query(28.5, description="Temperature °C")
):
    """Returns disease/pest threats, climate risk alerts, and biological + chemical remedies."""
    return pest_service.get_crop_diagnostics(crop, humidity, temp)
