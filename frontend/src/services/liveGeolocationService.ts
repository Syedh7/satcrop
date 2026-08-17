/**
 * SATCROP Live Geolocation & GPS Engine
 * Provides high-accuracy continuous GPS tracking, real-time reverse-geocoding
 * with Indian agricultural district/state resolution, and location caching.
 */

export interface LivePosition {
  lat: number;
  lng: number;
  accuracy: number;         // meters
  heading?: number;         // degrees, if moving
  speed?: number;           // m/s, if moving
  timestamp: number;
  source: 'gps' | 'network' | 'cached';
}

export interface ReverseGeoResult {
  district: string;
  state: string;
  village?: string;
  taluka?: string;
  pincode?: string;
  displayName: string;
}

// ─── Watchers ───────────────────────────────────────────────────────────────

let watcherId: number | null = null;
let lastPosition: LivePosition | null = null;
let positionCallbacks: ((pos: LivePosition) => void)[] = [];
let errorCallbacks: ((err: string) => void)[] = [];

// ─── Geolocation Options ─────────────────────────────────────────────────────

const GPS_OPTIONS_HIGH: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12000,
  maximumAge: 0,
};

const GPS_OPTIONS_FAST: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 30000,
};

// ─── Indian Agri District Fallback Map ──────────────────────────────────────
// Covers major agricultural states; used when network geocoding is unavailable

const INDIA_AGRI_DISTRICT_FALLBACK: Array<{
  minLat: number; maxLat: number; minLng: number; maxLng: number;
  district: string; state: string;
}> = [
  // Punjab (Wheat, Rice, Maize)
  { minLat: 30.5, maxLat: 32.2, minLng: 74.0, maxLng: 76.5, district: 'Ludhiana', state: 'Punjab' },
  { minLat: 29.5, maxLat: 31.0, minLng: 76.0, maxLng: 77.5, district: 'Karnal', state: 'Haryana' },
  // Madhya Pradesh (Soybean, Wheat)
  { minLat: 22.5, maxLat: 24.0, minLng: 79.0, maxLng: 81.5, district: 'Jabalpur', state: 'Madhya Pradesh' },
  { minLat: 22.0, maxLat: 23.5, minLng: 75.0, maxLng: 76.5, district: 'Indore', state: 'Madhya Pradesh' },
  { minLat: 23.5, maxLat: 25.0, minLng: 77.0, maxLng: 79.0, district: 'Sagar', state: 'Madhya Pradesh' },
  // Maharashtra (Cotton, Soybean, Sugarcane)
  { minLat: 18.0, maxLat: 19.5, minLng: 73.0, maxLng: 75.0, district: 'Pune', state: 'Maharashtra' },
  { minLat: 19.5, maxLat: 21.5, minLng: 77.5, maxLng: 79.5, district: 'Nagpur', state: 'Maharashtra' },
  { minLat: 17.5, maxLat: 19.0, minLng: 75.5, maxLng: 77.5, district: 'Solapur', state: 'Maharashtra' },
  // Gujarat (Cotton, Groundnut)
  { minLat: 21.5, maxLat: 23.5, minLng: 72.0, maxLng: 74.5, district: 'Ahmedabad', state: 'Gujarat' },
  { minLat: 20.5, maxLat: 22.5, minLng: 70.0, maxLng: 72.5, district: 'Rajkot', state: 'Gujarat' },
  // Andhra Pradesh / Telangana (Rice, Cotton)
  { minLat: 15.5, maxLat: 17.5, minLng: 78.5, maxLng: 80.5, district: 'Kurnool', state: 'Andhra Pradesh' },
  { minLat: 16.5, maxLat: 18.0, minLng: 79.0, maxLng: 81.0, district: 'Warangal', state: 'Telangana' },
  // West Bengal (Rice, Jute)
  { minLat: 22.0, maxLat: 24.5, minLng: 87.5, maxLng: 89.5, district: 'Bardhaman', state: 'West Bengal' },
  // Uttar Pradesh (Wheat, Rice, Sugarcane)
  { minLat: 25.5, maxLat: 27.5, minLng: 81.0, maxLng: 83.5, district: 'Varanasi', state: 'Uttar Pradesh' },
  { minLat: 27.0, maxLat: 29.0, minLng: 77.5, maxLng: 79.5, district: 'Agra', state: 'Uttar Pradesh' },
  // Rajasthan (Bajra, Mustard)
  { minLat: 26.0, maxLat: 28.0, minLng: 73.0, maxLng: 75.5, district: 'Jodhpur', state: 'Rajasthan' },
  // Karnataka (Maize, Jowar)
  { minLat: 14.5, maxLat: 16.5, minLng: 76.0, maxLng: 78.5, district: 'Bellary', state: 'Karnataka' },
];

// ─── Reverse Geocoding ───────────────────────────────────────────────────────

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeoResult> {
  // 1. Try Nominatim (OpenStreetMap)
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'SATCROP-AgroIntelligence/1.0' },
    });
    if (resp.ok) {
      const data = await resp.json();
      const addr = data.address || {};

      const district =
        addr.county ||
        addr.district ||
        addr.state_district ||
        addr.city ||
        addr.town ||
        addr.village ||
        'Unknown District';

      const state =
        addr.state ||
        'Unknown State';

      return {
        district: district.replace(/ district$/i, '').replace(/ District$/i, ''),
        state,
        village: addr.village || addr.hamlet || addr.suburb || undefined,
        taluka: addr.county || undefined,
        pincode: addr.postcode || undefined,
        displayName: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      };
    }
  } catch (e) {
    console.warn('[GeoService] Nominatim unavailable, using fallback:', e);
  }

  // 2. Fallback: match against known Indian agricultural districts
  for (const region of INDIA_AGRI_DISTRICT_FALLBACK) {
    if (lat >= region.minLat && lat <= region.maxLat &&
        lng >= region.minLng && lng <= region.maxLng) {
      return {
        district: region.district,
        state: region.state,
        displayName: `${region.district}, ${region.state}`,
      };
    }
  }

  // 3. Generic fallback
  return {
    district: 'Jabalpur',
    state: 'Madhya Pradesh',
    displayName: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
  };
}

// ─── One-Shot GPS Fix ─────────────────────────────────────────────────────────

export function getCurrentPosition(preferHighAccuracy = true): Promise<LivePosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation API not supported on this device.'));
      return;
    }

    // Return cached if still fresh (< 30s)
    if (lastPosition && (Date.now() - lastPosition.timestamp) < 30_000 && !preferHighAccuracy) {
      resolve({ ...lastPosition, source: 'cached' });
      return;
    }

    const opts = preferHighAccuracy ? GPS_OPTIONS_HIGH : GPS_OPTIONS_FAST;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const live: LivePosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading ?? undefined,
          speed: pos.coords.speed ?? undefined,
          timestamp: pos.timestamp,
          source: preferHighAccuracy ? 'gps' : 'network',
        };
        lastPosition = live;
        resolve(live);
      },
      (err) => {
        // Fallback to fast on high-accuracy failure
        if (preferHighAccuracy) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const live: LivePosition = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp,
                source: 'network',
              };
              lastPosition = live;
              resolve(live);
            },
            (innerErr) => reject(new Error(getGeoError(innerErr.code))),
            GPS_OPTIONS_FAST
          );
        } else {
          reject(new Error(getGeoError(err.code)));
        }
      },
      opts
    );
  });
}

// ─── Continuous GPS Watcher ──────────────────────────────────────────────────

export function startPositionWatcher(
  onPosition: (pos: LivePosition) => void,
  onError: (err: string) => void
): void {
  if (!navigator.geolocation) {
    onError('Geolocation not supported on this device.');
    return;
  }

  positionCallbacks.push(onPosition);
  errorCallbacks.push(onError);

  if (watcherId !== null) return; // Already watching

  watcherId = navigator.geolocation.watchPosition(
    (pos) => {
      const live: LivePosition = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading ?? undefined,
        speed: pos.coords.speed ?? undefined,
        timestamp: pos.timestamp,
        source: 'gps',
      };
      lastPosition = live;
      positionCallbacks.forEach(cb => cb(live));
    },
    (err) => {
      errorCallbacks.forEach(cb => cb(getGeoError(err.code)));
    },
    GPS_OPTIONS_HIGH
  );
}

export function stopPositionWatcher(onPosition?: (pos: LivePosition) => void): void {
  if (onPosition) {
    positionCallbacks = positionCallbacks.filter(cb => cb !== onPosition);
  }

  if (positionCallbacks.length === 0 && watcherId !== null) {
    navigator.geolocation.clearWatch(watcherId);
    watcherId = null;
  }
}

// ─── Accuracy Label ──────────────────────────────────────────────────────────

export function getAccuracyLabel(accuracyMeters: number): { label: string; color: string } {
  if (accuracyMeters <= 5)   return { label: 'GPS Excellent', color: 'text-emerald-500' };
  if (accuracyMeters <= 15)  return { label: 'GPS High', color: 'text-emerald-400' };
  if (accuracyMeters <= 50)  return { label: 'GPS Good', color: 'text-amber-400' };
  if (accuracyMeters <= 150) return { label: 'GPS Moderate', color: 'text-amber-500' };
  return { label: 'GPS Weak', color: 'text-rose-500' };
}

// ─── Error Messages ──────────────────────────────────────────────────────────

function getGeoError(code: number): string {
  switch (code) {
    case 1: return 'Location permission denied. Please allow location access in your browser settings.';
    case 2: return 'GPS signal unavailable. Please move to an open area and try again.';
    case 3: return 'GPS timed out. Please check your internet or GPS and retry.';
    default: return 'Unknown location error. Please retry.';
  }
}

export const liveGeolocationService = {
  getCurrentPosition,
  startPositionWatcher,
  stopPositionWatcher,
  reverseGeocode,
  getAccuracyLabel,
  getLastPosition: () => lastPosition,
};
