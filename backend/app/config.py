import os

class Settings:
    PROJECT_NAME: str = "SATCROP API"
    TAGLINE: str = "Smart Farming. Better Tomorrow."
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "satcrop_krishivision_secret_key_2026_safe_jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./satcrop.db")
    
    # Satellite / AI Providers (configured via env var)
    GEE_API_KEY: str = os.getenv("GEE_API_KEY", "")
    SENTINEL_HUB_CLIENT_ID: str = os.getenv("SENTINEL_HUB_CLIENT_ID", "")
    SENTINEL_HUB_CLIENT_SECRET: str = os.getenv("SENTINEL_HUB_CLIENT_SECRET", "")
    MAP_TILE_PROVIDER: str = os.getenv("MAP_TILE_PROVIDER", "ESRI_SATELLITE")

settings = Settings()
