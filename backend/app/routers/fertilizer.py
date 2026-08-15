from fastapi import APIRouter, Query
from ..services.fertilizer_calc import fertilizer_calculator

router = APIRouter(prefix="/fertilizer", tags=["Precision Fertilizer Calculation"])

@router.get("/dosage")
def calculate_dosage(
    crop: str = Query("Wheat", description="Crop Name"),
    area: float = Query(2.45, description="Field Area in Acres"),
    stage: str = Query("Tillering Stage", description="Growth Stage")
):
    """Calculates tailored Urea, DAP, MOP, and Zinc dosages in total kg and bag counts."""
    return fertilizer_calculator.calculate_dosage(crop, area, stage)
