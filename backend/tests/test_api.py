import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_login_demo_farmer():
    response = client.post("/api/auth/login", json={
        "email": "ramesh@satcrop.com",
        "password": "farmer123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "ramesh@satcrop.com"
    assert data["user"]["name"] == "Ramesh Kumar"

def test_analysis_pipeline_comprehensive():
    # Login to get token
    login_res = client.post("/api/auth/login", json={
        "email": "ramesh@satcrop.com",
        "password": "farmer123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Process field analysis
    response = client.post("/api/analysis/process", headers=headers, json={
        "latitude": 23.1815,
        "longitude": 79.9864,
        "district": "Jabalpur",
        "state": "Madhya Pradesh",
        "field_area": 2.45
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "crop_detection" in data
    assert "spectral_indices" in data
    assert "ndvi" in data["spectral_indices"]
    assert "ndwi" in data["spectral_indices"]
    assert "savi" in data["spectral_indices"]
    assert "health_assessment" in data
    assert "yield_forecast" in data
    assert "market_revenue" in data
    assert "fertilizer_dosage" in data
    assert "pest_diagnostics" in data

def test_live_weather_endpoint():
    res = client.get("/api/weather/live?lat=23.1815&lng=79.9864")
    assert res.status_code == 200
    data = res.json()
    assert "current" in data
    assert "daily_forecast" in data

def test_mandi_rates_endpoint():
    res = client.get("/api/market/mandi-rates?crop=Wheat&yield_q=32.5&district=Jabalpur")
    assert res.status_code == 200
    data = res.json()
    assert data["crop_name"] == "Wheat"
    assert "estimated_gross_revenue_inr" in data
    assert data["modal_price_per_quintal"] > 0

def test_pest_diagnostics_endpoint():
    res = client.get("/api/pest/diagnostics?crop=Wheat&humidity=65&temp=28")
    assert res.status_code == 200
    data = res.json()
    assert "threats" in data
    assert len(data["threats"]) > 0

def test_fertilizer_dosage_endpoint():
    res = client.get("/api/fertilizer/dosage?crop=Wheat&area=2.45&stage=Tillering")
    assert res.status_code == 200
    data = res.json()
    assert "fertilizer_plan" in data
    assert "dap" in data["fertilizer_plan"]
    assert "urea" in data["fertilizer_plan"]
