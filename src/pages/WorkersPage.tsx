import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, Trash2, Mail, Shield, ShieldCheck, ShieldAlert, X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

export default function WorkersPage() {
  const { workers, setWorkers } = useAppContext();
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    role: 'mechanic' as 'mechanic' | 'director'
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setSuccess('Seat purchased successfully! You can now add a new worker.');
      // Remove query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (query.get('canceled')) {
      setError('Seat purchase was canceled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const deleteWorker = (id: string) => {
    setWorkers(workers.filter(w => w.id !== id));
  };

  const handleBuySeat = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to purchase a seat.');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'director',
          userId: session.user.id,
          seats: 1, // Buying 1 seat at a time
          successUrl: `${window.location.origin}/workers?success=true`,
          cancelUrl: `${window.location.origin}/workers?canceled=true`,
        }),
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
        throw new Error(data.error || 'Failed to initiate checkout');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred while processing your payment.');
      setIsProcessing(false);
    }
  };

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would check if they have available seats first
    // For now, we just add the worker to the local state
    const worker = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWorker,
      status: 'active' as const,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setWorkers([worker, ...workers]);
    setIsAddModalOpen(false);
    setNewWorker({ name: '', email: '', role: 'mechanic' });
    setSuccess('Worker added successfully.');
  };

  if (currentUser?.role !== 'director' && currentUser?.role !== 'owner') {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-3xl font-display font-black text-white">Access Denied</h2>
        <p className="text-zinc-400 max-w-md">Only directors have permission to manage the workforce and view personnel data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase">
            <Users size={10} className="text-white" />
            Team Management
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            WORKFORCE <span className="text-brand-primary italic">PORTAL.</span>
          </h1>
          <p className="text-zinc-400 font-medium">Manage your team of mechanics and directors.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleBuySeat}
            disabled={isProcessing}
            className="tactile-btn-dark px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
            Buy Seat ($49.99/mo)
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="tactile-btn-light px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2"
          >
            <UserPlus size={16} /> Add Worker
          </button>
        </div>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-bold"
          >
            <AlertTriangle size={20} />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-500 text-sm font-bold"
          >
            <CheckCircle2 size={20} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {workers.map((worker, idx) => (
            <motion.div
              key={worker.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="tactile-card p-6 flex flex-col md:flex-row items-center gap-8 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Users size={28} className="text-zinc-400 group-hover:text-brand-primary transition-colors relative z-10" />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Full Name</p>
                  <h3 className="text-xl font-display font-black text-white">{worker.name}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact Email</p>
                  <p className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <Mail size={14} className="text-zinc-500" />
                    {worker.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Access Level</p>
                  <div className="flex items-center gap-2">
                    {worker.role === 'director' ? (
                      <ShieldCheck size={16} className="text-brand-primary" />
                    ) : (
                      <Shield size={16} className="text-zinc-500" />
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${worker.role === 'director' ? 'text-brand-primary' : 'text-zinc-400'}`}>
                      {worker.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                </div>
                <button 
                  onClick={() => deleteWorker(worker.id)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Worker Modal */}
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

              <form onSubmit={handleAddWorker} className="p-10 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-black text-white tracking-tighter">Add Worker</h2>
                  <p className="text-zinc-400 text-sm font-medium">Grant system access to a new team member. Ensure you have purchased a seat first.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Access Level</label>
                    <div className="flex p-1.5 bg-white/5 rounded-xl border border-white/10 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewWorker({ ...newWorker, role: 'mechanic' })}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          newWorker.role === 'mechanic' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        <Shield size={14} />
                        <span className="font-black uppercase tracking-widest text-[10px]">Mechanic</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewWorker({ ...newWorker, role: 'director' })}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          newWorker.role === 'director' ? 'bg-white/10 text-white' : 'text-zinc-500'
                        }`}
                      >
                        <ShieldCheck size={14} />
                        <span className="font-black uppercase tracking-widest text-[10px]">Director</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={newWorker.name}
                      onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                      placeholder="e.g. Robert Johnson"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={newWorker.email}
                      onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                      placeholder="robert@partsfinder.pro"
                      className="tactile-input w-full py-4 px-4"
                    />
                  </div>
                </div>

                <button type="submit" className="tactile-btn-light w-full py-5 text-sm font-black uppercase tracking-widest">
                  Create Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
