import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, Car, Search, Camera, X, Loader2, Users, ArrowRight, Bookmark, Star, AlertCircle, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../contexts/AppContext';
import type { SearchEntry } from '../contexts/AppContext';

type VehicleType = 'truck' | 'car';

interface SearchResult {
  id: number;
  partName: string;
  partNumber: string;
  supplier: string;
  price: string;
  rating: number;
  availability: string;
  image: string;
  description?: string;
  compatibility?: string;
  reviewsCount?: number;
  sourceUrl?: string;
}

export default function SearchForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { incrementSearches } = useAppContext();
  
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  
  const [vehicleType, setVehicleType] = useState<VehicleType>('truck');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');
  const [vin, setVin] = useState('');
  const [isDecodingVin, setIsDecodingVin] = useState(false);
  const [partQuery, setPartQuery] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { searchHistory, setSearchHistory } = useAppContext();

  const handleVinDecode = async () => {
    if (!vin || vin.length !== 17) return;
    setIsDecodingVin(true);
    try {
      const { decodeVin } = await import('../services/geminiService');
      const details = await decodeVin(vin);
      if (details) {
        if (details.make) setMake(details.make);
        if (details.model) setModel(details.model);
        if (details.year) setYear(details.year);
        if (details.engine) setEngine(details.engine);
        // We could also try to determine vehicle type based on make/model
      }
    } catch (error) {
      console.error('Failed to decode VIN:', error);
    } finally {
      setIsDecodingVin(false);
    }
  };

  const commonParts = [
    'Air Brake Compressor', 'Turbocharger Assembly', 'Fuel Injector Set', 
    'Alternator', 'Starter Motor', 'Water Pump', 'Radiator', 
    'Brake Pads', 'Rotors', 'Transmission Fluid Filter'
  ];

  const filteredSuggestions = commonParts.filter(part => 
    part.toLowerCase().includes(partQuery.toLowerCase()) && partQuery.length > 0
  );

  const handleClearAll = () => {
    setVehicleType('truck');
    setMake('');
    setModel('');
    setYear('');
    setEngine('');
    setPartQuery('');
    removePhoto();
  };

  // Pre-fill from location state (from Inventory page)
  useEffect(() => {
    if (location.state) {
      const { type, make, model, year, engine } = location.state;
      if (type) setVehicleType(type);
      if (make) setMake(make);
      if (model) setModel(model);
      if (year) setYear(year);
      if (engine) setEngine(engine);
    }
  }, [location.state]);

  const truckMakes = ['Freightliner', 'Kenworth', 'Peterbilt', 'Mack', 'Volvo', 'International', 'Western Star'];
  const carMakes = ['Ford', 'Chevrolet', 'Toyota', 'Honda', 'Dodge', 'RAM', 'GMC'];
  const makes = vehicleType === 'truck' ? truckMakes : carMakes;

  const years = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => (2026 - i).toString());

  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicleType(type);
    setMake(''); // Reset make when switching type
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        setPhotoPreview(reader.result as string);
        setIsAnalyzingPhoto(true);
        
        try {
          const base64 = (reader.result as string).split(',')[1];
          const response = await fetch('/api/ai/analyze-photo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token') ? JSON.parse(localStorage.getItem('supabase.auth.token') || '{}').currentSession?.access_token : ''}`
            },
            body: JSON.stringify({
              imageBase64: base64,
              mimeType: file.type,
              filename: file.name
            })
          });
          
          let data;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
          } else {
            const text = await response.text();
            console.error("Non-JSON response:", text);
            throw new Error("Server returned an invalid response. Please try again later.");
          }
          
          if (!response.ok) {
            throw new Error(data.error || 'Analysis failed');
          }
          
          setPartQuery(data.result);
        } catch (e) {
          console.error('AI Analysis error:', e);
          setPartQuery('Heavy Duty Brake Caliper'); // Fallback
        } finally {
          setIsAnalyzingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !year || !partQuery) return;

    setIsSearching(true);
    incrementSearches();
    
    const newSearch: SearchEntry = {
      query: partQuery,
      vehicleInfo: `${year} ${make} ${model}`,
      timestamp: new Date().toISOString()
    };
    setSearchHistory(prev => [newSearch, ...prev].slice(0, 5));

    setTimeout(() => {
      setIsSearching(false);
      navigate('/results', {
        state: {
          vehicleType,
          make,
          model,
          year,
          engine,
          vin,
          partQuery,
          hasPhoto: !!photo
        }
      });
    }, 1500);
  };

  if (currentUser?.role === 'director') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="tactile-card p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <Users size={40} className="text-zinc-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-black text-white">Search Not Available</h2>
            <p className="text-zinc-400 font-medium">Director accounts cannot perform searches. Add workers to your team.</p>
          </div>
          <button 
            onClick={() => navigate('/workers')}
            className="tactile-btn-light px-8 py-4 text-sm group"
          >
            Manage Workers
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  const isFormValid = make && year && partQuery;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-display font-black text-white tracking-tighter">Find Your Part</h1>
        <p className="text-zinc-400 font-medium">Search across 40+ global suppliers in seconds.</p>
      </div>

      <form onSubmit={handleSearch} className="tactile-card p-8 lg:p-12 space-y-10">
        {/* VIN Search */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Quick VIN Search</label>
          <div className="relative group">
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter 17-digit VIN"
              className="tactile-input w-full py-4 px-4 font-mono uppercase tracking-widest"
              maxLength={17}
            />
            <button
              type="button"
              onClick={handleVinDecode}
              disabled={vin.length !== 17 || isDecodingVin}
              className="absolute right-2 top-1/2 -translate-y-1/2 tactile-btn-dark py-2 px-4 text-[10px] font-black uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
            >
              {isDecodingVin ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              Decode
            </button>
          </div>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
            <span className="bg-surface px-4 text-zinc-500">Or Enter Details Manually</span>
          </div>
        </div>

        {/* Vehicle Type Toggle */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Vehicle Category</label>
          <div className="flex p-2 bg-white/5 rounded-2xl border border-white/10 gap-2">
            <button
              type="button"
              onClick={() => handleVehicleTypeChange('truck')}
              className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                vehicleType === 'truck' ? 'bg-white/10 text-white shadow-glow border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Truck size={20} />
              <span className="font-black uppercase tracking-widest text-xs">Truck</span>
            </button>
            <button
              type="button"
              onClick={() => handleVehicleTypeChange('car')}
              className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                vehicleType === 'car' ? 'bg-white/10 text-white shadow-glow border border-white/10' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Car size={20} />
              <span className="font-black uppercase tracking-widest text-xs">Car</span>
            </button>
          </div>
        </div>

        {/* Vehicle Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Make</label>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="tactile-input w-full py-4 px-4 appearance-none"
              required
            >
              <option value="" disabled>Select Make</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Cascadia, F-150"
              className="tactile-input w-full py-4 px-4"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="tactile-input w-full py-4 px-4 appearance-none"
              required
            >
              <option value="" disabled>Select Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Engine Type</label>
            <input
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              placeholder="Optional — e.g. Cummins ISX15"
              className="tactile-input w-full py-4 px-4"
            />
          </div>
        </div>

        {/* Part Search Input */}
        <div className="space-y-2 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">What part are you looking for?</label>
            <button 
              type="button" 
              onClick={handleClearAll}
              className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear All
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={24} />
            <input
              type="text"
              value={partQuery}
              onChange={(e) => {
                setPartQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Air Brake Compressor, Part# 5018485X, Turbo..."
              className="tactile-input w-full py-6 pl-16 pr-6 text-lg"
              required
            />
          </div>
          
          {/* Auto-suggest Dropdown */}
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && make && model && year && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="p-2 bg-brand-primary/10 border-b border-white/5">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} /> Compatible with {year} {make} {model}
                  </p>
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setPartQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Recently Searched */}
          {searchHistory.length > 0 && !partQuery && (
            <div className="pt-4">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 mb-2">Recently Searched</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setPartQuery(search.query);
                      // Optionally parse vehicleInfo back into make/model/year if needed
                    }}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Search size={10} />
                    {search.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Photo Upload Zone */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Photo Reference (Optional)</label>
          <div 
            onClick={() => !isAnalyzingPhoto && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (isAnalyzingPhoto) return;
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                setPhoto(file);
                const reader = new FileReader();
                reader.onloadend = async () => {
                  setPhotoPreview(reader.result as string);
                  setIsAnalyzingPhoto(true);
                  
                  try {
                    const base64 = (reader.result as string).split(',')[1];
                    const response = await fetch('/api/ai/analyze-photo', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token') ? JSON.parse(localStorage.getItem('supabase.auth.token') || '{}').currentSession?.access_token : ''}`
                      },
                      body: JSON.stringify({
                        imageBase64: base64,
                        mimeType: file.type,
                        filename: file.name
                      })
                    });
                    
                    let data;
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                      data = await response.json();
                    } else {
                      const text = await response.text();
                      console.error("Non-JSON response:", text);
                      throw new Error("Server returned an invalid response. Please try again later.");
                    }
                    
                    if (!response.ok) {
                      throw new Error(data.error || 'Analysis failed');
                    }
                    
                    setPartQuery(data.result);
                  } catch (e) {
                    console.error('AI Analysis error:', e);
                    setPartQuery('Heavy Duty Brake Caliper'); // Fallback
                  } finally {
                    setIsAnalyzingPhoto(false);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
            className={`tactile-card h-48 border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all relative overflow-hidden group ${
              photoPreview ? 'border-brand-primary/50' : 'border-white/10 hover:border-white/30'
            } ${isAnalyzingPhoto ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" disabled={isAnalyzingPhoto} />
            
            {isAnalyzingPhoto ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-brand-primary" size={32} />
                <p className="font-black text-white uppercase tracking-widest text-xs">Gemini AI Analyzing...</p>
              </div>
            ) : photoPreview ? (
              <div className="relative w-full h-full">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-contain p-4" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                  className="absolute top-4 right-4 p-2 bg-brand-primary text-white rounded-xl hover:shadow-glow transition-all z-10"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:shadow-glow transition-all">
                  <Camera size={32} className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <div className="text-center">
                  <p className="font-black text-white uppercase tracking-widest text-xs">AI will identify the part from your photo (optional)</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Drag & drop or click to upload</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isFormValid || isSearching}
            className={`tactile-btn-light w-full py-6 text-xl flex items-center justify-center gap-3 transition-all ${
              !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSearching ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Searching 40+ Suppliers...</span>
              </>
            ) : (
              <>
                <Search size={24} />
                <span>Find Parts Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function PartCardSkeleton() {
  return (
    <div className="tactile-card p-10 border-white/10">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-4 flex-1">
          <div className="flex gap-3">
            <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-3/4 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-1/2 bg-white/5 rounded-md animate-pulse" />
        </div>
        <div className="text-right space-y-2">
          <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse ml-auto" />
          <div className="h-4 w-16 bg-white/5 rounded-md animate-pulse ml-auto" />
        </div>
      </div>
      <div className="space-y-2 mb-10">
        <div className="h-4 w-full bg-white/5 rounded-md animate-pulse" />
        <div className="h-4 w-5/6 bg-white/5 rounded-md animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-8 border-t border-white/10">
        <div className="h-6 w-40 bg-white/5 rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

function VehicleTypeCard({ type, icon, title, desc, onClick }: { type: string, icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="tactile-card p-6 lg:p-10 flex flex-col items-center justify-center gap-4 lg:gap-6 border-white/10 group"
    >
      <div className="p-4 lg:p-6 rounded-full bg-white/5 shadow-glass border border-white/10 group-hover:shadow-glow transition-all">
        {React.cloneElement(icon as React.ReactElement, { className: 'text-white size-8 lg:size-12' })}
      </div>
      <div className="text-center">
        <h3 className="text-xl lg:text-2xl font-display font-black mb-1 lg:mb-2 text-white">{title}</h3>
        <p className="text-[10px] lg:text-xs text-zinc-400 font-medium">{desc}</p>
      </div>
      <div className="mt-2 lg:mt-3 flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] lg:text-xs">
        Select Mode <ArrowRight size={14} className="lg:size-4" />
      </div>
    </motion.button>
  );
}

function ModeTab({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-6 py-2 lg:py-2.5 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
        active ? 'bg-white/20 text-white shadow-glow' : 'text-zinc-400 hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function VinDetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-white truncate">{value}</p>
    </div>
  );
}

function PartCard({ part, onViewDetails, onToggleSave, isSaved }: { part: SearchResult, onViewDetails: () => void, onToggleSave: () => void, isSaved: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="tactile-card p-5 lg:p-10 border-white/10 group relative flex flex-col h-full"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
        className={`absolute top-3 lg:top-6 right-3 lg:right-6 p-2 lg:p-3 rounded-xl transition-all z-10 ${
          isSaved ? 'bg-brand-primary text-white shadow-glow' : 'bg-white/5 shadow-glass border border-white/10 text-zinc-400 hover:text-white'
        }`}
      >
        <Bookmark size={14} className={isSaved ? 'fill-white' : ''} />
      </button>

      <div className="flex flex-col justify-between items-start mb-4 lg:mb-8 pr-8 lg:pr-12 gap-3 lg:gap-0 flex-1">
        <div>
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
            <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-white bg-brand-primary px-2 lg:px-4 py-0.5 lg:py-1.5 rounded-full shadow-glow">
              {part.supplier}
            </span>
            <div className="flex items-center gap-1 lg:gap-1.5 px-1.5 lg:px-3 py-0.5 lg:py-1 bg-white/5 shadow-glass border border-white/10 rounded-full">
              <Star size={8} className="text-amber-500 fill-amber-500 lg:size-2.5" />
              <span className="text-[8px] lg:text-[10px] font-black text-white">{part.rating.toFixed(1)}</span>
            </div>
          </div>
          <h4 className="text-base lg:text-2xl font-display font-black text-white group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight">{part.partName}</h4>
          <p className="text-[10px] lg:text-sm text-zinc-500 font-mono font-bold mt-1 uppercase tracking-tighter lg:tracking-widest">{part.partNumber}</p>
        </div>
        <div className="lg:text-right w-full lg:w-auto flex lg:flex-col justify-between items-center lg:items-end mt-2 lg:mt-0">
          <p className="text-xl lg:text-3xl font-display font-black text-white">{part.price}</p>
          <p className={`text-[8px] lg:text-[10px] font-black uppercase tracking-widest ${
            part.availability === 'In Stock' ? 'text-emerald-500' : part.availability === 'Low Stock' ? 'text-amber-500' : 'text-red-500'
          }`}>
            {part.availability}
          </p>
        </div>
      </div>

      <p className="text-zinc-400 text-[11px] lg:text-sm font-medium mb-4 lg:mb-10 line-clamp-2 leading-relaxed">{part.description}</p>

      <div className="flex items-end justify-between pt-4 lg:pt-8 border-t border-white/10 gap-4 mt-auto">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[8px] lg:text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">
            <AlertCircle size={10} className="text-white lg:size-3" />
            <span>Compatibility</span>
          </div>
          <p className="text-[10px] lg:text-sm font-black text-white truncate">
            {part.compatibility}
          </p>
        </div>
        <button 
          onClick={onViewDetails}
          className="tactile-btn-dark px-5 lg:px-8 py-2.5 lg:py-3.5 text-[10px] lg:text-xs group shrink-0"
        >
          Details
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

function PartDetailsModal({ part, onClose, groundingMetadata, onToggleSave, isSaved }: { part: SearchResult | null, onClose: () => void, groundingMetadata: any, onToggleSave: (p: SearchResult) => void, isSaved: boolean }) {
  if (!part) return null;

  const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web).filter(Boolean) || [];

  const cleanUrl = (url: string) => {
    if (!url) return '';
    let cleaned = url.trim().replace(/^["']|["']$/g, '');
    return cleaned.startsWith('http') ? cleaned : `https://${cleaned}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="tactile-card w-full max-w-3xl max-h-[90vh] overflow-y-auto border-white/10 relative"
        >
          <div className="absolute top-6 right-6 flex gap-3 z-10">
            <button 
              onClick={() => onToggleSave(part)}
              className={`p-3 rounded-2xl transition-all ${
                isSaved ? 'bg-brand-primary text-white shadow-glow' : 'bg-white/5 shadow-glass border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <Bookmark size={20} className={isSaved ? 'fill-white' : ''} />
            </button>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/5 shadow-glass border border-white/10 text-white hover:text-brand-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 lg:p-12 space-y-6 lg:space-y-12">
            <header>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-3 lg:mb-6">
                <span className="text-[8px] lg:text-xs font-black uppercase tracking-[0.2em] text-white bg-brand-primary px-3 lg:px-6 py-1 lg:py-2 rounded-full shadow-glow">
                  {part.supplier}
                </span>
                <div className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 bg-white/5 shadow-glass border border-white/10 rounded-full">
                  <Star size={10} className="text-amber-500 fill-amber-500 lg:size-3" />
                  <span className="text-[9px] lg:text-xs font-black text-white">{part.rating.toFixed(1)}</span>
                  <span className="text-[9px] lg:text-xs font-bold text-zinc-500">({part.reviewsCount} reviews)</span>
                </div>
              </div>
              <h2 className="text-2xl lg:text-5xl font-display font-black text-white tracking-tighter leading-tight mb-1 lg:mb-4">{part.partName}</h2>
              <p className="text-sm lg:text-xl text-zinc-500 font-mono font-bold tracking-widest uppercase">{part.partNumber}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
              <div className="space-y-4 lg:space-y-8">
                <div className="p-5 lg:p-8 rounded-xl lg:rounded-3xl bg-white/5 shadow-glass border border-white/10">
                  <p className="text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 lg:mb-4">Technical Description</p>
                  <p className="text-[13px] lg:text-base text-zinc-400 leading-relaxed font-medium">{part.description}</p>
                </div>
                <div className="p-5 lg:p-8 rounded-xl lg:rounded-3xl bg-white/5 shadow-glass border border-white/10">
                  <p className="text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 lg:mb-4">Compatibility Verification</p>
                  <div className="flex items-center gap-2 lg:gap-3 text-white font-black text-[13px] lg:text-base">
                    <CheckCircle2 className="text-emerald-500 shrink-0 lg:size-4.5" size={16} />
                    <span>{part.compatibility}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:space-y-8">
                <div className="p-5 lg:p-8 rounded-xl lg:rounded-3xl bg-brand-primary/10 border border-brand-primary/20 shadow-glow">
                  <p className="text-[8px] lg:text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 lg:mb-4">Pricing & Availability</p>
                  <div className="flex items-baseline gap-1.5 lg:gap-2 mb-1 lg:mb-2">
                    <span className="text-3xl lg:text-5xl font-display font-black text-brand-primary">{part.price}</span>
                    <span className="text-[8px] lg:text-xs font-bold text-zinc-500 uppercase">USD</span>
                  </div>
                  <p className={`text-[10px] lg:text-xs font-black uppercase tracking-widest ${
                    part.availability === 'In Stock' ? 'text-emerald-500' : part.availability === 'Low Stock' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {part.availability} • Verified Real-time
                  </p>
                </div>

                {sources.length > 0 && (
                  <div className="p-5 lg:p-8 rounded-xl lg:rounded-3xl bg-white/5 shadow-glass border border-white/10">
                    <p className="text-[8px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 lg:mb-6 flex items-center gap-2">
                      <Search size={10} /> Verified Sources
                    </p>
                    <div className="space-y-2 lg:space-y-4">
                      {sources.map((source: any, i: number) => (
                        <a 
                          key={i}
                          href={cleanUrl(source.uri)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 lg:p-4 rounded-lg lg:rounded-xl hover:bg-white/10 transition-colors group border border-transparent hover:border-white/20"
                        >
                          <span className="text-[10px] lg:text-xs font-bold text-white truncate max-w-[120px] lg:max-w-[200px]">{source.title || source.uri}</span>
                          <ArrowRight size={10} className="text-zinc-500 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 lg:pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 lg:gap-6">
              {part.sourceUrl ? (
                <a 
                  href={cleanUrl(part.sourceUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactile-btn-dark flex-1 py-4 lg:py-6 text-base lg:text-lg flex items-center justify-center gap-3"
                >
                  <ExternalLink size={18} />
                  View on Site
                </a>
              ) : (
                <button className="tactile-btn-dark flex-1 py-4 lg:py-6 text-base lg:text-lg">
                  Add to Procurement
                </button>
              )}
              <button className="tactile-btn-dark bg-white/10 border-white/10 px-6 lg:px-10 py-4 lg:py-6 text-base lg:text-lg">
                Contact Supplier
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
