from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Analysis, User, Field
from ..schemas import AnalyzeRequest, AnalysisSaveRequest, AnalysisOut
from ..services.satellite_engine import satellite_engine
from ..services.ai_classifier import ai_classifier
from ..services.growth_stage_service import growth_stage_service
from ..services.advisory_service import advisory_service
from .auth import get_current_user

router = APIRouter(prefix="/analysis", tags=["Crop Analysis"])

@router.post("/process")
def process_field_analysis(req: AnalyzeRequest, current_user: User = Depends(get_current_user)):
    """
    Executes the 8-step satellite & AI analytical pipeline:
    1. Spectral bands processing
    2. NDVI/NDRE calculation
    3. AI Crop Classification
    4. Crop Health evaluation
    5. Growth Stage identification
    6. Harvest Yield estimation
    7. Farmer Agronomy Advisory generation
    """
    # 1 & 2: Satellite Spectral Processing
    spectral = satellite_engine.process_spectral_bands(req.latitude, req.longitude, req.crop_hint)
    ndvi = spectral["indices"]["ndvi"]
    ndre = spectral["indices"]["ndre"]
    evi = spectral["indices"]["evi"]
    
    # 3: AI Crop Type Detection
    crop_info = ai_classifier.classify_crop(
        lat=req.latitude,
        lng=req.longitude,
        state=req.state or "Madhya Pradesh",
        district=req.district or "Jabalpur",
        ndvi=ndvi,
        crop_hint=req.crop_hint
    )
    
    # 4, 5, 6: Crop Health, Stage & Harvest Yield
    area = req.field_area or 2.45
    health_and_stage = growth_stage_service.evaluate_health_and_stage(
        crop_name=crop_info["crop_name"],
        ndvi=ndvi,
        field_area_acres=area,
        base_yield=crop_info["base_yield_per_acre"]
    )
    
    # 7: Agronomy Advisory
    advisory = advisory_service.generate_advisory(
        crop_name=crop_info["crop_name"],
        health=health_and_stage["crop_health"],
        stage=health_and_stage["growth_stage"],
        ndvi=ndvi
    )
    
    # Simulated weather conditions for the location
    weather = {
        "temp": 28.5,
        "condition": "Partly Cloudy",
        "humidity": 62.0,
        "rain_chance": 15.0
    }
    
    return {
        "status": "success",
        "timestamp": datetime.utcnow().isoformat(),
        "source": "DEMO_AI (Sentinel-2 MSI Synthetic BOA)",
        "coordinates": {
            "latitude": req.latitude,
            "longitude": req.longitude,
            "district": req.district,
            "state": req.state,
            "field_area": area,
            "polygon_geojson": req.polygon_geojson
        },
        "crop_detection": {
            "crop_name": crop_info["crop_name"],
            "crop_icon": crop_info["crop_icon"],
            "confidence_score": crop_info["confidence_score"]
        },
        "spectral_indices": {
            "ndvi": ndvi,
            "ndre": ndre,
            "evi": evi,
            "cloud_cover_percent": spectral["cloud_cover_percent"],
            "ndvi_matrix": spectral["ndvi_matrix"]
        },
        "health_assessment": {
            "crop_health": health_and_stage["crop_health"],
            "health_color": health_and_stage["health_color"],
            "health_explanation": health_and_stage["health_explanation"],
            "growth_stage": health_and_stage["growth_stage"]
        },
        "yield_forecast": {
            "estimated_harvest": health_and_stage["estimated_harvest"],
            "harvest_unit": health_and_stage["harvest_unit"],
            "yield_per_acre": health_and_stage["yield_per_acre"]
        },
        "farmer_advisory": advisory,
        "weather": weather,
        "field_id": req.field_id
    }

@router.post("/save", response_model=AnalysisOut, status_code=status.HTTP_201_CREATED)
def save_analysis(req: AnalysisSaveRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Saves completed analysis to user's history."""
    new_analysis = Analysis(
        user_id=current_user.id,
        field_id=req.field_id,
        crop_name=req.crop_name,
        crop_health=req.crop_health,
        growth_stage=req.growth_stage,
        ndvi=req.ndvi,
        ndre=req.ndre,
        evi=req.evi,
        district=req.district,
        state=req.state,
        latitude=req.latitude,
        longitude=req.longitude,
        polygon_geojson=req.polygon_geojson,
        field_area=req.field_area,
        estimated_harvest=req.estimated_harvest,
        harvest_unit=req.harvest_unit,
        confidence_score=req.confidence_score,
        health_explanation=req.health_explanation,
        advisory_irrigation=req.advisory_irrigation,
        advisory_fertilizer=req.advisory_fertilizer,
        advisory_pest=req.advisory_pest,
        weather_temp=req.weather_temp,
        weather_condition=req.weather_condition,
        weather_humidity=req.weather_humidity,
        weather_rain_chance=req.weather_rain_chance,
        source=req.source,
        analysis_date=datetime.utcnow()
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    return new_analysis

@router.get("/history", response_model=List[AnalysisOut])
def get_analysis_history(
    crop: Optional[str] = None,
    health: Optional[str] = None,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Retrieves user's historical analyses with optional filtering."""
    query = db.query(Analysis).filter(Analysis.user_id == current_user.id)
    if crop:
        query = query.filter(Analysis.crop_name.ilike(f"%{crop}%"))
    if health:
        query = query.filter(Analysis.crop_health.ilike(f"%{health}%"))
    return query.order_by(Analysis.created_at.desc()).all()

@router.get("/{analysis_id}", response_model=AnalysisOut)
def get_analysis_by_id(analysis_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")
    return analysis

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(analysis_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")
    db.delete(analysis)
    db.commit()
    return None
