from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Field, Analysis
from ..schemas import DashboardStats
from .auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fields = db.query(Field).filter(Field.user_id == current_user.id).all()
    total_fields = len(fields)
    total_acreage = round(sum(f.area for f in fields), 2) if fields else 0.0

    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    total_analyses = len(analyses)
    
    healthy_count = sum(1 for a in analyses if a.crop_health == "Healthy")
    moderate_count = sum(1 for a in analyses if a.crop_health == "Moderate")
    poor_count = sum(1 for a in analyses if a.crop_health == "Poor")

    if total_analyses > 0:
        healthy_pct = round((healthy_count / total_analyses) * 100, 1)
        moderate_pct = round((moderate_count / total_analyses) * 100, 1)
        poor_pct = round((poor_count / total_analyses) * 100, 1)
    else:
        # Default baseline if new user
        healthy_pct = 65.0
        moderate_pct = 25.0
        poor_pct = 10.0

    recent_analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).limit(5).all()

    return {
        "total_fields": total_fields,
        "total_acreage": total_acreage,
        "healthy_percent": healthy_pct,
        "moderate_percent": moderate_pct,
        "poor_percent": poor_pct,
        "healthy_count": healthy_count,
        "moderate_count": moderate_count,
        "poor_count": poor_count,
        "recent_analyses": recent_analyses,
        "current_location": {
            "district": current_user.district or "Jabalpur",
            "state": current_user.state or "Madhya Pradesh",
            "latitude": 23.1815,
            "longitude": 79.9864
        },
        "weather": {
            "temp": 28.5,
            "condition": "Partly Sunny",
            "humidity": 62,
            "rain_probability": 15,
            "wind_speed": "12 km/h"
        }
    }
