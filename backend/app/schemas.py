from pydantic import BaseModel, EmailStr, Field as PydanticField
from typing import Optional, List, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = "+91 9876543210"
    district: Optional[str] = "Jabalpur"
    state: Optional[str] = "Madhya Pradesh"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    district: Optional[str]
    state: Optional[str]
    language: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    language: Optional[str] = None
    avatar_url: Optional[str] = None

# --- Field Schemas ---
class FieldBase(BaseModel):
    field_name: str
    latitude: float
    longitude: float
    polygon_geojson: Optional[str] = None
    district: str
    state: str
    area: float = 2.45
    crop_type: Optional[str] = "Wheat"

class FieldCreate(FieldBase):
    pass

class FieldUpdate(BaseModel):
    field_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    polygon_geojson: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    area: Optional[float] = None
    crop_type: Optional[str] = None

class FieldOut(FieldBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    last_analysis: Optional[Any] = None

    class Config:
        from_attributes = True

# --- Analysis Schemas ---
class AnalyzeRequest(BaseModel):
    latitude: float
    longitude: float
    polygon_geojson: Optional[str] = None
    district: Optional[str] = "Jabalpur"
    state: Optional[str] = "Madhya Pradesh"
    field_area: Optional[float] = 2.45
    field_id: Optional[str] = None
    crop_hint: Optional[str] = None

class AnalysisSaveRequest(BaseModel):
    crop_name: str
    crop_health: str
    growth_stage: str
    ndvi: float
    ndre: Optional[float] = None
    evi: Optional[float] = None
    district: str
    state: str
    latitude: float
    longitude: float
    polygon_geojson: Optional[str] = None
    field_area: float
    estimated_harvest: float
    harvest_unit: str = "Quintal"
    confidence_score: float = 0.95
    health_explanation: Optional[str] = None
    advisory_irrigation: Optional[str] = None
    advisory_fertilizer: Optional[str] = None
    advisory_pest: Optional[str] = None
    weather_temp: Optional[float] = 28.5
    weather_condition: Optional[str] = "Partly Cloudy"
    weather_humidity: Optional[float] = 62.0
    weather_rain_chance: Optional[float] = 15.0
    source: str = "DEMO_AI"
    field_id: Optional[str] = None

class AnalysisOut(BaseModel):
    id: str
    user_id: str
    field_id: Optional[str]
    crop_name: str
    crop_health: str
    growth_stage: str
    ndvi: float
    ndre: Optional[float]
    evi: Optional[float]
    district: str
    state: str
    latitude: float
    longitude: float
    polygon_geojson: Optional[str]
    field_area: float
    estimated_harvest: float
    harvest_unit: str
    confidence_score: float
    health_explanation: Optional[str]
    advisory_irrigation: Optional[str]
    advisory_fertilizer: Optional[str]
    advisory_pest: Optional[str]
    weather_temp: Optional[float]
    weather_condition: Optional[str]
    weather_humidity: Optional[float]
    weather_rain_chance: Optional[float]
    source: str
    satellite_tile_url: Optional[str]
    analysis_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# --- Dashboard Schemas ---
class DashboardStats(BaseModel):
    total_fields: int
    total_acreage: float
    healthy_percent: float
    moderate_percent: float
    poor_percent: float
    healthy_count: int
    moderate_count: int
    poor_count: int
    recent_analyses: List[AnalysisOut]
    current_location: dict
    weather: dict

# --- Boundary & Geo Schemas ---
class BoundaryFeature(BaseModel):
    name: str
    type: str  # "state" or "district"
    state: Optional[str] = None
    district: Optional[str] = None
    geojson: dict
