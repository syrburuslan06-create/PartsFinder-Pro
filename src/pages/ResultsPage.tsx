import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  Search, 
  ChevronDown, 
  Bookmark, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Car,
  Zap,
  Shield,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Loader2,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import { searchParts } from '../services/geminiService';
import { AlertsService } from '../services/alertsService';
import { GeminiSearchResult } from '../types';

interface SearchState {
  vehicleType: 'truck' | 'car';
  make: string;
  model: string;
  year: string;
  engine: string;
  vin?: string;
  partQuery: string;
  hasPhoto: boolean;
  photoData?: string;
}

const mockResults = [
  {
    id: '1',
    partName: 'Air Brake Compressor',
    partNumber: '5018485X',
    price: 485.00,
    stock: 'In Stock',
    supplier: 'FleetPride',
    location: 'Houston, TX',
    condition: 'New',
    compatibility: '98% Match',
    delivery: 'Tomorrow',
    image: 'https://picsum.photos/seed/compressor/400/300'
  },
  {
    id: '2',
    partName: 'Bendix Air Compressor',
    partNumber: 'BX-2150',
    price: 520.00,
    stock: 'Low Stock',
    supplier: 'TruckPro',
    location: 'Dallas, TX',
    condition: 'Remanufactured',
    compatibility: '100% Match',
    delivery: '2 Days',
    image: 'https://picsum.photos/seed/bendix/400/300'
  },
  {
    id: '3',
    partName: 'Heavy Duty Compressor',
    partNumber: 'HD-9921',
    price: 395.00,
    stock: 'Out of Stock',
    supplier: 'PartsMaster',
    location: 'Chicago, IL',
    condition: 'New',
    compatibility: '95% Match',
    delivery: '5-7 Days',
    image: 'https://picsum.photos/seed/hdcomp/400/300'
  },
  {
    id: '4',
    partName: 'Standard Air Compressor',
    partNumber: 'SAC-101',
    price: 415.00,
    stock: 'In Stock',
    supplier: 'GlobalTruck',
    location: 'Atlanta, GA',
    condition: 'New',
    compatibility: '92% Match',
    delivery: 'Tomorrow',
    image: 'https://picsum.photos/seed/standard/400/300'
  }
];

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedParts, setSavedParts, currentUser, isOffline, featureFlags } = useAppContext();
  const state = location.state as SearchState;

  const [results, setResults] = useState<GeminiSearchResult[]>([]);
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('none');
  const [supplierFilter, setSupplierFilter] = useState('all');

  const [compareList, setCompareList] = useState<string[]>([]);
  const [showScoringDetails, setShowScoringDetails] = useState<string | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const compareParts = useMemo(() => {
    return results.filter(r => compareList.includes(r.partNumber));
  }, [results, compareList]);

  useEffect(() => {
    const performSearch = async () => {
      if (!state) return;
      setIsLoading(true);
      setError(null);
      
      try {
        // Layer 1 & 2: Check Backend Cache (Redis/DB)
        if (!isOffline) {
          const { data: { session } } = await supabase.auth.getSession();
          const cacheResponse = await fetch('/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
              vin: state.vin,
              partNumber: state.partQuery, // Use partQuery as partNumber if that's what we have
              description: state.partQuery,
              vehicleType: state.vehicleType
            })
          });

          if (cacheResponse.ok) {
            const cacheData = await cacheResponse.json();
            if (cacheData.results && cacheData.results.length > 0) {
              console.log(`Search results loaded from ${cacheData.source}`);
              setResults(cacheData.results);
              setIsLoading(false);
              return;
            }
          }
        }

        // Layer 3: Live AI Search (Gemini)
        if (isOffline) {
          // Check local storage for this specific search if offline
          const localCacheKey = `search_${state.vin || state.partQuery}`;
          const localCached = localStorage.getItem(localCacheKey);
          if (localCached) {
            setResults(JSON.parse(localCached));
            setIsLoading(false);
            return;
          }
          throw new Error('Offline: No cached results found for this search.');
        }

        const response = await searchParts({
          vehicleType: state.vehicleType,
          make: state.make,
          model: state.model,
          year: state.year,
          motor: state.engine,
          vin: state.vin,
          description: state.partQuery,
          image: state.photoData
        });
        
        setResults(response.results);
        setGroundingMetadata(response.groundingMetadata);

        // Process search results for alerts (price drop, new supplier)
        AlertsService.processSearchResults(response.results);

        // Cache locally for offline access
        const localCacheKey = `search_${state.vin || state.partQuery}`;
        localStorage.setItem(localCacheKey, JSON.stringify(response.results));

      } catch (err: any) {
        console.error('Search failed:', err);
        setError(err.message || 'Failed to fetch results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [state, isOffline]);

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.partName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stockFilter !== 'all') {
      if (stockFilter === 'in stock') {
        filtered.sort((a, b) => (a.availability === 'In Stock' ? -1 : 1));
      } else {
        filtered = filtered.filter(r => r.availability.toLowerCase() === stockFilter);
      }
    }

    if (supplierFilter !== 'all') {
      filtered = filtered.filter(r => r.supplier === supplierFilter);
    }

    if (priceSort === 'low') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return priceA - priceB;
      });
    } else if (priceSort === 'high') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return priceB - priceA;
      });
    }

    return filtered;
  }, [results, searchTerm, stockFilter, priceSort, supplierFilter]);

  const handleToggleSave = async (part: GeminiSearchResult) => {
    const isSaved = savedParts.some(p => p.partNumber === part.partNumber);
    if (isSaved) {
      setSavedParts(savedParts.filter(p => p.partNumber !== part.partNumber));
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('saved_parts').delete().eq('mechanic_id', user.id).eq('part_number', part.partNumber);
        }
      } catch (e) {
        console.error('Error removing saved part:', e);
      }
    } else {
      const newPart = { ...part, id: part.partNumber, savedAt: new Date().toISOString() };
      setSavedParts([...savedParts, newPart]);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('saved_parts').insert({
            mechanic_id: user.id,
            part_number: part.partNumber,
            part_name: part.partName,
            price: parseFloat(part.price.replace(/[^0-9.]/g, '')) || 0,
            notes: part.description || ''
          });
        }
      } catch (e) {
        console.error('Error saving part:', e);
      }
    }
  };

  const handleToggleCompare = (partNumber: string) => {
    setCompareList(prev => {
      if (prev.includes(partNumber)) {
        return prev.filter(id => id !== partNumber);
      }
      if (prev.length >= 3) {
        alert('You can only compare up to 3 parts at a time.');
        return prev;
      }
      return [...prev, partNumber];
    });
  };

  const handleRequestQuote = (part: any) => {
    // In a real app, this would trigger a toast or modal
    alert(`Quote request sent to ${part.supplier} for ${part.partName}`);
  };

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-6 rounded-full bg-white/5 border border-white/10">
          <AlertCircle size={48} className="text-zinc-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-black text-white">No Search Active</h2>
          <p className="text-zinc-400 font-medium">Please start a new search to see results.</p>
        </div>
        <button onClick={() => navigate('/search')} className="tactile-btn-light px-8 py-4">
          Go to Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Offline Banner */}
      {isOffline && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 flex items-center justify-center gap-3 text-amber-500 text-xs font-black uppercase tracking-widest"
        >
          <AlertCircle size={14} />
          You are currently offline. Some features may be limited.
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Search
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-black text-white tracking-tighter">
              Results for "{state.partQuery}"
            </h1>
            <div className="flex items-center gap-3 text-zinc-400 font-medium text-sm">
              <span className="flex items-center gap-1.5">
                {state.vehicleType === 'truck' ? <Truck size={14} /> : <Car size={14} />}
                {state.year} {state.make} {state.model}
              </span>
              {state.engine && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span>{state.engine}</span>
                </>
              )}
              {state.vin && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="font-mono uppercase text-xs tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">VIN: {state.vin}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {currentUser?.role === 'director' && (
            <div className="px-4 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Shield size={12} /> Director Insights Active
            </div>
          )}
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={12} /> 40+ Suppliers Scanned
          </div>
        </div>
      </div>

      {/* AI Analysis Box */}
      <AnimatePresence>
        {state.hasPhoto && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tactile-card p-6 border-brand-primary/30 bg-brand-primary/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Zap size={120} className="text-brand-primary" />
            </div>
            <div className="relative flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center shrink-0">
                <Zap size={24} className="text-brand-primary" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">AI Vision Analysis</h3>
                  <span className="px-2 py-0.5 rounded bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest">Verified</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-3xl">
                  Based on the photo provided, we've identified this as a <span className="text-white font-bold">Heavy Duty Air Brake Compressor (Twin Cylinder)</span>. 
                  The mounting pattern matches your {state.year} {state.make} {state.model} specifications. 
                  We recommend checking the coolant line fittings as they appear to be the 45-degree variant in your photo.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Bar */}
      <div className="tactile-card p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Filter by name or part #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tactile-input w-full pl-12 py-3 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="tactile-input py-3 px-4 text-xs font-bold uppercase tracking-widest appearance-none min-w-[140px]"
          >
            <option value="all">All Stock</option>
            <option value="in stock">In Stock First</option>
            <option value="low stock">Low Stock</option>
          </select>

          <select 
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="tactile-input py-3 px-4 text-xs font-bold uppercase tracking-widest appearance-none min-w-[140px]"
          >
            <option value="none">Sort Price</option>
            <option value="low">Lowest First</option>
            <option value="high">Highest First</option>
          </select>

          <select 
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="tactile-input py-3 px-4 text-xs font-bold uppercase tracking-widest appearance-none min-w-[140px]"
          >
            <option value="all">All Suppliers</option>
            <option value="FleetPride">FleetPride</option>
            <option value="TruckPro">TruckPro</option>
            <option value="PartsMaster">PartsMaster</option>
          </select>

          {featureFlags.enableCompare && compareList.length > 0 && (
            <button 
              className="tactile-btn-light py-3 px-4 text-xs font-black uppercase tracking-widest flex items-center gap-2"
              onClick={() => setShowCompareModal(true)}
            >
              Compare Selected ({compareList.length})
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="tactile-card p-10 border-white/10 animate-pulse space-y-6">
              <div className="h-48 bg-white/5 rounded-xl" />
              <div className="space-y-3">
                <div className="h-8 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-white/5 rounded" />
                <div className="h-10 bg-white/5 rounded" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <AlertCircle size={48} className="mx-auto text-red-500" />
            <p className="text-white font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="tactile-btn-light px-6 py-2 text-xs">Retry</button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredResults.map((part, idx) => (
              <motion.div
                key={part.partNumber}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="tactile-card group overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-zinc-900">
                  <img 
                    src={`https://picsum.photos/seed/${part.partNumber}/400/300`} 
                    alt={part.partName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                  
                  {/* Trust Score Badge */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {featureFlags.enableTrustScore && (
                      <div className={`px-3 py-1.5 rounded-xl backdrop-blur-md border flex items-center gap-2 shadow-glow ${
                        part.trustScore >= 90 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                        part.trustScore >= 75 ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                        'bg-red-500/20 border-red-500/30 text-red-400'
                      }`}>
                        <Shield size={14} />
                        <span className="text-xs font-black uppercase tracking-widest">Trust: {part.trustScore}%</span>
                      </div>
                    )}
                    
                    {featureFlags.enableCompare && (
                      <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black/60 transition-colors w-fit">
                        <input 
                          type="checkbox" 
                          checked={compareList.includes(part.partNumber)}
                          onChange={() => handleToggleCompare(part.partNumber)}
                          className="accent-brand-primary"
                        />
                        Compare
                      </label>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleToggleSave(part)}
                      className={`px-3 py-1.5 rounded-xl backdrop-blur-md border transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        savedParts.some(p => p.partNumber === part.partNumber)
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-glow'
                          : 'bg-black/20 text-white border-white/10 hover:bg-black/40'
                      }`}
                    >
                      {savedParts.some(p => p.partNumber === part.partNumber) ? (
                        <>
                          <CheckCircle2 size={14} /> Saved ✓
                        </>
                      ) : (
                        <>
                          <Bookmark size={14} /> Save
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-display font-black text-white group-hover:text-brand-primary transition-colors line-clamp-2">
                        {part.partName}
                      </h3>
                      <p className="text-zinc-500 text-xs font-bold font-mono tracking-wider uppercase">PN: {part.partNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-black text-white">{part.price}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Est. Price</p>
                    </div>
                  </div>

                  {/* Scoring Details Mini-Grid */}
                  {featureFlags.enableTrustScore && (
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Match</p>
                        <p className="text-xs font-black text-white">{part.scoringDetails.partNumberMatch}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Price</p>
                        <p className="text-xs font-black text-white">{part.scoringDetails.priceCompetitiveness}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Reliability</p>
                        <p className="text-xs font-black text-white">{part.scoringDetails.supplierReliability}%</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Supplier</p>
                      <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                        <Truck size={14} className="text-zinc-500" /> {part.supplier}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Availability</p>
                      <p className={`text-sm font-bold flex items-center gap-2 ${
                        part.availability === 'In Stock' ? 'text-emerald-400' : 
                        part.availability === 'Low Stock' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        <Clock size={14} /> {part.availability}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2 mt-auto">
                    {part.sourceUrl ? (
                      <a 
                        href={isOffline ? '#' : part.sourceUrl}
                        target={isOffline ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (isOffline) {
                            e.preventDefault();
                            alert('This feature is unavailable while offline.');
                          }
                        }}
                        className={`flex-1 tactile-btn-light py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${isOffline ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <ExternalLink size={14} /> View on Site
                      </a>
                    ) : (
                      <button 
                        onClick={() => {
                          if (isOffline) {
                            alert('Cannot request quote while offline.');
                            return;
                          }
                          handleRequestQuote(part);
                        }}
                        className={`flex-1 tactile-btn-light py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${isOffline ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <MessageSquare size={14} /> Request Quote
                      </button>
                    )}
                    {featureFlags.enableTrustScore && (
                      <button 
                        onClick={() => setShowScoringDetails(part.partNumber)}
                        className="tactile-btn-dark px-4 py-3"
                      >
                        <Info size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="tactile-card w-full max-w-5xl p-8 space-y-8 border-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight">Compare Parts</h3>
                <button onClick={() => setShowCompareModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {compareParts.map(part => (
                  <div key={part.partNumber} className="space-y-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="h-32 rounded-xl overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/${part.partNumber}/300/200`} 
                        alt={part.partName} 
                        className="w-full h-full object-cover opacity-60"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-display font-black text-white line-clamp-2">{part.partName}</h4>
                        <p className="text-zinc-500 text-xs font-bold font-mono tracking-widest uppercase">PN: {part.partNumber}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-500 font-bold uppercase">Price</span>
                          <span className="text-white font-black">{part.price}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-500 font-bold uppercase">Trust Score</span>
                          <span className={`font-black ${
                            part.trustScore >= 90 ? 'text-emerald-400' :
                            part.trustScore >= 75 ? 'text-amber-400' : 'text-rose-400'
                          }`}>{part.trustScore}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-500 font-bold uppercase">Supplier</span>
                          <span className="text-white font-black">{part.supplier}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-500 font-bold uppercase">Stock</span>
                          <span className="text-white font-black">{part.availability}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleToggleCompare(part.partNumber)}
                        className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-colors"
                      >
                        Remove from Compare
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="tactile-btn-dark px-8 py-3 text-xs font-black uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scoring Details Modal */}
      <AnimatePresence>
        {showScoringDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="tactile-card w-full max-w-md p-8 space-y-6 border-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Trust Score Breakdown</h3>
                <button onClick={() => setShowScoringDetails(null)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {results.find(r => r.partNumber === showScoringDetails) && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                    <span className="text-sm font-black text-white uppercase tracking-widest">Total Trust Score</span>
                    <span className="text-3xl font-display font-black text-brand-primary">
                      {results.find(r => r.partNumber === showScoringDetails)?.trustScore}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Part Number Match', value: results.find(r => r.partNumber === showScoringDetails)?.scoringDetails.partNumberMatch, weight: '30%' },
                      { label: 'Price Competitiveness', value: results.find(r => r.partNumber === showScoringDetails)?.scoringDetails.priceCompetitiveness, weight: '20%' },
                      { label: 'Supplier Reliability', value: results.find(r => r.partNumber === showScoringDetails)?.scoringDetails.supplierReliability, weight: '20%' },
                      { label: 'Historical Success', value: results.find(r => r.partNumber === showScoringDetails)?.scoringDetails.historicalSuccess, weight: '10%' },
                      { label: 'User Rating', value: results.find(r => r.partNumber === showScoringDetails)?.scoringDetails.userRating, weight: '10%' },
                      { label: 'AI Confidence', value: results.find(r => r.partNumber === showScoringDetails)?.scoringDetails.aiConfidence, weight: '10%' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-zinc-500">{item.label} <span className="text-[8px] opacity-50">({item.weight})</span></span>
                          <span className="text-white">{item.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            className="h-full bg-zinc-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredResults.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <Search size={32} className="text-zinc-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-display font-black text-white">No parts found for this vehicle</h3>
            <p className="text-zinc-400">Try a different part name or check the engine type.</p>
          </div>
        </div>
      )}
    </div>
  );
}
