import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Compass, Layers, Crosshair, MapPin, Maximize2, Shield, Eye } from 'lucide-react';
import { api } from '../services/api';
import { LocationSearchResult, BoundaryViewMode } from '../types';

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialDistrict?: string;
  initialState?: string;
  onLocationChange: (location: {
    lat: number;
    lng: number;
    district: string;
    state: string;
    area: number;
    polygon?: any;
  }) => void;
}

// Sub-component to re-center map when props change
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Sub-component to capture user map clicks
const LocationMarker: React.FC<{
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
}> = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          onPositionChange([pos.lat, pos.lng]);
        }
      }}
    >
      <Popup>
        <div className="text-xs font-sans font-medium text-slate-800">
          <div className="font-bold text-brand-700">📍 Field Anchor Point</div>
          <div>Drag pin or click anywhere to reposition</div>
        </div>
      </Popup>
    </Marker>
  );
};

export const MapPicker: React.FC<MapPickerProps> = ({
  initialLat = 23.1815,
  initialLng = 79.9864,
  initialDistrict = 'Jabalpur',
  initialState = 'Madhya Pradesh',
  onLocationChange
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [state, setState] = useState<string>(initialState);
  const [estimatedArea, setEstimatedArea] = useState<number>(2.45);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  
  const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');
  const [boundaryMode, setBoundaryMode] = useState<BoundaryViewMode>('district');
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Fetch boundaries whenever location changes
  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        const res = await api.get('/geo/boundaries', {
          params: { district, state, lat, lng }
        });
        setBoundaryData(res.data);
      } catch (err) {
        console.warn('Boundary fetch fallback:', err);
      }
    };
    fetchBoundaries();
  }, [district, state, lat, lng]);

  // Notify parent of location changes
  useEffect(() => {
    onLocationChange({
      lat,
      lng,
      district,
      state,
      area: estimatedArea,
      polygon: boundaryData?.field_sample_boundary
    });
  }, [lat, lng, district, state, estimatedArea, boundaryData]);

  // Handle search location
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.get('/geo/search', { params: { q: query } });
      setSearchResults(res.data);
      setShowSearchResults(true);
    } catch {
      // Fallback search suggestions
      const presets: LocationSearchResult[] = [
        { name: 'Jabalpur, Madhya Pradesh', district: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
        { name: 'Pune, Maharashtra', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
        { name: 'Ludhiana, Punjab', district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
        { name: 'Indore, Madhya Pradesh', district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
        { name: 'Karnal, Haryana', district: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 }
      ];
      const filtered = presets.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(filtered);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item: LocationSearchResult) => {
    setLat(item.lat);
    setLng(item.lng);
    setDistrict(item.district);
    setState(item.state);
    setSearchQuery(item.name);
    setShowSearchResults(false);
    setZoomLevel(boundaryMode === 'state' ? 7 : (boundaryMode === 'district' ? 10 : 15));
  };

  const handlePositionUpdate = async (pos: [number, number]) => {
    const newLat = parseFloat(pos[0].toFixed(5));
    const newLng = parseFloat(pos[1].toFixed(5));
    setLat(newLat);
    setLng(newLng);

    // Reverse geocode to find district/state
    try {
      const res = await api.get('/geo/reverse', { params: { lat: newLat, lng: newLng } });
      if (res.data.district) {
        setDistrict(res.data.district);
        setState(res.data.state);
      }
    } catch {
      // Fallback: keep existing district
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handlePositionUpdate([pos.coords.latitude, pos.coords.longitude]);
          setZoomLevel(15);
        },
        () => {
          // Default to Jabalpur if permission denied
          handlePositionUpdate([23.1815, 79.9864]);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-950">
      
      {/* Top Search & Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row gap-2">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-lg border border-emerald-100 dark:border-slate-800 px-3 py-2">
            <Search className="w-4 h-4 text-brand-600 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search field location (e.g. Jabalpur, Punjab, Pune)..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400"
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[1100] max-h-60 overflow-y-auto">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSearchResult(item)}
                  className="px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800/50 last:border-none flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.district}, {item.state}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                    {item.lat.toFixed(2)}°, {item.lng.toFixed(2)}°
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls (Locate Me, Layer Toggle, Boundary Mode) */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          
          {/* Boundary Selector (Field / District / State) */}
          <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200 dark:border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => {
                setBoundaryMode('field');
                setZoomLevel(15);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                boundaryMode === 'field'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Field
            </button>
            <button
              onClick={() => {
                setBoundaryMode('district');
                setZoomLevel(10);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                boundaryMode === 'district'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              District
            </button>
            <button
              onClick={() => {
                setBoundaryMode('state');
                setZoomLevel(7);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                boundaryMode === 'state'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              State
            </button>
          </div>

          {/* Layer Toggle (Satellite vs Street) */}
          <button
            onClick={() => setMapLayer(prev => prev === 'satellite' ? 'street' : 'satellite')}
            title="Toggle Map Layer (Satellite / Street)"
            className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 transition-colors"
          >
            <Layers className="w-4 h-4 text-brand-600" />
          </button>

          {/* Current GPS Location */}
          <button
            onClick={handleLocateMe}
            title="Locate Current Position"
            className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 transition-colors"
          >
            <Compass className="w-4 h-4 text-brand-600" />
          </button>

        </div>
      </div>

      {/* Main Leaflet Map View */}
      <MapContainer
        center={[lat, lng]}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={[lat, lng]} zoom={zoomLevel} />
        
        {/* Base Tile Layer */}
        {mapLayer === 'satellite' ? (
          <TileLayer
            attribution='&copy; ESRI World Imagery & Maxar'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* State Boundary Layer */}
        {boundaryMode === 'state' && boundaryData?.state_boundary && (
          <GeoJSON
            key={`state-${state}-${boundaryData.state_boundary.properties.name}`}
            data={boundaryData.state_boundary}
            style={{
              color: '#16a34a',
              weight: 3,
              opacity: 0.85,
              fillColor: '#22c55e',
              fillOpacity: 0.12,
              dashArray: '5, 5'
            }}
          />
        )}

        {/* District Boundary Layer */}
        {boundaryMode === 'district' && boundaryData?.district_boundary && (
          <GeoJSON
            key={`district-${district}-${lat}-${lng}`}
            data={boundaryData.district_boundary}
            style={{
              color: '#15803d',
              weight: 3,
              opacity: 0.95,
              fillColor: '#16a34a',
              fillOpacity: 0.2,
            }}
          />
        )}

        {/* Field Polygon Layer */}
        {boundaryData?.field_sample_boundary && (
          <GeoJSON
            key={`field-${lat}-${lng}`}
            data={boundaryData.field_sample_boundary}
            style={{
              color: '#f59e0b',
              weight: 2.5,
              opacity: 0.9,
              fillColor: '#fbbf24',
              fillOpacity: 0.35,
            }}
          />
        )}

        {/* Interactive Draggable Center Pin */}
        <LocationMarker
          position={[lat, lng]}
          onPositionChange={handlePositionUpdate}
        />
      </MapContainer>

      {/* Bottom Floating Card: Selected Location Details */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3.5 shadow-2xl border border-emerald-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-700 dark:text-brand-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>Selected Field Location</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              {district}, {state}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center space-x-3">
              <span>Lat: {lat.toFixed(4)}° N</span>
              <span>Long: {lng.toFixed(4)}° E</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Est. Area: {estimatedArea} Acres</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Boundary Active</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{boundaryMode} View</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
