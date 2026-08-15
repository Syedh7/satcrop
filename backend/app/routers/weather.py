from fastapi import APIRouter, Query
from ..services.weather_service import agro_weather_service

router = APIRouter(prefix="/weather", tags=["Agro-Meteorology & Soil"])

@router.get("/live")
def get_live_weather(
    lat: float = Query(23.1815, description="Latitude"),
    lng: float = Query(79.9864, description="Longitude")
):
    """Fetches real-time weather, soil moisture (0-7cm & 7-28cm), and 7-day precipitation forecast."""
    return agro_weather_service.get_live_weather(lat, lng)
