import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Search, Trash2, ExternalLink, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { SearchResult } from '../services/geminiService';
import { Link } from 'react-router-dom';

export default function SavedPartsPage() {
  const [savedParts, setSavedParts] = useState<SearchResult[]>([]);
  const [selectedPart, setSelectedPart] = useState<SearchResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('saved_parts');
    if (saved) {
      setSavedParts(JSON.parse(saved));
    }
  }, []);

  const removePart = (partNumber: string) => {
    const updated = savedParts.filter(p => p.partNumber !== partNumber);
    setSavedParts(updated);
    localStorage.setItem('saved_parts', JSON.stringify(updated));
    if (selectedPart?.partNumber === partNumber) {
      setSelectedPart(null);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 shadow-glass border border-white/10 text-white text-[9px] font-black mb-4 tracking-[0.2em] uppercase"
          >
            <Bookmark size={10} className="text-white" />
            Personal Inventory
          </motion.div>
          <h1 className="text-3xl lg:text-5xl font-display font-black text-white tracking-tighter leading-none">
            SAVED <span className="text-brand-primary italic">PARTS.</span>
          </h1>
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
            <Link to="/search" className="tactile-btn-dark px-12 py-5 inline-flex items-center gap-3 group">
              <Search size={20} />
              Go to Search
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <AnimatePresence>
              {savedParts.map((part, idx) => (
                <motion.div
                  key={part.partNumber}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                   className="tactile-card p-4 lg:p-6 border-white/10 group relative flex flex-col h-full"
                >
                  <button 
                    onClick={() => removePart(part.partNumber)}
                    className="absolute top-2 right-2 p-2 text-zinc-500 hover:text-red-500 transition-colors z-10"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="mb-3 lg:mb-4">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white bg-brand-primary px-2.5 py-1 rounded-full shadow-glow">
                      {part.supplier}
                    </span>
                  </div>

                  <h3 className="text-base lg:text-lg font-display font-black text-white mb-1 group-hover:text-brand-primary transition-colors line-clamp-1 leading-tight">
                    {part.partName}
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-mono font-bold mb-4 uppercase tracking-tighter">{part.partNumber}</p>

                  <div className="flex items-center justify-between mb-4 mt-auto">
                    <p className="text-lg lg:text-xl font-display font-black text-white">{part.price}</p>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-white/5 shadow-glass border border-white/10 rounded-full">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span className="text-[9px] font-black text-white">{part.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <button 
                      onClick={() => setSelectedPart(part)}
                      className="tactile-btn-dark py-2 text-[9px] font-black uppercase tracking-widest"
                    >
                      Details
                    </button>
                    {part.sourceUrl && (
                      <a 
                        href={part.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tactile-btn-dark bg-brand-primary/20 border-brand-primary/30 py-2 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
                      >
                        Buy <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Details Modal (Simplified version of the one in SearchForm or reusable) */}
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
                className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 shadow-glass border border-white/10 text-white hover:text-red-500 transition-colors z-10"
              >
                <Trash2 size={20} />
              </button>

                  <div className="p-6 lg:p-10 space-y-8 lg:space-y-10">
                <header>
                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-white bg-brand-primary px-4 lg:px-6 py-1.5 lg:py-2 rounded-full shadow-glow">
                      {selectedPart.supplier}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-display font-black text-white tracking-tighter leading-tight mb-2 lg:mb-4">{selectedPart.partName}</h2>
                  <p className="text-base lg:text-lg text-zinc-500 font-mono font-bold tracking-widest">{selectedPart.partNumber}</p>
                </header>

                <div className="space-y-6 lg:space-y-8">
                  <div className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-white/5 shadow-glass border border-white/10">
                    <p className="text-[9px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 lg:mb-4">Description</p>
                    <p className="text-sm lg:text-base text-zinc-400 leading-relaxed font-medium">{selectedPart.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    <div className="p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white/5 shadow-glass border border-white/10">
                      <p className="text-[9px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 lg:mb-2">Price</p>
                      <p className="text-xl lg:text-2xl font-display font-black text-white">{selectedPart.price}</p>
                    </div>
                    <div className="p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white/5 shadow-glass border border-white/10">
                      <p className="text-[9px] lg:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 lg:mb-2">Rating</p>
                      <div className="flex items-center gap-1.5 lg:gap-2">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-lg lg:text-xl font-black text-white">{selectedPart.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 lg:pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                  {selectedPart.sourceUrl && (
                    <a 
                      href={selectedPart.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tactile-btn-dark flex-1 py-4 lg:py-5 text-center flex items-center justify-center gap-2 lg:gap-3"
                    >
                      <ExternalLink size={18} />
                      View on Supplier Site
                    </a>
                  )}
                  <button 
                    onClick={() => removePart(selectedPart.partNumber)}
                    className="tactile-btn-dark bg-red-500/10 border-red-500/20 text-red-500 px-6 lg:px-8 py-4 lg:py-5 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
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
