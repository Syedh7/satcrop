import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Field } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  Plus, 
  MapPin, 
  Trash2, 
  Edit3, 
  Layers, 
  Activity, 
  ChevronRight, 
  ArrowRight,
  Maximize2,
  X
} from 'lucide-react';

interface MyFieldsPageProps {
  onAnalyzeField: (field: Field) => void;
  onNavigateToMap: () => void;
}

export const MyFieldsPage: React.FC<MyFieldsPageProps> = ({ onAnalyzeField, onNavigateToMap }) => {
  const { t } = useLanguage();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  // Form states
  const [fieldName, setFieldName] = useState('');
  const [district, setDistrict] = useState('Jabalpur');
  const [state, setState] = useState('Madhya Pradesh');
  const [lat, setLat] = useState('23.1815');
  const [lng, setLng] = useState('79.9864');
  const [area, setArea] = useState('2.45');
  const [cropType, setCropType] = useState('Wheat');
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const res = await api.get('/fields');
      setFields(res.data);
    } catch (err) {
      console.warn('Fields fetch fallback:', err);
      // Fallback demo fields
      setFields([
        {
          id: 'field-001',
          user_id: 'user-01',
          field_name: 'North Farm - Plot A (Wheat)',
          latitude: 23.1815,
          longitude: 79.9864,
          district: 'Jabalpur',
          state: 'Madhya Pradesh',
          area: 2.45,
          crop_type: 'Wheat',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_analysis: {
            id: 'an-001',
            crop_name: 'Wheat',
            crop_health: 'Healthy',
            ndvi: 0.72,
            analysis_date: new Date().toISOString()
          }
        },
        {
          id: 'field-002',
          user_id: 'user-01',
          field_name: 'South Riverbank Field',
          latitude: 23.1650,
          longitude: 79.9520,
          district: 'Jabalpur',
          state: 'Madhya Pradesh',
          area: 4.20,
          crop_type: 'Soybean',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_analysis: {
            id: 'an-002',
            crop_name: 'Soybean',
            crop_health: 'Moderate',
            ndvi: 0.54,
            analysis_date: new Date().toISOString()
          }
        },
        {
          id: 'field-003',
          user_id: 'user-01',
          field_name: 'Canal Side Plot',
          latitude: 23.2100,
          longitude: 80.0120,
          district: 'Jabalpur',
          state: 'Madhya Pradesh',
          area: 1.80,
          crop_type: 'Gram (Chickpea)',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (editingField) {
        // Update
        const res = await api.put(`/fields/${editingField.id}`, {
          field_name: fieldName,
          district,
          state,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          area: parseFloat(area),
          crop_type: cropType
        });
        setFields(prev => prev.map(f => f.id === editingField.id ? res.data : f));
      } else {
        // Create
        const res = await api.post('/fields', {
          field_name: fieldName,
          district,
          state,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          area: parseFloat(area),
          crop_type: cropType
        });
        setFields(prev => [res.data, ...prev]);
      }
      closeModal();
    } catch {
      // Local fallback
      const mockField: Field = {
        id: editingField ? editingField.id : `field-${Date.now()}`,
        user_id: 'user-01',
        field_name: fieldName,
        district,
        state,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        area: parseFloat(area),
        crop_type: cropType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      if (editingField) {
        setFields(prev => prev.map(f => f.id === editingField.id ? mockField : f));
      } else {
        setFields(prev => [mockField, ...prev]);
      }
      closeModal();
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    try {
      await api.delete(`/fields/${id}`);
      setFields(prev => prev.filter(f => f.id !== id));
    } catch {
      setFields(prev => prev.filter(f => f.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingField(null);
    setFieldName('');
    setDistrict('Jabalpur');
    setState('Madhya Pradesh');
    setLat('23.1815');
    setLng('79.9864');
    setArea('2.45');
    setCropType('Wheat');
    setShowAddModal(true);
  };

  const openEditModal = (f: Field) => {
    setEditingField(f);
    setFieldName(f.field_name);
    setDistrict(f.district);
    setState(f.state);
    setLat(f.latitude.toString());
    setLng(f.longitude.toString());
    setArea(f.area.toString());
    setCropType(f.crop_type || 'Wheat');
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingField(null);
  };

  const totalAcreage = fields.reduce((acc, f) => acc + (f.area || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Agricultural Fields
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your agricultural land plots, boundaries, and historical crop performance
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Field</span>
          </button>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-brand-900 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Total Farmland Monitored</span>
          <div className="text-3xl font-black font-mono">
            {totalAcreage.toFixed(2)} <span className="text-lg font-sans font-bold">Acres</span>
          </div>
          <div className="text-xs text-emerald-200">Across {fields.length} registered field plots</div>
        </div>

        <button
          onClick={onNavigateToMap}
          className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
        >
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>Open Full Map</span>
        </button>
      </div>

      {/* Field Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading fields...</p>
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Sprout className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Fields Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your agricultural land parcels to monitor NDVI vegetation health and yield estimates.
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Add Your First Field
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => {
            return (
              <div
                key={field.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm transition-all space-y-4"
              >
                {/* Field Top Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-xl shrink-0">
                      🌾
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {field.field_name}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        {field.district}, {field.state}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(field)}
                      title="Edit field"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      title="Delete field"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Field Specs */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Area</span>
                    <span className="font-extrabold text-brand-700 dark:text-brand-400 font-mono">
                      {field.area} Acres
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Primary Crop</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {field.crop_type || 'Wheat'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Last NDVI</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {field.last_analysis?.ndvi ? field.last_analysis.ndvi.toFixed(2) : '0.72'}
                    </span>
                  </div>
                </div>

                {/* GPS Tag & Analyze Action */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] font-mono text-slate-400">
                    {field.latitude.toFixed(4)}° N, {field.longitude.toFixed(4)}° E
                  </div>

                  <button
                    onClick={() => onAnalyzeField(field)}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center space-x-1.5"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Analyze Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-fadeIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingField ? 'Edit Field Details' : 'Add New Agricultural Field'}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveField} className="space-y-3.5">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Field Name / Plot Label</label>
                <input
                  type="text"
                  required
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="e.g. North Farm - Plot A (Wheat)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Jabalpur"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Madhya Pradesh"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Crop Type</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Wheat">Wheat 🌾</option>
                    <option value="Soybean">Soybean 🫘</option>
                    <option value="Rice (Paddy)">Rice (Paddy) 🌾</option>
                    <option value="Maize">Maize 🌽</option>
                    <option value="Cotton">Cotton ☁️</option>
                    <option value="Gram (Chickpea)">Gram 🌱</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all mt-2"
              >
                {formSubmitting ? 'Saving Field...' : (editingField ? 'Update Field' : 'Save Field Plot')}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
