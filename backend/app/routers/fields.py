from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Field, User, Analysis
from ..schemas import FieldCreate, FieldUpdate, FieldOut
from .auth import get_current_user

router = APIRouter(prefix="/fields", tags=["Fields Management"])

@router.get("", response_model=List[FieldOut])
def get_user_fields(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fields = db.query(Field).filter(Field.user_id == current_user.id).order_by(Field.created_at.desc()).all()
    # Attach last analysis summary if exists
    result = []
    for f in fields:
        last_an = db.query(Analysis).filter(Analysis.field_id == f.id).order_by(Analysis.created_at.desc()).first()
        f_out = FieldOut.from_orm(f)
        if last_an:
            f_out.last_analysis = {
                "id": last_an.id,
                "crop_name": last_an.crop_name,
                "crop_health": last_an.crop_health,
                "ndvi": last_an.ndvi,
                "analysis_date": last_an.analysis_date
            }
        result.append(f_out)
    return result

@router.post("", response_model=FieldOut, status_code=status.HTTP_201_CREATED)
def create_field(field_in: FieldCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_field = Field(
        user_id=current_user.id,
        field_name=field_in.field_name,
        latitude=field_in.latitude,
        longitude=field_in.longitude,
        polygon_geojson=field_in.polygon_geojson,
        district=field_in.district,
        state=field_in.state,
        area=field_in.area,
        crop_type=field_in.crop_type
    )
    db.add(new_field)
    db.commit()
    db.refresh(new_field)
    return new_field

@router.get("/{field_id}", response_model=FieldOut)
def get_field(field_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id, Field.user_id == current_user.id).first()
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    return field

@router.put("/{field_id}", response_model=FieldOut)
def update_field(field_id: str, field_in: FieldUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id, Field.user_id == current_user.id).first()
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")

    if field_in.field_name is not None:
        field.field_name = field_in.field_name
    if field_in.latitude is not None:
        field.latitude = field_in.latitude
    if field_in.longitude is not None:
        field.longitude = field_in.longitude
    if field_in.polygon_geojson is not None:
        field.polygon_geojson = field_in.polygon_geojson
    if field_in.district is not None:
        field.district = field_in.district
    if field_in.state is not None:
        field.state = field_in.state
    if field_in.area is not None:
        field.area = field_in.area
    if field_in.crop_type is not None:
        field.crop_type = field_in.crop_type

    db.commit()
    db.refresh(field)
    return field

@router.delete("/{field_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_field(field_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id, Field.user_id == current_user.id).first()
    if not field:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
    
    db.delete(field)
    db.commit()
    return None
