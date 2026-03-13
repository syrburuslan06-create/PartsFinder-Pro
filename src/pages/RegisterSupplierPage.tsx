import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layers, Mail, Lock, User, ArrowRight, Building2, Sparkles, CheckCircle2, PackageSearch } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function RegisterSupplierPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: ''
  });

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      alert('Supabase is not configured. Please use demo login.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/supplier/dashboard`
        }
      });
      if (error) throw error;
      
      localStorage.setItem('userRole', 'supplier');
    } catch (error) {
      console.error('Supabase Google login error:', error);
      alert('Failed to initialize Google login. Please ensure Supabase is correctly configured.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please use demo login.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let authUser = null;
      let authSession = null;
      const normalizedEmail = formData.email.toLowerCase().trim();

      // First try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: 'supplier'
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered') || signUpError.status === 400) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: formData.password,
          });
          
          if (signInError) {
            if (signInError.message.includes('Email not confirmed')) {
              console.warn("Email not confirmed, but logging in locally for demo purposes.");
              authUser = { id: 'demo-user-' + Date.now() };
            } else {
              throw signInError;
            }
          } else {
            authUser = signInData.user;
            authSession = signInData.session;
          }
        } else if (signUpError.message.includes('security purposes') || signUpError.status === 429) {
          console.warn("Rate limit hit, logging in locally for demo purposes.");
          authUser = { id: 'demo-user-' + Date.now() };
        } else {
          throw signUpError;
        }
      } else {
        authUser = signUpData.user;
        authSession = signUpData.session;
      }

      if (authUser) {
        // Check if company already exists for this user
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', authUser.id)
          .maybeSingle();

        let companyId = existingCompany?.id;

        if (!companyId) {
          const { data: company, error: companyError } = await supabase
            .from('companies')
            .insert({
              name: formData.companyName || 'My Supplier Company',
              owner_id: authUser.id,
              seat_limit: 15,
              plan: 'free'
            })
            .select()
            .single();

          if (companyError) {
            console.error("Company creation error:", companyError);
            companyId = 'demo-company-' + authUser.id;
          } else {
            companyId = company.id;
          }
        }

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!existingProfile) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: authUser.id,
            full_name: formData.name || 'Supplier',
            role: 'supplier',
            company_id: companyId
          });
          
          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
        }

        localStorage.setItem('userRole', 'supplier');
        localStorage.setItem('userEmail', normalizedEmail);
        localStorage.setItem('currentUser', JSON.stringify({
          name: formData.name || 'Supplier',
          email: normalizedEmail,
          role: 'supplier'
        }));
        if (companyId) localStorage.setItem('companyId', companyId);
        
        navigate('/supplier/dashboard');
      }
    } catch (error: any) {
      console.error('Supabase Registration Error:', error);
      let message = error.message || 'Registration failed';
      if (message.includes('security purposes')) {
        const seconds = message.match(/\d+/)?.[0] || 'some';
        message = `Slow down! For security purposes, please wait ${seconds} seconds before trying to register again.`;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex pt-32 lg:pt-0 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-cta/5 blur-[160px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 blur-[160px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-10 bg-grid mask-fade-y" />
      </div>

      {/* Left Side - Visual */}
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
              Supplier Network Core
            </div>
            <h1 className="text-7xl xl:text-9xl font-display font-black mb-8 tracking-tighter leading-[0.85] text-white uppercase">
              SUPPLIER <br />
              <span className="text-brand-primary italic">PORTAL.</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed font-medium max-w-md">
              Connect your inventory to thousands of buyers. Manage your catalog, track orders, and grow your business.
            </p>

            <div className="space-y-8">
              <FeatureItem text="Bulk CSV Catalog Upload" />
              <FeatureItem text="Real-time Inventory Management" />
              <FeatureItem text="Instant Order Notifications" />
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
            <span className="text-xl font-display font-black tracking-tighter text-white">PFPRO</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:mb-12">
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-3 lg:mb-4 text-white tracking-tight">Register Supplier</h2>
            <p className="text-zinc-400 font-medium text-base lg:text-lg">Initialize your distribution core.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="tactile-input w-full py-4 pl-12 pr-4"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Supplier Company Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Global Parts Dist."
                    className="tactile-input w-full py-4 pl-12 pr-4"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="sales@example.com"
                    className="tactile-input w-full py-4 pl-12 pr-4"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Password</label>
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

            <button 
              type="submit" 
              disabled={isLoading}
              className="tactile-btn-light w-full py-5 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? 'Processing...' : 'Create Supplier Account'}
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

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-zinc-400 font-medium">
              Not a supplier?{' '}
              <Link to="/register" className="text-white hover:text-brand-primary transition-colors font-black uppercase tracking-widest text-xs">
                Change Role
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
