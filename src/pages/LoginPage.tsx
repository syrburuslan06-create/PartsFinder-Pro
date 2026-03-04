import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const isLockdown = localStorage.getItem('system_lockdown') === 'true';
    if (isLockdown) {
      setError('System is currently under maintenance or security lockdown. Please try again later.');
      return;
    }
    
    if (!isSupabaseConfigured) {
      alert('Supabase is not connected. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the Secrets panel, or use "Guest Access" below.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/register`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Supabase Google login error:', error);
    }
  };

  const handleGuestAccess = () => {
    localStorage.setItem('isGuest', 'true');
    navigate('/register');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const isLockdown = localStorage.getItem('system_lockdown') === 'true';
    if (isLockdown && formData.email !== 'syrburuslan06@gmail.com') {
      setError('System security lockdown active. Only Super Admin access permitted.');
      setIsLoading(false);
      return;
    }

    // Simulate network delay for security
    setTimeout(() => {
      // Super Admin logic
      if (formData.email === 'syrburuslan06@gmail.com') {
        if (formData.password === 'admin123') { // Simple mock password for demo
          localStorage.setItem('isGuest', 'true');
          localStorage.setItem('userEmail', formData.email);
          localStorage.setItem('userRole', 'admin');
          navigate('/admin');
        } else {
          recordFailedAttempt(formData.email);
          setError('Invalid credentials. Access denied.');
        }
        setIsLoading(false);
        return;
      }

      // Mock validation for other users
      if (formData.email && formData.password.length >= 6) {
        localStorage.setItem('isGuest', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        const role = localStorage.getItem('userRole');
        const isPaid = localStorage.getItem('isPaid');
        const companyId = localStorage.getItem('companyId');

        if (role === 'mechanic') {
          if (isPaid === 'true' || companyId) {
            navigate('/home');
          } else {
            navigate('/payment');
          }
        } else if (role === 'owner') {
          navigate('/owner/dashboard');
        } else if (role) {
          navigate('/home');
        } else {
          navigate('/register');
        }
      } else {
        recordFailedAttempt(formData.email);
        setError('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const recordFailedAttempt = (email: string) => {
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      type: 'FAILED_LOGIN',
      email: email || 'Unknown',
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date().toLocaleTimeString()
    });
    localStorage.setItem('security_logs', JSON.stringify(logs.slice(0, 20)));
  };

  return (
    <div className="min-h-screen bg-bg flex pt-20 lg:pt-0 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 blur-[160px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-cta/5 blur-[160px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Left Side - Visual/Editorial */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-bg/50 backdrop-blur-sm items-center justify-center p-24 border-r border-white/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 shadow-glass border border-white/10 text-white text-[10px] font-black mb-12 tracking-[0.2em] uppercase">
              <Sparkles size={14} className="animate-pulse text-brand-primary" />
              Welcome back operator
            </div>
            <h1 className="text-7xl xl:text-9xl font-display font-black mb-8 tracking-tighter leading-[0.85] text-white">
              RESUME <br />
              <span className="text-brand-primary italic">OPERATIONS.</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed font-medium max-w-md">
              Your fleet is waiting. Log in to access the matrix and resume your mission-critical sourcing workflow.
            </p>

            <div className="space-y-8">
              <FeatureItem text="Access 4.2M+ Parts Database Matrix" />
              <FeatureItem text="Manage Team Procurement Orders" />
              <FeatureItem text="Track Active Global Shipments" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-24 relative min-h-[calc(100vh-5rem)] lg:min-h-screen z-10">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-glow">
              <Layers className="text-white" size={24} />
            </div>
            <span className="text-xl font-display font-black tracking-tighter text-white">PF PRO</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:mb-12">
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-3 lg:mb-4 text-white tracking-tight">Secure Login</h2>
            <p className="text-zinc-400 font-medium text-base lg:text-lg">Access your professional sourcing core.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold"
                >
                  <AlertTriangle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="tactile-input w-full py-4 pl-12 pr-4"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Password</label>
                  <a href="#" className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="tactile-input w-full py-4 pl-12 pr-4"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="tactile-btn-light w-full py-5 text-lg group">
              <span className="flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Log In to Matrix'}
                {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
                <span className="bg-bg px-4 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="tactile-btn-dark w-full py-4 flex items-center justify-center gap-3 bg-white/5 border-white/10 hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={handleGuestAccess}
              className="text-[10px] font-black text-zinc-500 hover:text-brand-primary transition-colors uppercase tracking-[0.2em]"
            >
              Explore as Guest (No Login Required)
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-zinc-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-brand-primary transition-colors font-black uppercase tracking-widest text-xs">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-white/5 shadow-glass flex items-center justify-center border border-white/10">
        <CheckCircle2 size={16} className="text-brand-primary" />
      </div>
      <span className="text-zinc-400 font-bold">{text}</span>
    </div>
  );
}
