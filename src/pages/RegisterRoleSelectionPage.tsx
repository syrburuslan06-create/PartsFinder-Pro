import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserCog, Building2, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function RegisterRoleSelectionPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 lg:px-12 relative overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cta/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-10 bg-grid mask-fade-y" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center relative z-10 max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 lg:px-6 py-1.5 lg:py-2 rounded-full bg-white/5 shadow-glass border border-white/10 text-white text-[9px] lg:text-[10px] font-bold mb-8 tracking-[0.2em] uppercase backdrop-blur-md">
          <Sparkles size={12} lg:size={14} className="animate-pulse text-brand-primary" />
          Initialize Your Professional Core
        </div>
        <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight mb-6 leading-[0.9]">
          CHOOSE YOUR <br /><span className="text-brand-primary italic">OPERATIONAL PATH.</span>
        </h1>
        <p className="text-zinc-400 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Select your professional identity to calibrate the matrix for your specific sourcing requirements.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
        {/* Director Option */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group h-full"
        >
          <Link to="/register/owner" className="block h-full">
            <div className="tactile-card h-full p-8 lg:p-10 flex flex-col items-center text-center border-white/10 group-hover:border-brand-primary/30 transition-all relative overflow-hidden bg-white/[0.02] hover:bg-white/[0.04]">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={100} />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all">
                <Building2 size={32} className="text-white group-hover:text-brand-primary transition-colors" />
              </div>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-white mb-3 uppercase tracking-tight">Director</h2>
              <p className="text-zinc-400 text-xs font-medium mb-8 flex-grow leading-relaxed">
                Full administrative oversight. Manage multiple fleets, procurement teams, and enterprise-level logistics with real-time tracking.
              </p>
              <div className="tactile-btn-light w-full py-3 group-hover:shadow-glow transition-all text-xs">
                Register as Director
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform ml-2" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Individual Option */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group h-full"
        >
          <Link to="/register/mechanic" className="block h-full">
            <div className="tactile-card h-full p-8 lg:p-10 flex flex-col items-center text-center border-white/10 group-hover:border-brand-primary/30 transition-all relative overflow-hidden bg-white/[0.02] hover:bg-white/[0.04]">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={100} />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all">
                <UserCog size={32} className="text-white group-hover:text-brand-primary transition-colors" />
              </div>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-white mb-3 uppercase tracking-tight">Individual</h2>
              <p className="text-zinc-400 text-xs font-medium mb-8 flex-grow leading-relaxed">
                Precision sourcing tools. Access technical specs, AI-powered compatibility checks, and direct supplier feeds for daily operations.
              </p>
              <div className="tactile-btn-dark w-full py-3 group-hover:bg-white/10 transition-all text-xs">
                Register as Individual
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform ml-2" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Supplier Option */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -10, scale: 1.02 }}
          className="group h-full"
        >
          <Link to="/register/supplier" className="block h-full">
            <div className="tactile-card h-full p-8 lg:p-10 flex flex-col items-center text-center border-white/10 group-hover:border-brand-primary/30 transition-all relative overflow-hidden bg-white/[0.02] hover:bg-white/[0.04]">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 size={100} />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all">
                <Building2 size={32} className="text-white group-hover:text-brand-primary transition-colors" />
              </div>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-white mb-3 uppercase tracking-tight">Supplier</h2>
              <p className="text-zinc-400 text-xs font-medium mb-8 flex-grow leading-relaxed">
                Connect your inventory to thousands of buyers. Manage your catalog, track orders, and grow your business.
              </p>
              <div className="tactile-btn-dark w-full py-3 group-hover:bg-white/10 transition-all text-xs">
                Register as Supplier
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform ml-2" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center relative z-10"
      >
        <p className="text-zinc-500 font-medium text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-bold uppercase tracking-widest text-xs hover:text-brand-primary transition-colors ml-2 border-b border-transparent hover:border-brand-primary pb-0.5">
            Log in to Dashboard
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
