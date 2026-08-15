import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, GeoJSON, useMapEvents, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, 
  Compass, 
  Layers, 
  MapPin, 
  PenTool, 
  RotateCcw, 
  Check, 
  Eye, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';
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

// Vertex Pin Icon for Polygon Drawing
const vertexIcon = new L.DivIcon({
  className: 'custom-vertex-pin',
  html: '<div style="background-color: #f59e0b; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
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

// Geodesic Polygon Area Calculation in Acres
function calculatePolygonAreaInAcres(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 2.45;

  let areaM2 = 0;
  const numPoints = coordinates.length;

  for (let i = 0; i < numPoints; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % numPoints];
    
    // Lat to meters (~111132 m per degree), Lng to meters (~111132 * cos(lat) m per degree)
    const lat1Rad = (p1[0] * Math.PI) / 180;
    const x1 = ((p1[1] * Math.PI) / 180) * 6378137 * Math.cos(lat1Rad);
    const y1 = ((p1[0] * Math.PI) / 180) * 6378137;

    const lat2Rad = (p2[0] * Math.PI) / 180;
    const x2 = ((p2[1] * Math.PI) / 180) * 6378137 * Math.cos(lat2Rad);
    const y2 = ((p2[0] * Math.PI) / 180) * 6378137;

    areaM2 += x1 * y2 - x2 * y1;
  }

  areaM2 = Math.abs(areaM2) / 2.0;
  // 1 Acre = 4046.86 square meters
  const acres = areaM2 / 4046.86;
  return Math.max(0.1, Math.round(acres * 100) / 100);
}

// Sub-component to re-center map
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Sub-component to handle map clicks for pin or polygon drawing
const MapClickHandler: React.FC<{
  isDrawingPolygon: boolean;
  onPositionChange: (pos: [number, number]) => void;
  onAddPolygonPoint: (point: [number, number]) => void;
  position: [number, number];
}> = ({ isDrawingPolygon, onPositionChange, onAddPolygonPoint, position }) => {
  useMapEvents({
    click(e) {
      if (isDrawingPolygon) {
        onAddPolygonPoint([e.latlng.lat, e.latlng.lng]);
      } else {
        onPositionChange([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  if (isDrawingPolygon) return null;

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
          <div className="font-bold text-brand-700">📍 Field Anchor Pin</div>
          <div>Drag pin or click to move anchor</div>
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
  
  // Polygon Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  
  const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');
  const [boundaryMode, setBoundaryMode] = useState<BoundaryViewMode>('district');
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Fetch boundaries on coordinate or region change
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

  // Recalculate area whenever custom polygon points change
  useEffect(() => {
    if (polygonPoints.length >= 3) {
      const calculatedAcres = calculatePolygonAreaInAcres(polygonPoints);
      setEstimatedArea(calculatedAcres);
    }
  }, [polygonPoints]);

  // Notify parent of location & area updates
  useEffect(() => {
    const currentPolygon = polygonPoints.length >= 3 ? {
      type: 'Feature',
      properties: { name: 'Custom Field Polygon', type: 'custom_field' },
      geometry: {
        type: 'Polygon',
        coordinates: [[...polygonPoints.map(p => [p[1], p[0]]), [polygonPoints[0][1], polygonPoints[0][0]]]]
      }
    } : boundaryData?.field_sample_boundary;

    onLocationChange({
      lat,
      lng,
      district,
      state,
      area: estimatedArea,
      polygon: currentPolygon
    });
  }, [lat, lng, district, state, estimatedArea, polygonPoints, boundaryData]);

  // Location search handler
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
    setPolygonPoints([]);
    setZoomLevel(boundaryMode === 'state' ? 7 : (boundaryMode === 'district' ? 10 : 15));
  };

  const handlePositionUpdate = async (pos: [number, number]) => {
    const newLat = parseFloat(pos[0].toFixed(5));
    const newLng = parseFloat(pos[1].toFixed(5));
    setLat(newLat);
    setLng(newLng);

    try {
      const res = await api.get('/geo/reverse', { params: { lat: newLat, lng: newLng } });
      if (res.data.district) {
        setDistrict(res.data.district);
        setState(res.data.state);
      }
    } catch {}
  };

  const handleAddPolygonPoint = (point: [number, number]) => {
    setPolygonPoints(prev => [...prev, point]);
    if (polygonPoints.length === 0) {
      setLat(point[0]);
      setLng(point[1]);
    }
  };

  const handleResetDrawing = () => {
    setPolygonPoints([]);
    setEstimatedArea(2.45);
    setIsDrawing(false);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handlePositionUpdate([pos.coords.latitude, pos.coords.longitude]);
          setZoomLevel(16);
        },
        () => {
          handlePositionUpdate([23.1815, 79.9864]);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950">
      
      {/* Top Search & Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row gap-2">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 dark:border-slate-800 px-3.5 py-2.5">
            <Search className="w-4 h-4 text-brand-600 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search agricultural location (e.g. Jabalpur, Punjab, Pune)..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400 font-medium"
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[1100] max-h-60 overflow-y-auto">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSearchResult(item)}
                  className="px-4 py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800/50 last:border-none flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.district}, {item.state}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                    {item.lat.toFixed(2)}°, {item.lng.toFixed(2)}°
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          
          {/* Custom Polygon Boundary Draw Mode Toggle */}
          <button
            onClick={() => setIsDrawing(!isDrawing)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold shadow-xl backdrop-blur-md transition-all flex items-center space-x-1.5 border ${
              isDrawing
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/50 animate-pulse'
                : 'bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-amber-50'
            }`}
            title="Click to draw custom field boundary polygon"
          >
            <PenTool className="w-4 h-4" />
            <span>{isDrawing ? 'Drawing... (Click Points)' : 'Draw Boundary'}</span>
          </button>

          {/* Reset Polygon Button */}
          {polygonPoints.length > 0 && (
            <button
              onClick={handleResetDrawing}
              className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-xl hover:bg-rose-600 transition-colors"
              title="Reset drawn field boundary"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Boundary Selector (Field / District / State) */}
          <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-1 shadow-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => {
                setBoundaryMode('field');
                setZoomLevel(15);
              }}
              className={`px-2.5 py-1.5 rounded-xl transition-all ${
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
              className={`px-2.5 py-1.5 rounded-xl transition-all ${
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
              className={`px-2.5 py-1.5 rounded-xl transition-all ${
                boundaryMode === 'state'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              State
            </button>
          </div>

          {/* Satellite Layer Toggle */}
          <button
            onClick={() => setMapLayer(prev => prev === 'satellite' ? 'street' : 'satellite')}
            className="p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 transition-colors"
            title="Toggle Satellite Imagery"
          >
            <Layers className="w-4 h-4 text-brand-600" />
          </button>

          {/* Locate Me */}
          <button
            onClick={handleLocateMe}
            className="p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 transition-colors"
            title="Locate Current Position"
          >
            <Compass className="w-4 h-4 text-brand-600" />
          </button>

        </div>
      </div>

      {/* Main Leaflet Map */}
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
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; OpenStreetMap'
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
              opacity: 0.9,
              fillColor: '#22c55e',
              fillOpacity: 0.15,
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
              fillOpacity: 0.22,
            }}
          />
        )}

        {/* User Drawn Custom Polygon with Live NDVI Spectral Draped Look */}
        {polygonPoints.length >= 3 && (
          <Polygon
            positions={polygonPoints}
            pathOptions={{
              color: '#f59e0b',
              weight: 3,
              fillColor: '#22c55e',
              fillOpacity: 0.45,
            }}
          >
            <Tooltip permanent direction="center" className="custom-polygon-tooltip">
              <span className="font-bold text-xs font-mono">{estimatedArea} Acres</span>
            </Tooltip>
          </Polygon>
        )}

        {/* User Drawn Polygon Vertex Markers */}
        {isDrawing && polygonPoints.map((pt, idx) => (
          <Marker key={idx} position={pt} icon={vertexIcon} />
        ))}

        {/* Default Field Geometry if no custom polygon drawn */}
        {polygonPoints.length < 3 && boundaryData?.field_sample_boundary && (
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

        {/* Click & Pin Handling */}
        <MapClickHandler
          isDrawingPolygon={isDrawing}
          position={[lat, lng]}
          onPositionChange={handlePositionUpdate}
          onAddPolygonPoint={handleAddPolygonPoint}
        />
      </MapContainer>

      {/* Bottom Floating Card */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-emerald-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-brand-600 flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
              📍
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-brand-700 dark:text-brand-400">
                Selected Field Coordinates
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {district}, {state}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-3">
                <span>Lat: {lat.toFixed(4)}° N</span>
                <span>Long: {lng.toFixed(4)}° E</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {estimatedArea} Acres (~{(estimatedArea * 0.4047).toFixed(2)} Ha / {(estimatedArea * 1.6).toFixed(1)} Bigha)
                </span>
              </div>
            </div>
          </div>

          {isDrawing && (
            <div className="text-right">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block animate-pulse">
                Polygon Drawing Active ({polygonPoints.length} Points)
              </span>
              <button
                onClick={() => setIsDrawing(false)}
                className="mt-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Done Drawing
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
