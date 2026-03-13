import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, Trash2, Plus, AlertCircle, CheckCircle2, Clock, DollarSign, Truck, Car, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function AlertsPage() {
  const { alerts, setAlerts } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    partName: '',
    vehicle: '',
    priceThreshold: '',
    type: 'truck' as 'truck' | 'car'
  });

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const alert = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAlert,
      priceThreshold: parseFloat(newAlert.priceThreshold),
      active: true,
      createdAt: new Date().toISOString()
    };
    setAlerts([alert, ...alerts]);
    setIsAddModalOpen(false);
    setNewAlert({ partName: '', vehicle: '', priceThreshold: '', type: 'truck' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase">
            <Bell size={10} className="text-white" />
            Price Monitoring
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            SMART <span className="text-brand-primary italic">ALERTS.</span>
          </h1>
          <p className="text-zinc-400 font-medium">Get notified instantly when parts hit your target price.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="tactile-btn-light px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={16} /> Create New Alert
        </button>
      </header>

      {alerts.length === 0 ? (
        <div className="tactile-card p-20 text-center border-white/10">
          <div className="w-24 h-24 rounded-3xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mx-auto mb-10">
            <Bell size={48} className="text-zinc-500" />
          </div>
          <h2 className="text-3xl font-display font-black text-white mb-4">No active alerts</h2>
          <p className="text-zinc-400 mb-12 font-medium max-w-md mx-auto">
            Set up alerts for specific parts and we'll monitor 40+ suppliers for you 24/7.
          </p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="tactile-btn-light px-12 py-5 inline-flex items-center gap-3 group"
          >
            <Plus size={20} />
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {alerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`tactile-card p-6 flex flex-col md:flex-row items-center gap-8 transition-all ${
                  !alert.active ? 'opacity-50 grayscale' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${
                  alert.active ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-glow' : 'bg-white/5 border-white/10 text-zinc-500'
                }`}>
                  <Bell size={24} />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Part Name</p>
                    <h3 className="text-xl font-display font-black text-white">{alert.partName}</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vehicle Target</p>
                    <p className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      {alert.type === 'truck' ? <Truck size={14} /> : <Car size={14} />}
                      {alert.vehicle}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Target Price</p>
                    <p className="text-xl font-display font-black text-emerald-400">Under ${alert.priceThreshold.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button 
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      alert.active 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                        : 'bg-white/5 border-white/10 text-zinc-500'
                    }`}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </button>
                  <button 
                    onClick={() => deleteAlert(alert.id)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Alert Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-bg/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="tactile-card w-full max-w-xl border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
              
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 shadow-glass border border-white/10 text-white hover:text-zinc-400 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <form onSubmit={handleAddAlert} className="p-10 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-black text-white tracking-tighter">Create Alert</h2>
                  <p className="text-zinc-400 text-sm font-medium">We'll notify you via email and dashboard when found.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Vehicle Category</label>
                    <div className="flex p-1.5 bg-white/5 rounded-xl border border-white/10 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewAlert({ ...newAlert, type: 'truck' })}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          newAlert.type === 'truck' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        <Truck size={14} />
                        <span className="font-black uppercase tracking-widest text-[10px]">Truck</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAlert({ ...newAlert, type: 'car' })}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          newAlert.type === 'car' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        <Car size={14} />
                        <span className="font-black uppercase tracking-widest text-[10px]">Car</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Part Name</label>
                    <input 
                      type="text"
                      required
                      value={newAlert.partName}
                      onChange={(e) => setNewAlert({ ...newAlert, partName: e.target.value })}
                      placeholder="e.g. Turbocharger, Brake Pads..."
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Vehicle Details</label>
                    <input 
                      type="text"
                      required
                      value={newAlert.vehicle}
                      onChange={(e) => setNewAlert({ ...newAlert, vehicle: e.target.value })}
                      placeholder="e.g. 2022 Freightliner Cascadia"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Price Threshold ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input 
                        type="number"
                        required
                        value={newAlert.priceThreshold}
                        onChange={(e) => setNewAlert({ ...newAlert, priceThreshold: e.target.value })}
                        placeholder="0.00"
                        className="tactile-input w-full py-4 pl-12 pr-4"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="tactile-btn-light w-full py-5 text-sm font-black uppercase tracking-widest">
                  Start Monitoring
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
