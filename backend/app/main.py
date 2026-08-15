from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .seed_data import seed_database
from .routers import auth, fields, analysis, reports, dashboard, geo, weather, market, pest, fertilizer

# Initialize SQLite database and seed initial data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SATCROP / KrishiVision AI — Satellite Based Crop Monitoring & Analysis Application for Farmers",
    version=settings.VERSION
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register sub-routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(fields.router, prefix=settings.API_PREFIX)
app.include_router(analysis.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(geo.router, prefix=settings.API_PREFIX)
app.include_router(weather.router, prefix=settings.API_PREFIX)
app.include_router(market.router, prefix=settings.API_PREFIX)
app.include_router(pest.router, prefix=settings.API_PREFIX)
app.include_router(fertilizer.router, prefix=settings.API_PREFIX)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SATCROP API",
        "tagline": settings.TAGLINE,
        "version": settings.VERSION
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to SATCROP / KrishiVision AI API",
        "docs": "/docs",
        "health": "/health"
    }
