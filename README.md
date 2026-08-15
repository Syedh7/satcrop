# 🌱 SATCROP / KrishiVision AI
> **“Smart Farming. Better Tomorrow.”**
> AI-powered satellite crop monitoring & analysis application for farmers.

---

## 📌 Project Overview
**SATCROP** is a modern agricultural intelligence platform designed to empower farmers and agronomists with AI-driven satellite imagery analysis. It features:
- 🛰️ **Interactive High-Resolution Satellite Maps** (ESRI World Imagery + OpenStreetMap layers)
- 🗺️ **Administrative Boundaries Overlay** (State and District Boundary selection and visualization)
- 🌿 **Multispectral Spectral Processing** (Sentinel-2 MSI simulation, calculating NDVI, NDRE, EVI, and cloud cover)
- 🌾 **AI Crop Recognition** (Deep learning classification for Wheat, Soybean, Rice/Paddy, Maize, Cotton, Sugarcane, Gram)
- 📈 **Growth Stage & Harvest Yield Estimation** (Detailed stage recognition & Quintals yield forecasting)
- 📑 **Comprehensive Agronomy Report Session** (Instant PDF / Print export with QR verification seal)
- 🌐 **Multilingual Farmer Support** (English, हिंदी, मराठी, ਪੰਜਾਬੀ, తెలుగు)
- 🔒 **Secure User Isolation & Field Management** (CRUD for farm plots, location history, and profile settings)

---

## 🛠️ Architecture & Tech Stack

```
Frontend (React 18 + Vite + Tailwind + Leaflet)
                  ↓  (REST API / JWT)
Backend (Python 3.12 + FastAPI + SQLite + SQLAlchemy)
                  ↓
Satellite Engine (Sentinel-2 BOA / NDVI Calculation / AI Crop Classifier)
```

- **Frontend**: React 18, TypeScript, Tailwind CSS, Leaflet & React-Leaflet, Recharts, Lucide Icons.
- **Backend**: FastAPI, Uvicorn, SQLAlchemy, SQLite, Pydantic, Python-JOSE (JWT), Passlib (Bcrypt).

---

## 🚀 How to Run

### 1. Start Backend API Server
```bash
cd backend
python run.py
```
The FastAPI backend will start on **`http://localhost:8000`** (Swagger docs at `http://localhost:8000/docs`).

### 2. Start Frontend Application
```bash
cd frontend
npm run dev
```
The web application will open on **`http://localhost:5173`**.

---

## 👨‍🌾 Demo Farmer Credentials
For instant 1-click evaluation:
- **Email:** `ramesh@satcrop.com`
- **Password:** `farmer123`
*(Or click the "⚡ 1-Click Demo Login" button on the login screen)*
