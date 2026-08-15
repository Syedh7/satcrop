export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  district?: string;
  state?: string;
  language?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Field {
  id: string;
  user_id: string;
  field_name: string;
  latitude: number;
  longitude: number;
  polygon_geojson?: string;
  district: string;
  state: string;
  area: number;
  crop_type?: string;
  created_at: string;
  updated_at: string;
  last_analysis?: {
    id: string;
    crop_name: string;
    crop_health: string;
    ndvi: number;
    analysis_date: string;
  };
}

export interface Analysis {
  id: string;
  user_id: string;
  field_id?: string;
  crop_name: string;
  crop_health: 'Healthy' | 'Moderate' | 'Poor';
  growth_stage: string;
  ndvi: number;
  ndre?: number;
  evi?: number;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  polygon_geojson?: string;
  field_area: number;
  estimated_harvest: number;
  harvest_unit: string;
  confidence_score: number;
  health_explanation?: string;
  advisory_irrigation?: string;
  advisory_fertilizer?: string;
  advisory_pest?: string;
  weather_temp?: number;
  weather_condition?: string;
  weather_humidity?: number;
  weather_rain_chance?: number;
  source: string;
  satellite_tile_url?: string;
  analysis_date: string;
  created_at: string;
}

export interface DashboardStats {
  total_fields: number;
  total_acreage: number;
  healthy_percent: number;
  moderate_percent: number;
  poor_percent: number;
  healthy_count: number;
  moderate_count: number;
  poor_count: number;
  recent_analyses: Analysis[];
  current_location: {
    district: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    rain_probability: number;
    wind_speed: string;
  };
}

export interface LocationSearchResult {
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export type BoundaryViewMode = 'none' | 'field' | 'district' | 'state';
