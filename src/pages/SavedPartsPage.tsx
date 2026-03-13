import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Search, Trash2, ExternalLink, ChevronRight, Star, AlertCircle, MessageSquare, Clock, MapPin, Truck, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

export default function SavedPartsPage() {
  const { savedParts, setSavedParts } = useAppContext();
  const [selectedPart, setSelectedPart] = useState<any | null>(null);

  const removePart = async (id: string) => {
    const partToRemove = savedParts.find(p => p.id === id);
    setSavedParts(savedParts.filter(p => p.id !== id));
    if (selectedPart?.id === id) {
      setSelectedPart(null);
    }
    
    if (partToRemove) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('saved_parts').delete().eq('mechanic_id', user.id).eq('part_number', partToRemove.partNumber);
        }
      } catch (e) {
        console.error('Error removing saved part:', e);
      }
    }
  };

  const handleRequestQuote = (part: any) => {
    alert(`Quote request sent to ${part.supplier} for ${part.partName}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase">
          <Bookmark size={10} className="text-white" />
          Personal Inventory
        </div>
        <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
          SAVED <span className="text-brand-primary italic">PARTS.</span>
        </h1>
        <p className="text-zinc-400 font-medium">Your curated list of sourced components and quotes.</p>
      </header>

      {savedParts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="tactile-card p-20 text-center border-white/10"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mx-auto mb-10">
            <Bookmark size={48} className="text-zinc-500" />
          </div>
          <h2 className="text-3xl font-display font-black text-white mb-4">No saved parts yet</h2>
          <p className="text-zinc-400 mb-12 font-medium max-w-md mx-auto">
            Start searching for parts and click the bookmark icon to save them to your personal inventory.
          </p>
          <Link to="/search" className="tactile-btn-light px-12 py-5 inline-flex items-center gap-3 group">
            <Search size={20} />
            Go to Search
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {savedParts.map((part, idx) => (
              <motion.div
                key={part.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="tactile-card group overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={part.image} 
                    alt={part.partName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => removePart(part.id)}
                      className="p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-display font-black text-white group-hover:text-brand-primary transition-colors line-clamp-1">
                        {part.partName}
                      </h3>
                      <p className="text-xl font-display font-black text-white">${part.price.toFixed(2)}</p>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest">PN: {part.partNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Supplier</p>
                      <p className="text-xs font-bold text-zinc-200 truncate">{part.supplier}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Availability</p>
                      <p className="text-xs font-bold text-emerald-400">{part.stock}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 mt-auto">
                    <button 
                      onClick={() => handleRequestQuote(part)}
                      className="flex-1 tactile-btn-light py-2.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={12} /> Quote
                    </button>
                    <button 
                      onClick={() => setSelectedPart(part)}
                      className="tactile-btn-dark px-4 py-2.5 text-[9px] font-black uppercase tracking-widest"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedPart && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-bg/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="tactile-card w-full max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 relative"
            >
              <button 
                onClick={() => setSelectedPart(null)}
                className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 shadow-glass border border-white/10 text-white hover:text-zinc-400 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-10 space-y-8">
                <header className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-brand-primary px-4 py-1.5 rounded-full shadow-glow">
                      {selectedPart.supplier}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border border-white/10 px-4 py-1.5 rounded-full">
                      {selectedPart.condition}
                    </span>
                  </div>
                  <h2 className="text-4xl font-display font-black text-white tracking-tighter leading-tight">{selectedPart.partName}</h2>
                  <p className="text-lg text-zinc-500 font-mono font-bold tracking-widest">PN: {selectedPart.partNumber}</p>
                </header>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white/5 shadow-glass border border-white/10 space-y-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Price</p>
                    <p className="text-3xl font-display font-black text-white">${selectedPart.price.toFixed(2)}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 shadow-glass border border-white/10 space-y-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Compatibility</p>
                    <div className="flex items-center gap-2">
                      <Shield size={20} className="text-emerald-400" />
                      <span className="text-xl font-black text-white">{selectedPart.compatibility}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-white/5 shadow-glass border border-white/10 space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Supplier Details</h4>
                  <div className="grid grid-cols-2 gap-y-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        <MapPin size={14} className="text-zinc-500" /> {selectedPart.location}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Delivery</p>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        <Clock size={14} className="text-zinc-500" /> {selectedPart.delivery}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex gap-4">
                  <button 
                    onClick={() => handleRequestQuote(selectedPart)}
                    className="flex-1 tactile-btn-light py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <MessageSquare size={18} />
                    Request Official Quote
                  </button>
                  <button 
                    onClick={() => removePart(selectedPart.id)}
                    className="tactile-btn-dark bg-rose-500/10 border-rose-500/20 text-rose-500 px-8 py-5 hover:bg-rose-500/20 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
