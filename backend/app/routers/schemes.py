from fastapi import APIRouter
from ..services.schemes_service import schemes_service

router = APIRouter(prefix="/schemes", tags=["Government Krishi Schemes & Subsidies"])

@router.get("/list")
def get_krishi_schemes():
    """Returns central and state government agricultural schemes, subsidies, and eligibility."""
    return schemes_service.get_schemes()
