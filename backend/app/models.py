import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True, default="+91 9876543210")
    district = Column(String, default="Jabalpur")
    state = Column(String, default="Madhya Pradesh")
    language = Column(String, default="en")
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    fields = relationship("Field", back_populates="owner", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")

class Field(Base):
    __tablename__ = "fields"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    field_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    polygon_geojson = Column(Text, nullable=True)  # JSON string of boundary coordinates
    district = Column(String, nullable=False)
    state = Column(String, nullable=False)
    area = Column(Float, nullable=False, default=2.45) # in acres
    crop_type = Column(String, nullable=True, default="Wheat")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="fields")
    analyses = relationship("Analysis", back_populates="field", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    field_id = Column(String, ForeignKey("fields.id"), nullable=True, index=True)
    
    crop_name = Column(String, nullable=False)           # e.g., Wheat, Soybean, Rice, Maize, Cotton
    crop_health = Column(String, nullable=False)         # Healthy, Moderate, Poor
    growth_stage = Column(String, nullable=False)        # Tillering Stage, Flowering, etc.
    ndvi = Column(Float, nullable=False)                 # e.g., 0.72
    ndre = Column(Float, nullable=True)                 # Red-edge index
    evi = Column(Float, nullable=True)                  # Enhanced Vegetation Index
    
    district = Column(String, nullable=False)            # e.g., Jabalpur
    state = Column(String, nullable=False)               # e.g., Madhya Pradesh
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    polygon_geojson = Column(Text, nullable=True)
    
    field_area = Column(Float, nullable=False)           # in Acres
    estimated_harvest = Column(Float, nullable=False)    # in Quintals
    harvest_unit = Column(String, default="Quintal")
    confidence_score = Column(Float, default=0.95)
    
    health_explanation = Column(Text, nullable=True)
    advisory_irrigation = Column(Text, nullable=True)
    advisory_fertilizer = Column(Text, nullable=True)
    advisory_pest = Column(Text, nullable=True)
    
    weather_temp = Column(Float, default=28.5)
    weather_condition = Column(String, default="Partly Cloudy")
    weather_humidity = Column(Float, default=62.0)
    weather_rain_chance = Column(Float, default=15.0)
    
    source = Column(String, default="DEMO_AI")           # "DEMO_AI" or "SENTINEL2_GEE"
    satellite_tile_url = Column(String, nullable=True)
    analysis_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="analyses")
    field = relationship("Field", back_populates="analyses")
