import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Users, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'mechanic' | 'owner' | null>(null);

  const handleContinue = () => {
    if (role === 'mechanic') {
      navigate('/register/mechanic');
    } else if (role === 'owner') {
      navigate('/register/owner');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-brand-secondary/5 blur-[120px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-badge bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-[10px] font-bold uppercase tracking-wider mb-4">
            <Sparkles size={12} />
            Join the Professional Matrix
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Choose Your Path</h1>
          <p className="text-text-secondary text-lg">Select the account type that best fits your needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Individual / Mechanic */}
          <button 
            onClick={() => setRole('mechanic')}
            className={`card p-8 text-left transition-all relative overflow-hidden group ${role === 'mechanic' ? 'border-brand-primary ring-1 ring-brand-primary' : 'hover:border-brand-primary/50'}`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${role === 'mechanic' ? 'bg-brand-primary text-white' : 'bg-brand-primary/10 text-brand-primary'}`}>
              <User size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Individual</h3>
            <p className="text-text-secondary text-sm mb-6">For solo mechanics and independent contractors looking for parts.</p>
            <ul className="space-y-3">
              {['40+ Supplier Access', 'AI Photo ID', 'Real-time Stock'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-text-primary">
                  <Check size={14} className="text-brand-primary" />
                  {f}
                </li>
              ))}
            </ul>
            {role === 'mechanic' && (
              <div className="absolute top-4 right-4 text-brand-primary">
                <ShieldCheck size={20} />
              </div>
            )}
          </button>

          {/* Director / Fleet Manager */}
          <button 
            onClick={() => setRole('owner')}
            className={`card p-8 text-left transition-all relative overflow-hidden group ${role === 'owner' ? 'border-brand-secondary ring-1 ring-brand-secondary' : 'hover:border-brand-secondary/50'}`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${role === 'owner' ? 'bg-brand-secondary text-white' : 'bg-brand-secondary/10 text-brand-secondary'}`}>
              <Users size={24} />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Director</h3>
            <p className="text-text-secondary text-sm mb-6">For fleet managers and shop owners managing a team of mechanics.</p>
            <ul className="space-y-3">
              {['Team Management', 'Activity Logs', 'Centralized Billing'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-text-primary">
                  <Check size={14} className="text-brand-secondary" />
                  {f}
                </li>
              ))}
            </ul>
            {role === 'owner' && (
              <div className="absolute top-4 right-4 text-brand-secondary">
                <ShieldCheck size={20} />
              </div>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={handleContinue}
            disabled={!role}
            className={`btn-primary px-12 py-4 text-lg flex items-center gap-2 group ${!role ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continue
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-text-secondary text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
