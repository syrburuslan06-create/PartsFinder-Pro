import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, ShieldCheck, ArrowRight, UserPlus, 
  CheckCircle2, Copy, Link as LinkIcon, Sparkles,
  Lock, Calendar, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerAddWorkerPage() {
  const [step, setStep] = useState<'payment' | 'details' | 'success'>('payment');
  const [workerName, setWorkerName] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('details');
  };

  const handleCreateSpot = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const inviteLink = `${window.location.origin}/register/mechanic?ref=owner_422`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg pt-4 lg:pt-8 pb-32 lg:pb-8 px-4 lg:px-6 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tactile-card p-6 lg:p-10"
            >
              <div className="mb-6 lg:mb-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 shadow-glass flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <CreditCard className="text-white" size={24} />
                </div>
                <h2 className="text-2xl lg:text-3xl font-display font-black text-white tracking-tighter mb-2 uppercase">
                  ADD WORKER <span className="text-brand-primary italic">SEAT.</span>
                </h2>
                <p className="text-zinc-400 text-xs lg:text-sm font-medium max-w-md mx-auto">
                  Initialize a new professional seat for your fleet team. Secure payment required.
                </p>
              </div>

              <form onSubmit={handlePayment} className="space-y-4 lg:space-y-6">
                <div className="p-4 rounded-xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-between mb-4 lg:mb-6">
                  <div>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Plan</p>
                    <p className="text-sm font-black text-white">Professional Seat</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Price</p>
                    <p className="text-lg lg:text-xl font-black text-white">$19.99<span className="text-[10px] text-zinc-500">/mo</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Card Number</label>
                    <div className="relative group">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
                      <input type="text" required placeholder="•••• •••• •••• ••••" className="tactile-input w-full py-3 pl-10 pr-3 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Expiry</label>
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
                        <input type="text" required placeholder="MM/YY" className="tactile-input w-full py-3 pl-10 pr-3 text-xs" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">CVC</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
                        <input type="text" required placeholder="•••" className="tactile-input w-full py-3 pl-10 pr-3 text-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="tactile-btn-dark w-full py-4 text-lg group">
                  Confirm Payment
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="tactile-card p-6 lg:p-10"
            >
              <div className="mb-6 lg:mb-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 shadow-glass flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <User className="text-white" size={24} />
                </div>
                <h2 className="text-2xl lg:text-3xl font-display font-black text-white tracking-tighter mb-2 uppercase">
                  INITIALIZE <span className="text-brand-primary italic">SPOT.</span>
                </h2>
                <p className="text-zinc-400 text-xs lg:text-sm font-medium max-w-md mx-auto">
                  Payment confirmed. Now, enter the name of the worker who will occupy this seat.
                </p>
              </div>

              <form onSubmit={handleCreateSpot} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Worker Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Alex Rivera" 
                      className="tactile-input w-full py-3 pl-10 pr-3 text-xs"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="tactile-btn-dark w-full py-4 text-lg group">
                  Generate Invite Link
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="tactile-card p-6 lg:p-10 text-center border-white/10"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 shadow-glass flex items-center justify-center mx-auto mb-4 border border-white/10">
                <CheckCircle2 className="text-brand-primary" size={28} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-black text-white tracking-tighter mb-2 uppercase">
                SPOT <span className="text-brand-primary italic">READY.</span>
              </h2>
              <p className="text-zinc-400 text-xs lg:text-sm font-medium mb-6 max-w-md mx-auto">
                The seat for <span className="text-white font-black">{workerName}</span> has been initialized. Send the link below to your worker.
              </p>

              <div className="p-4 rounded-xl bg-white/5 shadow-glass border border-white/10 mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex-grow text-left overflow-hidden">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Invite Link</p>
                    <p className="text-xs font-bold text-white truncate">{inviteLink}</p>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className={`p-3 rounded-lg shadow-glass border border-white/10 transition-all ${copied ? 'bg-brand-primary text-white border-brand-primary/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/owner/dashboard" className="tactile-btn-light flex-1 py-4 text-sm">
                  Dashboard
                </Link>
                <button onClick={() => setStep('payment')} className="tactile-btn-dark flex-1 py-4 text-sm">
                  Add Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
