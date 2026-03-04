import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserCog, Building2, ArrowRight, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function RegisterRoleSelectionPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cta/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 lg:mb-16 text-center relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-3 mb-6 lg:mb-10 group">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-glass border border-white/10 group-hover:shadow-glow transition-all">
            <Layers className="text-brand-primary" size={28} lg:size={32} />
          </div>
          <span className="text-3xl lg:text-4xl font-display font-black tracking-tighter text-white">PF PRO</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-4 lg:px-6 py-1.5 lg:py-2 rounded-full bg-white/5 shadow-glass border border-white/10 text-white text-[9px] lg:text-[10px] font-black mb-6 lg:mb-8 tracking-[0.2em] uppercase">
          <Sparkles size={12} lg:size={14} className="animate-pulse text-brand-primary" />
          Initialize Your Professional Core
        </div>
        <h1 className="text-4xl lg:text-8xl font-display font-black text-white tracking-tighter mb-4 lg:mb-6 leading-[0.9]">
          CHOOSE YOUR <br /><span className="text-brand-primary italic">OPERATIONAL PATH.</span>
        </h1>
        <p className="text-zinc-400 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Select your professional identity to calibrate the matrix for your specific sourcing requirements.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl relative z-10">
        {/* Company Owner Option */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group"
        >
          <Link to="/register/owner" className="block h-full">
            <div className="tactile-card h-full p-8 lg:p-16 flex flex-col items-center text-center border-white/10 group-hover:border-brand-primary/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={80} lg:size={120} />
              </div>
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[1.5rem] lg:rounded-[2rem] bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mb-6 lg:mb-10 group-hover:bg-brand-primary/10 group-hover:shadow-glow transition-all">
                <Building2 size={40} lg:size={48} className="text-white group-hover:text-brand-primary transition-colors" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-black text-white mb-4 lg:mb-6">Company Owner</h2>
              <p className="text-zinc-400 text-sm lg:text-base font-medium mb-8 lg:mb-10 flex-grow leading-relaxed">
                Full administrative oversight. Manage multiple fleets, procurement teams, and enterprise-level logistics with real-time tracking.
              </p>
              <div className="tactile-btn-light w-full py-5 group-hover:shadow-glow transition-all">
                Register as Owner
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Mechanic Option */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group"
        >
          <Link to="/register/mechanic" className="block h-full">
            <div className="tactile-card h-full p-8 lg:p-16 flex flex-col items-center text-center border-white/10 group-hover:border-brand-primary/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={80} lg:size={120} />
              </div>
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[1.5rem] lg:rounded-[2rem] bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mb-6 lg:mb-10 group-hover:bg-brand-primary/10 group-hover:shadow-glow transition-all">
                <UserCog size={40} lg:size={48} className="text-white group-hover:text-brand-primary transition-colors" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-black text-white mb-4 lg:mb-6">Professional Mechanic</h2>
              <p className="text-zinc-400 text-sm lg:text-base font-medium mb-8 lg:mb-10 flex-grow leading-relaxed">
                Precision sourcing tools. Access technical specs, AI-powered compatibility checks, and direct supplier feeds for daily operations.
              </p>
              <div className="tactile-btn-dark w-full py-5 group-hover:bg-white/10 transition-all">
                Register as Mechanic
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 text-center relative z-10"
      >
        <p className="text-zinc-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-black uppercase tracking-widest text-xs hover:text-brand-primary transition-colors ml-2">
            Log in to Dashboard
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
