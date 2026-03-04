import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, Truck, Search, Camera, X, Info, Hash, FileText, Loader2, CheckCircle2, AlertCircle, ArrowRight, ChevronRight, Star, Bookmark, ExternalLink, Grid, ChevronDown, Activity, Cpu, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchParts, SearchResult, SearchResponse, decodeVin, VinDetails } from '../services/geminiService';
import { PART_CATEGORIES, PartCategory } from '../constants';

type VehicleType = 'car' | 'truck';
type SearchMode = 'visual' | 'quick' | 'detailed' | 'vin' | 'manual';

export default function SearchForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('quick');
  const [isSearching, setIsSearching] = useState(false);
  const [isDecodingVin, setIsDecodingVin] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [selectedPart, setSelectedPart] = useState<SearchResult | null>(null);
  const [vinDetails, setVinDetails] = useState<VinDetails | null>(null);
  const [searchTries, setSearchTries] = useState(() => {
    const saved = localStorage.getItem('owner_search_tries');
    return saved ? parseInt(saved) : 5;
  });
  const userRole = localStorage.getItem('userRole');
  const isOwner = userRole === 'owner';

  const [selectedCategory, setSelectedCategory] = useState<PartCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    partNumber: '',
    vin: '',
    description: '',
    make: '',
    model: '',
    year: '',
    motor: '',
    vehicleSearch: '', // Unified VIN or Name
  });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setFormData(prev => ({ ...prev, partNumber: query }));
      setVehicleType('car'); // Default to car for quick search from topbar
      setSearchMode('quick');
      
      // Trigger search
      const triggerSearch = async () => {
        setIsSearching(true);
        try {
          const response = await searchParts({
            vehicleType: 'car',
            partNumber: query,
            description: '',
            make: '',
            model: '',
            year: '',
            motor: '',
            vehicle: ''
          });
          setResults(response.results);
          setGroundingMetadata(response.groundingMetadata);
          
          if (isOwner) {
            const newTries = Math.max(0, searchTries - 1);
            setSearchTries(newTries);
            localStorage.setItem('owner_search_tries', newTries.toString());
          }
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      };
      
      triggerSearch();
      
      // Clear the query param so it doesn't re-trigger on refresh
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'vin') {
      setVinDetails(null);
    }
  };

  const handleDecodeVin = async () => {
    if (!formData.vin || formData.vin.length < 11) return;
    setIsDecodingVin(true);
    try {
      const details = await decodeVin(formData.vin);
      setVinDetails(details);
    } catch (error) {
      console.error("VIN Decode failed:", error);
    } finally {
      setIsDecodingVin(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOwner && searchTries <= 0) {
      alert("You have used all your 5 free trial searches. Please upgrade your plan to continue.");
      return;
    }

    setIsSearching(true);
    setResults(null);

    try {
      const response = await searchParts({
        vehicleType: vehicleType || undefined,
        partNumber: formData.partNumber,
        description: formData.description,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        motor: formData.motor,
        vin: formData.vin || (formData.vehicleSearch.length >= 11 ? formData.vehicleSearch : undefined),
        vehicle: formData.vehicleSearch,
        image: photoPreview || undefined
      });
      setResults(response.results);
      setGroundingMetadata(response.groundingMetadata);
      
      if (isOwner) {
        const newTries = searchTries - 1;
        setSearchTries(newTries);
        localStorage.setItem('owner_search_tries', newTries.toString());
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setResults(null);
    setGroundingMetadata(null);
    setSelectedPart(null);
    setFormData({
      partNumber: '',
      vin: '',
      description: '',
      make: '',
      model: '',
      year: '',
      motor: '',
    });
    removePhoto();
  };

  const toggleSavePart = (part: SearchResult) => {
    const saved = localStorage.getItem('saved_parts');
    let savedParts: SearchResult[] = saved ? JSON.parse(saved) : [];
    
    const isSaved = savedParts.some(p => p.partNumber === part.partNumber);
    
    if (isSaved) {
      savedParts = savedParts.filter(p => p.partNumber !== part.partNumber);
    } else {
      savedParts.push(part);
    }
    
    localStorage.setItem('saved_parts', JSON.stringify(savedParts));
    // Force re-render if needed, but since it's local storage we might just rely on the icon state check
    window.dispatchEvent(new Event('storage')); 
  };

  const isPartSaved = (partNumber: string) => {
    const saved = localStorage.getItem('saved_parts');
    const savedParts: SearchResult[] = saved ? JSON.parse(saved) : [];
    return savedParts.some(p => p.partNumber === partNumber);
  };

  if (!vehicleType) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 lg:gap-8 max-w-4xl mx-auto px-4 lg:px-2"
      >
        <div className="text-center mb-4 lg:hidden">
          <h1 className="text-3xl font-display font-black text-white tracking-tighter">Select Vehicle</h1>
          <p className="text-zinc-400 text-sm font-medium">Choose your category to begin sourcing</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <VehicleTypeCard 
            type="car" 
            icon={<Car size={32} className="lg:size-12" />} 
            title="Passenger Car" 
            desc="Sedans, SUVs, Light Vehicles" 
            onClick={() => setVehicleType('car')} 
          />
          <VehicleTypeCard 
            type="truck" 
            icon={<Truck size={32} className="lg:size-12" />} 
            title="Commercial Truck" 
            desc="Heavy Duty, Fleet Vehicles" 
            onClick={() => setVehicleType('truck')} 
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 lg:space-y-6 pb-32 lg:pb-8 px-3 lg:px-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="tactile-card overflow-hidden border-white/10 rounded-3xl lg:rounded-2xl"
      >
        {/* Header & Mode Switcher */}
        <div className="p-4 lg:p-6 border-b border-white/10 bg-white/5 flex flex-col gap-4 lg:gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="p-2.5 lg:p-3 rounded-xl bg-white/5 shadow-glass border border-white/10">
                {vehicleType === 'car' ? <Car className="text-white" size={18} /> : <Truck className="text-white" size={18} />}
              </div>
              <div>
                <h2 className="text-base lg:text-xl font-display font-black text-white">Universal Finder</h2>
                <div className="flex items-center gap-2">
                  <p className="text-zinc-500 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest">Sourcing for {vehicleType === 'car' ? 'Passenger' : 'Commercial'}</p>
                  {isOwner && (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${searchTries > 0 ? 'bg-brand-primary/20 text-brand-primary' : 'bg-danger/20 text-danger'}`}>
                      {searchTries} Tries Left
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => setVehicleType(null)} className="tactile-btn-dark px-3 lg:px-6 py-1.5 lg:py-2 text-[8px] lg:text-[10px] font-black uppercase tracking-widest">
              <X size={10} /> RESET
            </button>
          </div>

          <div className="flex bg-white/5 p-1 lg:p-2 rounded-xl lg:rounded-2xl shadow-glass border border-white/10 overflow-x-auto gap-1 lg:gap-2 scroll-smooth no-scrollbar">
            <ModeTab active={searchMode === 'quick'} onClick={() => setSearchMode('quick')} icon={<Hash size={12} />} label="Quick" />
            <ModeTab active={searchMode === 'vin'} onClick={() => setSearchMode('vin')} icon={<FileText size={12} />} label="VIN" />
            <ModeTab active={searchMode === 'visual'} onClick={() => setSearchMode('visual')} icon={<Camera size={12} />} label="Vision" />
            <ModeTab active={searchMode === 'manual'} onClick={() => setSearchMode('manual')} icon={<Grid size={12} />} label="Browse" />
            <ModeTab active={searchMode === 'detailed'} onClick={() => setSearchMode('detailed')} icon={<FileText size={12} />} label="Detailed" />
          </div>

          {/* Unified Vehicle Bar */}
          <div className="space-y-2 lg:space-y-4">
            <label className="text-[9px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 lg:ml-2 flex items-center gap-2">
              <Car size={10} /> Vehicle Identification
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
              <input
                type="text"
                name="vehicleSearch"
                value={formData.vehicleSearch}
                onChange={handleInputChange}
                placeholder="VIN or Vehicle Name"
                className="tactile-input pl-11 pr-20 lg:pr-32 py-3 lg:py-4 text-[11px] lg:text-base"
              />
              {formData.vehicleSearch.length >= 11 && !vinDetails && (
                <button 
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, vin: formData.vehicleSearch }));
                    handleDecodeVin();
                  }}
                  className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 px-2 py-1 lg:px-3 lg:py-2 rounded-lg bg-brand-primary text-white text-[8px] lg:text-[10px] font-black uppercase tracking-widest hover:shadow-glow transition-all"
                >
                  DECODE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="p-4 lg:p-8 space-y-4 lg:space-y-10 relative overflow-hidden">
          {isSearching && (
            <motion.div 
              initial={{ top: '-100%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-brand-primary shadow-glow z-20 pointer-events-none"
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-7 space-y-8">
              {searchMode === 'quick' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Part Number</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                    <input
                      type="text"
                      name="partNumber"
                      value={formData.partNumber}
                      onChange={handleInputChange}
                      placeholder="Enter part number (e.g. 12345-ABC)"
                      className="tactile-input pl-12"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {searchMode === 'vin' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">VIN Number</label>
                    <div className="flex gap-4">
                      <div className="relative group flex-1">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                        <input
                          type="text"
                          name="vin"
                          value={formData.vin}
                          onChange={handleInputChange}
                          placeholder="Enter 17-character VIN"
                          className="tactile-input pl-12"
                          required
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleDecodeVin}
                        disabled={isDecodingVin || !formData.vin}
                        className="tactile-btn-dark px-6 whitespace-nowrap flex items-center gap-2"
                      >
                        {isDecodingVin ? <Loader2 className="animate-spin" size={16} /> : <Activity size={16} />}
                        Decode
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {vinDetails && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 rounded-3xl bg-white/5 shadow-glass border border-white/10 grid grid-cols-2 gap-4"
                      >
                        <VinDetailItem label="Vehicle" value={`${vinDetails.year} ${vinDetails.make} ${vinDetails.model}`} />
                        <VinDetailItem label="Engine" value={vinDetails.engine} />
                        <VinDetailItem label="Transmission" value={vinDetails.transmission} />
                        <VinDetailItem label="Drive" value={vinDetails.driveType} />
                        <VinDetailItem label="Trim" value={vinDetails.trim} />
                        <VinDetailItem label="Origin" value={vinDetails.manufacturedIn} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">What parts you need?</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="List the parts you are looking for..."
                      className="tactile-input min-h-[120px] py-4"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {searchMode === 'manual' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Select Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {PART_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSelectedSubcategory(null);
                          }}
                          className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                            selectedCategory?.id === cat.id 
                              ? 'bg-white/20 text-white border-white/20 shadow-glow' 
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          <div className={`p-3 rounded-xl ${selectedCategory?.id === cat.id ? 'bg-white/20' : 'bg-white/10'}`}>
                            {cat.id === 'engine' && <Cpu size={20} />}
                            {cat.id === 'transmission' && <Zap size={20} />}
                            {cat.id === 'suspension' && <Car size={20} />}
                            {cat.id === 'braking' && <Shield size={20} />}
                            {cat.id === 'electrical' && <Zap size={20} />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-center">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedCategory && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Select Subcategory</label>
                        <div className="flex flex-wrap gap-3">
                          {selectedCategory.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setSelectedSubcategory(sub.id)}
                              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                selectedSubcategory === sub.id
                                  ? 'bg-white/20 text-white border-white/20 shadow-glow'
                                  : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {selectedSubcategory && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Select Part</label>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedCategory?.subcategories.find(s => s.id === selectedSubcategory)?.parts.map((part) => (
                            <button
                              key={part}
                              type="button"
                            onClick={() => {
                                setFormData(prev => ({ ...prev, description: part }));
                                // Small delay to ensure state is updated before submit
                                setTimeout(() => {
                                  const form = document.querySelector('form');
                                  if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                }, 100);
                              }}
                              className={`p-4 rounded-xl text-xs font-bold text-left transition-all border ${
                                formData.description === part
                                  ? 'bg-white/20 border-white/30 text-white'
                                  : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                              }`}
                            >
                              {part}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {searchMode === 'visual' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                   <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Part Description (Optional)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the part or the problem you're seeing..."
                      className="tactile-input min-h-[120px] py-4"
                    />
                  </div>
                </motion.div>
              )}

              {searchMode === 'detailed' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Part Number (Optional)</label>
                      <input type="text" name="partNumber" value={formData.partNumber} onChange={handleInputChange} placeholder="Part #" className="tactile-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Part Name / Need</label>
                      <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="What do you need?" className="tactile-input" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Make</label>
                      <input type="text" name="make" value={formData.make} onChange={handleInputChange} placeholder="Ford" className="tactile-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Model</label>
                      <input type="text" name="model" value={formData.model} onChange={handleInputChange} placeholder="F-150" className="tactile-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Year</label>
                      <input type="text" name="year" value={formData.year} onChange={handleInputChange} placeholder="2024" className="tactile-input" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Motor (Optional)</label>
                      <input type="text" name="motor" value={formData.motor} onChange={handleInputChange} placeholder="5.0L V8" className="tactile-input" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="pt-6">
                <button type="submit" disabled={isSearching} className="tactile-btn-dark w-full py-6 text-xl group">
                  {isSearching ? <Loader2 className="animate-spin" /> : <Search size={24} className="group-hover:scale-110 transition-transform" />}
                  {isSearching ? 'ANALYZING DATABASE...' : 'SEARCH GLOBAL INVENTORY'}
                </button>
              </div>
            </div>

            {/* Right Column: Visual Context */}
            <div className="lg:col-span-5">
              <div className="space-y-2 mb-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  Visual Reference {searchMode === 'visual' && <span className="text-brand-primary">Required</span>}
                </label>
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`tactile-card h-[300px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all relative overflow-hidden group border-2 border-dashed ${
                  photoPreview ? 'border-brand-primary/50' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="text-sm font-black text-white uppercase tracking-widest">CHANGE PHOTO</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                      className="absolute top-4 right-4 p-3 bg-brand-primary text-white rounded-2xl hover:shadow-glow transition-all z-30"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-6 rounded-2xl bg-white/5 shadow-glass border border-white/10 group-hover:shadow-glow transition-all">
                      <Camera size={48} className="text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-center px-8">
                      <p className="font-black text-white uppercase tracking-widest">UPLOAD PART PHOTO</p>
                      <p className="text-xs text-zinc-500 mt-2 font-medium">AI will analyze the image to identify the exact part and compatibility.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <div className="h-14 w-64 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map((i) => (
                <PartCardSkeleton key={i} />
              ))}
            </div>
          </motion.div>
        ) : results ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <h3 className="text-2xl lg:text-4xl font-display font-black flex items-center gap-4 lg:gap-6 text-white">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                Found {results.length} Matches
              </h3>
              <div className="flex flex-wrap gap-3 lg:gap-4">
                <button onClick={() => setSearchMode('manual')} className="tactile-btn-dark flex-1 lg:flex-none px-4 lg:px-8 py-2.5 lg:py-3 text-[10px] lg:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <Grid size={14} /> Browse Catalog
                </button>
                <button onClick={resetSearch} className="tactile-btn-dark flex-1 lg:flex-none px-4 lg:px-8 py-2.5 lg:py-3 text-[10px] lg:text-xs font-black uppercase tracking-widest">Clear Results</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {results.map((part, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <PartCard 
                    part={part} 
                    onViewDetails={() => setSelectedPart(part)} 
                    onToggleSave={() => toggleSavePart(part)}
                    isSaved={isPartSaved(part.partNumber)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <PartDetailsModal 
        part={selectedPart} 
        onClose={() => setSelectedPart(null)} 
        groundingMetadata={groundingMetadata}
        onToggleSave={(p) => toggleSavePart(p)}
        isSaved={selectedPart ? isPartSaved(selectedPart.partNumber) : false}
      />
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
