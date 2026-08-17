/**
 * SATCROP Real-Time Agricultural Alert & Hazard Warning Engine
 * Computes live agro-hazard alerts from weather/soil telemetry.
 * Triggers: Rain Flood, Heat Stress, Soil Moisture Deficit,
 *           Fungal Humidity Risk, Optimal Spraying Window.
 */

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AgroAlert {
  id: string;
  type:
    | 'RAIN_FLOOD'
    | 'HEAT_STRESS'
    | 'SOIL_DEFICIT'
    | 'FUNGAL_RISK'
    | 'SPRAYING_WINDOW'
    | 'IRRIGATION_URGENT'
    | 'FROST_RISK'
    | 'WIND_ADVISORY';
  severity: AlertSeverity;
  icon: string;
  title: string;
  message: string;
  action: string;
  timestamp: number;
  dismissible: boolean;
}

export interface WeatherTelemetry {
  temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  rain_current_mm: number;
  cloud_cover_pct: number;
  soil_moisture_topsoil_pct: number;
  soil_moisture_subsoil_pct: number;
  soil_temp_c: number;
  rain_probability_24h?: number;   // % for today
  et0_mm_day?: number;             // mm/day FAO-56 ET0
  solar_radiation_wm2?: number;    // W/m²
  wind_gusts_kmh?: number;
  dew_point_c?: number;
}

// ─── Alert Computation Engine ─────────────────────────────────────────────────

export function computeAgroAlerts(weather: WeatherTelemetry, cropName = 'Crop'): AgroAlert[] {
  const alerts: AgroAlert[] = [];
  const now = Date.now();

  const {
    temperature_c: temp,
    humidity_pct: humidity,
    wind_speed_kmh: wind,
    rain_current_mm: rainNow,
    soil_moisture_topsoil_pct: topsoilPct,
    rain_probability_24h: rainProb = 10,
    et0_mm_day: et0 = 4.0,
    wind_gusts_kmh: gusts = wind,
  } = weather;

  // ── 1. Rain / Flood Warning ─────────────────────────────────────────────────
  if (rainNow >= 5 || rainProb >= 75) {
    alerts.push({
      id: 'RAIN_FLOOD',
      type: 'RAIN_FLOOD',
      severity: rainNow >= 10 || rainProb >= 85 ? 'critical' : 'warning',
      icon: '🌧️',
      title: rainNow >= 5 ? 'Active Rainfall Detected' : 'Heavy Rain Expected (75%+ Risk)',
      message: rainNow >= 5
        ? `Current rain: ${rainNow.toFixed(1)} mm. Postpone all spraying and field operations. Clear furrow drainage channels immediately.`
        : `${Math.round(rainProb)}% chance of heavy rain in next 24 hours. Delay fertilizer top-dressing and pesticide application.`,
      action: 'Halt Spray Operations • Check Drainage Channels',
      timestamp: now,
      dismissible: true,
    });
  }

  // ── 2. Heat Stress & Rapid ET₀ Depletion ────────────────────────────────────
  if (temp >= 38 || (et0 >= 7.5 && temp >= 34)) {
    alerts.push({
      id: 'HEAT_STRESS',
      type: 'HEAT_STRESS',
      severity: temp >= 42 ? 'critical' : 'warning',
      icon: '🔥',
      title: `Heat Stress: ${temp.toFixed(1)}°C — Irrigation Urgent`,
      message: `High temperature + ET₀ depletion rate of ${et0.toFixed(1)} mm/day. ${cropName} is losing critical moisture rapidly. Irrigate before 7 AM or after 6 PM to minimise evaporation.`,
      action: 'Irrigate During Early Morning / Evening Hours',
      timestamp: now,
      dismissible: true,
    });
  }

  // ── 3. Urgent Irrigation: Critical Topsoil Moisture Deficit ─────────────────
  if (topsoilPct < 18) {
    alerts.push({
      id: 'SOIL_DEFICIT',
      type: 'SOIL_DEFICIT',
      severity: topsoilPct < 12 ? 'critical' : 'warning',
      icon: '💧',
      title: `Topsoil Moisture Critical: ${topsoilPct.toFixed(1)}%`,
      message: topsoilPct < 12
        ? `Severe soil moisture deficit. Root-zone wilting risk is HIGH. Start irrigation immediately — ${cropName} is under acute water stress.`
        : `Topsoil moisture below field capacity threshold (18%). Schedule drip or furrow irrigation within the next 24 hours.`,
      action: 'Start Irrigation Immediately',
      timestamp: now,
      dismissible: true,
    });
  }

  // ── 4. Fungal / Blight Humidity Risk ────────────────────────────────────────
  if (humidity >= 82 && temp >= 18 && temp <= 32) {
    const isCritical = humidity >= 90 && temp >= 22 && temp <= 28;
    alerts.push({
      id: 'FUNGAL_RISK',
      type: 'FUNGAL_RISK',
      severity: isCritical ? 'critical' : 'warning',
      icon: '🍄',
      title: `Fungal / Blight Risk: ${humidity}% RH at ${temp.toFixed(1)}°C`,
      message: isCritical
        ? `CRITICAL: Ideal conditions for Blast, Late Blight, and Powdery Mildew. Apply systemic fungicide (Propiconazole 25 EC) within 12–24 hours before spore dispersal.`
        : `High humidity with warm temperatures creates conditions for fungal infection. Scout fields for early symptoms of rust, blight, or septoria.`,
      action: 'Schedule Preventive Fungicide Application',
      timestamp: now,
      dismissible: true,
    });
  }

  // ── 5. Optimal Spraying Window Detected ─────────────────────────────────────
  const isOptimalSpray =
    wind <= 10 &&
    humidity >= 40 && humidity <= 70 &&
    temp >= 15 && temp <= 30 &&
    rainNow === 0 &&
    rainProb <= 20;

  if (isOptimalSpray) {
    alerts.push({
      id: 'SPRAYING_WINDOW',
      type: 'SPRAYING_WINDOW',
      severity: 'success',
      icon: '✅',
      title: 'Optimal Spraying Window Active',
      message: `Wind: ${wind.toFixed(0)} km/h • Humidity: ${humidity}% • Temp: ${temp.toFixed(1)}°C • Rain risk: ${rainProb}%. Ideal conditions for pesticide and foliar fertiliser application.`,
      action: 'Proceed With Spray Operations Now',
      timestamp: now,
      dismissible: true,
    });
  }

  // ── 6. High Wind Advisory ────────────────────────────────────────────────────
  if ((gusts ?? wind) >= 30) {
    alerts.push({
      id: 'WIND_ADVISORY',
      type: 'WIND_ADVISORY',
      severity: (gusts ?? wind) >= 50 ? 'critical' : 'warning',
      icon: '💨',
      title: `Strong Winds: ${(gusts ?? wind).toFixed(0)} km/h Gusts`,
      message: `Wind gusts may cause crop lodging and spray drift. Avoid aerial/knapsack spraying. Support tall crops (maize, sugarcane) where needed.`,
      action: 'Suspend Spray Operations • Check Crop Support',
      timestamp: now,
      dismissible: true,
    });
  }

  // ── 7. Frost Risk ─────────────────────────────────────────────────────────────
  if (temp <= 4) {
    alerts.push({
      id: 'FROST_RISK',
      type: 'FROST_RISK',
      severity: temp <= 2 ? 'critical' : 'warning',
      icon: '❄️',
      title: `Frost Risk: Temperature ${temp.toFixed(1)}°C`,
      message: `Near-freezing temperatures risk frost damage on young seedlings and flowering crops. Apply light irrigation to generate latent heat protection around root zone.`,
      action: 'Apply Light Irrigation for Frost Protection',
      timestamp: now,
      dismissible: true,
    });
  }

  // Sort: critical first, then warning, then info/success
  const severityOrder: Record<AlertSeverity, number> = {
    critical: 0, warning: 1, info: 2, success: 3,
  };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return alerts;
}

// ─── Severity Style Helpers ──────────────────────────────────────────────────

export function getAlertStyles(severity: AlertSeverity) {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60',
        border: 'border-rose-300 dark:border-rose-700',
        icon: 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400',
        title: 'text-rose-900 dark:text-rose-200',
        text: 'text-rose-700 dark:text-rose-300',
        action: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-600 text-white',
      };
    case 'warning':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/60',
        border: 'border-amber-300 dark:border-amber-700',
        icon: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400',
        title: 'text-amber-900 dark:text-amber-200',
        text: 'text-amber-700 dark:text-amber-300',
        action: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-500 text-white',
      };
    case 'success':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60',
        border: 'border-emerald-300 dark:border-emerald-700',
        icon: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400',
        title: 'text-emerald-900 dark:text-emerald-200',
        text: 'text-emerald-700 dark:text-emerald-300',
        action: 'text-emerald-600 dark:text-emerald-400',
        badge: 'bg-emerald-600 text-white',
      };
    default:
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/60',
        border: 'border-blue-300 dark:border-blue-700',
        icon: 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400',
        title: 'text-blue-900 dark:text-blue-200',
        text: 'text-blue-700 dark:text-blue-300',
        action: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-600 text-white',
      };
  }
}
