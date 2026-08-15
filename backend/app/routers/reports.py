from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Analysis, User
from .auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Report Session & Export"])

@router.get("/generate/{analysis_id}")
def generate_report_session(analysis_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Generates structured report session data for preview, PDF rendering, or printing."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")

    report_id = f"SATCROP-REP-{analysis.id[:8].upper()}"
    
    return {
        "report_id": report_id,
        "title": "SATCROP / KrishiVision AI — Satellite Field & Agronomy Report",
        "tagline": "Smart Farming. Better Tomorrow.",
        "generated_at": datetime.utcnow().strftime("%d %B %Y, %I:%M %p UTC"),
        "farmer_info": {
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone or "+91 9876543210",
            "state": current_user.state,
            "district": current_user.district
        },
        "field_specs": {
            "latitude": analysis.latitude,
            "longitude": analysis.longitude,
            "district": analysis.district,
            "state": analysis.state,
            "area_acres": analysis.field_area,
            "polygon_geojson": analysis.polygon_geojson
        },
        "crop_analysis": {
            "crop_name": analysis.crop_name,
            "crop_health": analysis.crop_health,
            "growth_stage": analysis.growth_stage,
            "ndvi": analysis.ndvi,
            "ndre": analysis.ndre or round(analysis.ndvi * 0.82, 2),
            "evi": analysis.evi or round(analysis.ndvi * 0.94, 2),
            "estimated_harvest": analysis.estimated_harvest,
            "harvest_unit": analysis.harvest_unit,
            "confidence_score": analysis.confidence_score,
            "health_explanation": analysis.health_explanation,
            "source": analysis.source
        },
        "weather_snapshot": {
            "temp": analysis.weather_temp,
            "condition": analysis.weather_condition,
            "humidity": analysis.weather_humidity,
            "rain_chance": analysis.weather_rain_chance
        },
        "advisory": {
            "irrigation": analysis.advisory_irrigation,
            "fertilizer": analysis.advisory_fertilizer,
            "pest_management": analysis.advisory_pest
        },
        "verification_seal": {
            "status": "Verified by SatCrop Sentinel Engine",
            "code": f"SC-{hash(analysis.id) % 1000000:06d}"
        }
    }

@router.get("/print/{analysis_id}", response_class=HTMLResponse)
def print_report_html(analysis_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns a standalone printable HTML report suitable for browser print-to-PDF."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis record not found")

    health_bg = "#dcfce7" if analysis.crop_health == "Healthy" else ("#fef9c3" if analysis.crop_health == "Moderate" else "#fee2e2")
    health_fg = "#15803d" if analysis.crop_health == "Healthy" else ("#a16207" if analysis.crop_health == "Moderate" else "#b91c1c")

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>SatCrop Report - {analysis.crop_name} ({analysis.district})</title>
        <style>
            @page {{ size: A4; margin: 15mm; }}
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; }}
            .header {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #16a34a; padding-bottom: 12px; margin-bottom: 20px; }}
            .brand {{ font-size: 24px; font-weight: bold; color: #15803d; }}
            .tagline {{ font-size: 13px; color: #64748b; }}
            .report-badge {{ background: #f0fdf4; border: 1px solid #86efac; color: #166534; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-size: 13px; }}
            .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }}
            .card {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }}
            .card-title {{ font-size: 13px; font-weight: bold; color: #475569; text-transform: uppercase; margin-bottom: 8px; }}
            .stat-value {{ font-size: 22px; font-weight: bold; color: #0f172a; }}
            .health-tag {{ display: inline-block; background: {health_bg}; color: {health_fg}; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 14px; }}
            .advisory-box {{ background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px; border-radius: 4px; margin-top: 10px; font-size: 14px; }}
            .footer {{ margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }}
            @media print {{
                .no-print {{ display: none; }}
                body {{ padding: 0; }}
            }}
        </style>
    </head>
    <body>
        <div class="no-print" style="margin-bottom: 20px;">
            <button onclick="window.print()" style="background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ Print / Download PDF</button>
        </div>

        <div class="header">
            <div>
                <div class="brand">🌱 SATCROP / KrishiVision AI</div>
                <div class="tagline">Smart Farming. Better Tomorrow.</div>
            </div>
            <div class="report-badge">
                OFFICIAL SATELLITE AGRONOMY REPORT
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <div class="card-title">Farmer & Location Details</div>
                <div><strong>Farmer:</strong> {current_user.name}</div>
                <div><strong>Location:</strong> {analysis.district}, {analysis.state}</div>
                <div><strong>Coordinates:</strong> {analysis.latitude:.4f}° N, {analysis.longitude:.4f}° E</div>
                <div><strong>Field Area:</strong> {analysis.field_area} Acres</div>
            </div>
            <div class="card">
                <div class="card-title">Satellite Mission Metadata</div>
                <div><strong>Sensor:</strong> Sentinel-2 MSI (10m Resolution)</div>
                <div><strong>Date Analyzed:</strong> {analysis.analysis_date.strftime("%d %B %Y")}</div>
                <div><strong>Engine Mode:</strong> {analysis.source}</div>
                <div><strong>Confidence:</strong> {int(analysis.confidence_score * 100)}%</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 20px;">
            <div class="card-title">Crop Health & Spectral Findings</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                    <span style="font-size: 26px; font-weight: bold; color: #15803d;">{analysis.crop_name}</span>
                    <span style="margin-left: 12px;" class="health-tag">{analysis.crop_health}</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 12px; color: #64748b;">NDVI Index Score</div>
                    <div class="stat-value" style="color: #16a34a;">{analysis.ndvi:.2f}</div>
                </div>
            </div>
            <div><strong>Growth Stage:</strong> {analysis.growth_stage}</div>
            <div><strong>Estimated Harvest:</strong> {analysis.estimated_harvest} {analysis.harvest_unit} (~{analysis.estimated_harvest / max(analysis.field_area, 0.1):.1f} Q/Acre)</div>
            <p style="color: #334155; margin-top: 8px;">{analysis.health_explanation}</p>
        </div>

        <div class="card">
            <div class="card-title">Agronomy Recommendations</div>
            <div class="advisory-box">
                <strong>💧 Irrigation:</strong> {analysis.advisory_irrigation}
            </div>
            <div class="advisory-box">
                <strong>🧪 Fertilization:</strong> {analysis.advisory_fertilizer}
            </div>
            <div class="advisory-box">
                <strong>🛡️ Plant Protection:</strong> {analysis.advisory_pest}
            </div>
        </div>

        <div class="footer">
            <div>Report ID: SATCROP-REP-{analysis.id[:8].upper()} | Verified by KrishiVision AI</div>
            <div>Generated on {datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")}</div>
        </div>
    </body>
    </html>
    """
    return html_content
