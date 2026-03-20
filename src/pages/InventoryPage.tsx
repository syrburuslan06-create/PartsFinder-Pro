import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Car, Plus, Search, Trash2, ChevronRight, Settings, Calendar, Hash, Fuel, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

export default function InventoryPage() {
  const { inventory, setInventory } = useAppContext();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'truck' as 'truck' | 'car',
    make: '',
    model: '',
    year: '',
    vin: '',
    engine: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteVehicle = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: deleteError } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setInventory(inventory.filter(v => v.id !== id));
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      setError(err.message || 'Failed to delete vehicle');
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const vehicleToInsert = {
        user_id: user.id,
        ...newVehicle,
        status: 'active',
        last_service: new Date().toISOString()
      };

      const { data, error: insertError } = await supabase
        .from('inventory')
        .insert([vehicleToInsert])
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        const mappedVehicle = {
          id: data.id,
          type: data.type as 'truck' | 'car',
          make: data.make,
          model: data.model,
          year: data.year,
          engine: data.engine,
          vin: data.vin,
          name: data.name,
          status: data.status,
          lastService: data.last_service
        };
        setInventory([mappedVehicle, ...inventory]);
      }

      setIsAddModalOpen(false);
      setNewVehicle({ name: '', type: 'truck', make: '', model: '', year: '', vin: '', engine: '' });
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'Failed to add vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchForVehicle = (vehicle: any) => {
    navigate('/search', { 
      state: { 
        prefill: {
          type: vehicle.type,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          engine: vehicle.engine
        }
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase">
            <Truck size={10} className="text-white" />
            Fleet Management
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            FLEET <span className="text-brand-primary italic">INVENTORY.</span>
          </h1>
          <p className="text-zinc-400 font-medium">Manage your vehicles and quickly source compatible parts.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="tactile-btn-light px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </header>

      {inventory.length === 0 ? (
        <div className="tactile-card p-20 text-center border-white/10">
          <div className="w-24 h-24 rounded-3xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mx-auto mb-10">
            <Truck size={48} className="text-zinc-500" />
          </div>
          <h2 className="text-3xl font-display font-black text-white mb-4">Your fleet is empty</h2>
          <p className="text-zinc-400 mb-12 font-medium max-w-md mx-auto">
            Add your vehicles to the inventory to enable one-click part sourcing and maintenance tracking.
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="tactile-btn-light px-12 py-5 inline-flex items-center gap-3 group"
          >
            <Plus size={20} />
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {inventory.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="tactile-card group overflow-hidden flex flex-col"
              >
                <div className="p-8 space-y-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${vehicle.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{vehicle.type}</p>
                      </div>
                      <h3 className="text-2xl font-display font-black text-white group-hover:text-brand-primary transition-colors">
                        {vehicle.name}
                      </h3>
                    </div>
                    <button 
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Make / Model</p>
                      <p className="text-xs font-bold text-zinc-200">{vehicle.make} {vehicle.model}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Year</p>
                      <p className="text-xs font-bold text-zinc-200">{vehicle.year}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Engine</p>
                      <p className="text-xs font-bold text-zinc-200">{vehicle.engine}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">VIN</p>
                      <p className="text-xs font-bold text-zinc-200 font-mono">{vehicle.vin}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                  <button 
                    onClick={() => handleSearchForVehicle(vehicle)}
                    className="flex-1 tactile-btn-light py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Search size={14} /> Source Parts
                  </button>
                  <button className="tactile-btn-dark px-4 py-3">
                    <Settings size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-bg/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="tactile-card w-full max-w-2xl border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
              
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 shadow-glass border border-white/10 text-white hover:text-zinc-400 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <form onSubmit={handleAddVehicle} className="p-10 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-black text-white tracking-tighter">Add Vehicle</h2>
                  <p className="text-zinc-400 text-sm font-medium">Register a new vehicle to your fleet inventory.</p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Vehicle Category</label>
                    <div className="flex p-1.5 bg-white/5 rounded-xl border border-white/10 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewVehicle({ ...newVehicle, type: 'truck' })}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          newVehicle.type === 'truck' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        <Truck size={14} />
                        <span className="font-black uppercase tracking-widest text-[10px]">Truck</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewVehicle({ ...newVehicle, type: 'car' })}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          newVehicle.type === 'car' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        <Car size={14} />
                        <span className="font-black uppercase tracking-widest text-[10px]">Car</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Internal Name / Fleet ID</label>
                    <input 
                      type="text"
                      required
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                      placeholder="e.g. Unit #402 - Main Hauler"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Make</label>
                    <input 
                      type="text"
                      required
                      value={newVehicle.make}
                      onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                      placeholder="e.g. Freightliner"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Model</label>
                    <input 
                      type="text"
                      required
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      placeholder="e.g. Cascadia"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Year</label>
                    <input 
                      type="text"
                      required
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                      placeholder="e.g. 2022"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Engine Type</label>
                    <input 
                      type="text"
                      required
                      value={newVehicle.engine}
                      onChange={(e) => setNewVehicle({ ...newVehicle, engine: e.target.value })}
                      placeholder="e.g. Detroit DD15"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">VIN (Optional)</label>
                    <input 
                      type="text"
                      value={newVehicle.vin}
                      onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                      placeholder="17-digit Vehicle Identification Number"
                      className="tactile-input w-full py-4 px-4 font-mono"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`tactile-btn-light w-full py-5 text-sm font-black uppercase tracking-widest ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Registering...' : 'Register Vehicle'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
