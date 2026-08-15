import hashlib
from datetime import datetime, timedelta
from .database import SessionLocal, Base, engine
from .models import User, Field, Analysis

def hash_password(password: str) -> str:
    salt = "satcrop_krishivision_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if demo user already exists
    demo_email = "ramesh@satcrop.com"
    user = db.query(User).filter(User.email == demo_email).first()
    
    if not user:
        user = User(
            id="user-ramesh-kumar-001",
            name="Ramesh Kumar",
            email=demo_email,
            hashed_password=hash_password("farmer123"),
            phone="+91 9876543210",
            district="Jabalpur",
            state="Madhya Pradesh",
            language="en",
            created_at=datetime.utcnow() - timedelta(days=60)
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Seed sample fields for Ramesh Kumar
        field1 = Field(
            id="field-001",
            user_id=user.id,
            field_name="North Farm - Plot A (Wheat)",
            latitude=23.1815,
            longitude=79.9864,
            district="Jabalpur",
            state="Madhya Pradesh",
            area=2.45,
            crop_type="Wheat",
            created_at=datetime.utcnow() - timedelta(days=45)
        )
        field2 = Field(
            id="field-002",
            user_id=user.id,
            field_name="South Riverbank Field",
            latitude=23.1650,
            longitude=79.9520,
            district="Jabalpur",
            state="Madhya Pradesh",
            area=4.20,
            crop_type="Soybean",
            created_at=datetime.utcnow() - timedelta(days=30)
        )
        field3 = Field(
            id="field-003",
            user_id=user.id,
            field_name="Canal Side Plot",
            latitude=23.2100,
            longitude=80.0120,
            district="Jabalpur",
            state="Madhya Pradesh",
            area=1.80,
            crop_type="Gram (Chickpea)",
            created_at=datetime.utcnow() - timedelta(days=15)
        )
        db.add_all([field1, field2, field3])
        db.commit()

        # Seed sample analyses matching reference design
        an1 = Analysis(
            id="an-001",
            user_id=user.id,
            field_id=field1.id,
            crop_name="Wheat",
            crop_health="Healthy",
            growth_stage="Tillering Stage",
            ndvi=0.72,
            ndre=0.61,
            evi=0.68,
            district="Jabalpur",
            state="Madhya Pradesh",
            latitude=23.1815,
            longitude=79.9864,
            field_area=2.45,
            estimated_harvest=32.5,
            harvest_unit="Quintal",
            confidence_score=0.96,
            health_explanation="The vegetation appears healthy based on current Sentinel-2 multispectral analysis with strong chlorophyll reflectance.",
            advisory_irrigation="Next irrigation in 5 days. Soil moisture is within healthy threshold.",
            advisory_fertilizer="Top-dress with Urea @ 25 kg/acre + DAP @ 15 kg/acre.",
            advisory_pest="Low pest risk. Scout weekly for aphids.",
            source="DEMO_AI",
            analysis_date=datetime.utcnow() - timedelta(days=3),
            created_at=datetime.utcnow() - timedelta(days=3)
        )
        an2 = Analysis(
            id="an-002",
            user_id=user.id,
            field_id=field2.id,
            crop_name="Soybean",
            crop_health="Moderate",
            growth_stage="Pod Development (R3-R4)",
            ndvi=0.54,
            ndre=0.45,
            evi=0.51,
            district="Jabalpur",
            state="Madhya Pradesh",
            latitude=23.1650,
            longitude=79.9520,
            field_area=4.20,
            estimated_harvest=38.6,
            harvest_unit="Quintal",
            confidence_score=0.92,
            health_explanation="Mild moisture deficit detected in western quadrant. Vegetation canopy density is moderate.",
            advisory_irrigation="Irrigate within 48 hours to prevent pod abortion.",
            advisory_fertilizer="Foliar spray of 19:19:19 NPK @ 1 kg/acre.",
            advisory_pest="Inspect for semi-looper caterpillars.",
            source="DEMO_AI",
            analysis_date=datetime.utcnow() - timedelta(days=10),
            created_at=datetime.utcnow() - timedelta(days=10)
        )
        an3 = Analysis(
            id="an-003",
            user_id=user.id,
            field_id=field3.id,
            crop_name="Maize",
            crop_health="Poor",
            growth_stage="Tasseling Stage",
            ndvi=0.38,
            ndre=0.30,
            evi=0.35,
            district="Jabalpur",
            state="Madhya Pradesh",
            latitude=23.2100,
            longitude=80.0120,
            field_area=1.80,
            estimated_harvest=14.2,
            harvest_unit="Quintal",
            confidence_score=0.89,
            health_explanation="Significant moisture stress and nitrogen deficiency observed across the field.",
            advisory_irrigation="Immediate deep irrigation recommended.",
            advisory_fertilizer="Apply Urea 30 kg/acre immediately post-watering.",
            advisory_pest="Check for Fall Armyworm damage in whorls.",
            source="DEMO_AI",
            analysis_date=datetime.utcnow() - timedelta(days=20),
            created_at=datetime.utcnow() - timedelta(days=20)
        )
        db.add_all([an1, an2, an3])
        db.commit()

    db.close()

if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully!")
