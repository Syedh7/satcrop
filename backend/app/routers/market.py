from fastapi import APIRouter, Query
from ..services.mandi_service import mandi_service

router = APIRouter(prefix="/market", tags=["APMC Mandi & Commodity Prices"])

@router.get("/mandi-rates")
def get_mandi_rates(
    crop: str = Query("Wheat", description="Crop Name"),
    yield_q: float = Query(32.5, description="Estimated Harvest in Quintals"),
    district: str = Query("Jabalpur", description="District")
):
    """Returns live APMC modal price, MSP, price range, and projected gross farm revenue."""
    return mandi_service.get_market_data(crop, yield_q, district)
