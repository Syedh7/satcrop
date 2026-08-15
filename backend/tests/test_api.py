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

def test_analysis_pipeline():
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
    assert "health_assessment" in data
    assert "yield_forecast" in data
    assert "farmer_advisory" in data

def test_geo_boundaries_and_search():
    # Search
    search_res = client.get("/api/geo/search?q=Jabalpur")
    assert search_res.status_code == 200
    assert len(search_res.json()) > 0

    # Boundaries
    bound_res = client.get("/api/geo/boundaries?district=Jabalpur&state=Madhya+Pradesh&lat=23.1815&lng=79.9864")
    assert bound_res.status_code == 200
    boundaries = bound_res.json()
    assert "district_boundary" in boundaries
    assert "state_boundary" in boundaries
