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

def test_analysis_pipeline_comprehensive():
    login_res = client.post("/api/auth/login", json={
        "email": "ramesh@satcrop.com",
        "password": "farmer123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

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
    assert "irrigation_plan" in data
    assert "satellite_timeseries" in data
    assert "market_revenue" in data

def test_irrigation_endpoint():
    res = client.get("/api/irrigation/calculate?crop=Wheat&area=2.45&stage=Tillering&et0=4.3&soil=Clay&pump_hp=5.0")
    assert res.status_code == 200
    data = res.json()
    assert "daily_water_liters" in data
    assert "pump_specifications" in data
    assert data["pump_specifications"]["required_pump_run_hours"] > 0

def test_schemes_endpoint():
    res = client.get("/api/schemes/list")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    assert data[0]["name"] == "PM-KISAN Samman Nidhi"

def test_leaf_doctor_endpoint():
    res = client.post("/api/analysis/leaf-scan?crop=Wheat&sample_name=sample.jpg")
    assert res.status_code == 200
    data = res.json()
    assert "diagnosis" in data
    assert "immediate_action" in data
    assert "confidence_percentage" in data

def test_timeseries_endpoint():
    res = client.get("/api/analysis/timeseries?lat=23.1815&lng=79.9864&ndvi=0.72")
    assert res.status_code == 200
    data = res.json()
    assert "historical_passes" in data
    assert len(data["historical_passes"]) == 6
