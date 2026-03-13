import React, { useState, useMemo } from 'react';
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
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

interface SearchState {
  vehicleType: 'truck' | 'car';
  make: string;
  model: string;
  year: string;
  engine: string;
  vin?: string;
  partQuery: string;
  hasPhoto: boolean;
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
  const { savedParts, setSavedParts } = useAppContext();
  const state = location.state as SearchState;

  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('none');
  const [supplierFilter, setSupplierFilter] = useState('all');

  const [compareList, setCompareList] = useState<string[]>([]);

  const filteredResults = useMemo(() => {
    let results = [...mockResults];

    if (searchTerm) {
      results = results.filter(r => 
        r.partName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stockFilter !== 'all') {
      if (stockFilter === 'in stock') {
        results.sort((a, b) => (a.stock === 'In Stock' ? -1 : 1));
      } else {
        results = results.filter(r => r.stock.toLowerCase().includes(stockFilter));
      }
    }

    if (supplierFilter !== 'all') {
      results = results.filter(r => r.supplier === supplierFilter);
    }

    if (priceSort === 'low') {
      results.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high') {
      results.sort((a, b) => b.price - a.price);
    }

    return results;
  }, [searchTerm, stockFilter, priceSort, supplierFilter]);

  const handleToggleSave = async (part: any) => {
    const isSaved = savedParts.some(p => p.id === part.id);
    if (isSaved) {
      setSavedParts(savedParts.filter(p => p.id !== part.id));
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('saved_parts').delete().eq('mechanic_id', user.id).eq('part_number', part.partNumber);
        }
      } catch (e) {
        console.error('Error removing saved part:', e);
      }
    } else {
      const newPart = { ...part, savedAt: new Date().toISOString() };
      setSavedParts([...savedParts, newPart]);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('saved_parts').insert({
            mechanic_id: user.id,
            part_number: part.partNumber,
            part_name: part.partName,
            price: part.price,
            notes: part.description || ''
          });
        }
      } catch (e) {
        console.error('Error saving part:', e);
      }
    }
  };

  const handleToggleCompare = (partId: string) => {
    setCompareList(prev => {
      if (prev.includes(partId)) {
        return prev.filter(id => id !== partId);
      }
      if (prev.length >= 3) {
        alert('You can only compare up to 3 parts at a time.');
        return prev;
      }
      return [...prev, partId];
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

          {compareList.length > 0 && (
            <button 
              className="tactile-btn-light py-3 px-4 text-xs font-black uppercase tracking-widest flex items-center gap-2"
              onClick={() => alert('Compare feature coming soon!')}
            >
              Compare Selected ({compareList.length})
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResults.map((part, idx) => (
            <motion.div
              key={part.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="tactile-card group overflow-hidden flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={part.image} 
                  alt={part.partName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black/60 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={compareList.includes(part.id)}
                      onChange={() => handleToggleCompare(part.id)}
                      className="accent-brand-primary"
                    />
                    Compare
                  </label>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleToggleSave(part)}
                    className={`px-3 py-1.5 rounded-xl backdrop-blur-md border transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      savedParts.some(p => p.id === part.id)
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-glow'
                        : 'bg-black/20 text-white border-white/10 hover:bg-black/40'
                    }`}
                  >
                    {savedParts.some(p => p.id === part.id) ? (
                      <>
                        <CheckCircle2 size={14} /> Saved ✓
                      </>
                    ) : (
                      <>
                        <Bookmark size={14} /> Save Part
                      </>
                    )}
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> ✓ Compatible
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-display font-black text-white group-hover:text-brand-primary transition-colors">
                      {part.partName}
                    </h3>
                    <p className="text-zinc-500 text-xs font-bold font-mono tracking-wider">PN: {part.partNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display font-black text-white">${part.price.toFixed(2)}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">MSRP Estimate</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Supplier</p>
                    <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                      <Truck size={14} className="text-zinc-500" /> {part.supplier}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Availability</p>
                    <p className={`text-sm font-bold flex items-center gap-2 ${
                      part.stock === 'In Stock' ? 'text-emerald-400' : 
                      part.stock === 'Low Stock' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      <Clock size={14} /> {part.stock}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                      <MapPin size={14} className="text-zinc-500" /> {part.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Delivery</p>
                    <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                      <Clock size={14} className="text-zinc-500" /> {part.delivery}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 mt-auto">
                  <button 
                    onClick={() => handleRequestQuote(part)}
                    className="flex-1 tactile-btn-light py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} /> Request Quote
                  </button>
                  <button className="tactile-btn-dark px-4 py-3">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
