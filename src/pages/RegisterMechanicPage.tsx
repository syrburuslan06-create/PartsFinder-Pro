import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layers, Mail, Lock, User, ArrowRight, UserCog, Sparkles, CheckCircle2, Wrench, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RegisterMechanicPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'initial' | 'verify-company'>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    shareLocation: false,
    mode: 'individual' as 'individual' | 'company',
    inviteCode: ''
  });

  // Handle invite link from URL
  useEffect(() => {
    const companyFromUrl = searchParams.get('company') || searchParams.get('invite');
    if (companyFromUrl) {
      setFormData(prev => ({
        ...prev,
        mode: 'company',
        inviteCode: companyFromUrl
      }));
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/register`
        }
      });
      if (error) throw error;
      
      localStorage.setItem('userRole', 'mechanic');
    } catch (error) {
      console.error('Supabase Google login error:', error);
      alert('Failed to initialize Google login. Please ensure Supabase is correctly configured.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!formData.shareLocation) {
      setError("You must agree to share your location to register as a mechanic for your company.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: 'mechanic',
            specialization: formData.specialization
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Save user profile to Supabase 'profiles' table
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: formData.name,
          role: 'mechanic',
          company_id: formData.mode === 'company' ? formData.inviteCode : null
        });

        if (profileError) throw profileError;

        localStorage.setItem('userRole', 'mechanic');
        localStorage.setItem('userEmail', formData.email);

        // Request geolocation
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("Location captured for registration:", position.coords.latitude, position.coords.longitude);
              
              if (formData.mode === 'company') {
                if (!formData.inviteCode) {
                  alert("Please enter your company invite code.");
                  return;
                }
                localStorage.setItem('companyId', formData.inviteCode);
                localStorage.setItem('isPaid', 'true');
                navigate('/home');
              } else {
                navigate('/payment');
              }
            },
            (error) => {
              console.error("Error capturing location:", error);
              if (formData.mode === 'company') {
                localStorage.setItem('isPaid', 'true');
                navigate('/home');
              } else {
                navigate('/payment');
              }
            }
          );
        } else {
          if (formData.mode === 'company') {
            localStorage.setItem('isPaid', 'true');
            navigate('/home');
          } else {
            navigate('/payment');
          }
        }
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

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.inviteCode) {
      alert("Please enter your company invite code.");
      return;
    }
    localStorage.setItem('companyId', formData.inviteCode);
    localStorage.setItem('isPaid', 'true');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-bg flex pt-20 lg:pt-0 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 blur-[160px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-cta/5 blur-[160px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
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
              Technical Excellence Guaranteed
            </div>
            <h1 className="text-7xl xl:text-9xl font-display font-black mb-8 tracking-tighter leading-[0.85] text-white uppercase">
              MECHANIC <br />
              <span className="text-brand-primary italic">CORE.</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed font-medium max-w-md">
              Access the most powerful technical database in the industry. Find the right part, verify fitment, and resume operations in record time.
            </p>

            <div className="space-y-8">
              <FeatureItem text="AI-Powered Compatibility Matrix" />
              <FeatureItem text="Rapid Technical Documentation Access" />
              <FeatureItem text="Direct Supplier Neural Link" />
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
          {step === 'initial' ? (
            <>
              <div className="mb-8 lg:mb-12">
                <h2 className="text-4xl lg:text-5xl font-display font-black mb-3 lg:mb-4 text-white tracking-tight">Initialize Profile</h2>
                <p className="text-zinc-400 font-medium text-base lg:text-lg">Set up your professional technician identity.</p>
              </div>

              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 mb-8">
                <button 
                  onClick={() => setFormData({ ...formData, mode: 'individual' })}
                  disabled={!!searchParams.get('company') || !!searchParams.get('invite')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.mode === 'individual' ? 'bg-brand-primary text-white shadow-glow' : 'text-zinc-500 hover:text-white'} ${(searchParams.get('company') || searchParams.get('invite')) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Individual
                </button>
                <button 
                  onClick={() => setFormData({ ...formData, mode: 'company' })}
                  disabled={!!searchParams.get('company') || !!searchParams.get('invite')}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.mode === 'company' ? 'bg-brand-primary text-white shadow-glow' : 'text-zinc-500 hover:text-white'} ${(searchParams.get('company') || searchParams.get('invite')) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Company Worker
                </button>
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
                  {formData.mode === 'company' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-2">Company Invite Link or ID</label>
                      <div className="relative group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                        <input
                          type="text"
                          required
                          placeholder="Paste link or enter ID"
                          className="tactile-input w-full py-4 pl-12 pr-4 border-brand-primary/30 focus:border-brand-primary"
                          value={formData.inviteCode}
                          readOnly={!!searchParams.get('company') || !!searchParams.get('invite')}
                          onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                        />
                      </div>
                      <p className="text-[9px] text-zinc-500 font-medium ml-2 italic">
                        {searchParams.get('company') || searchParams.get('invite') 
                          ? "Automatically linked via invitation." 
                          : "Paste the unique link provided by your fleet manager."}
                      </p>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                      <input
                        type="text"
                        required
                        placeholder="Jane Smith"
                        className="tactile-input w-full py-4 pl-12 pr-4"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        placeholder="jane@example.com"
                        className="tactile-input w-full py-4 pl-12 pr-4"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Specialization</label>
                    <div className="relative group">
                      <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors z-10" size={18} />
                      <select
                        required
                        className="tactile-input w-full py-4 pl-12 pr-10 appearance-none bg-transparent relative z-0 cursor-pointer"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      >
                        <option value="" disabled className="bg-bg">Select Specialization</option>
                        <option value="Truck" className="bg-bg">Truck</option>
                        <option value="Car" className="bg-bg">Car</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-focus-within:text-white">
                        <ArrowRight size={16} className="rotate-90" />
                      </div>
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

                  <div className="pt-4">
                    <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <div className="relative flex items-center mt-1">
                        <input 
                          type="checkbox" 
                          required
                          className="peer sr-only"
                          checked={formData.shareLocation}
                          onChange={(e) => setFormData({ ...formData, shareLocation: e.target.checked })}
                        />
                        <div className="w-5 h-5 rounded bg-white/10 shadow-glass border border-white/20 peer-checked:bg-brand-primary peer-checked:border-brand-primary transition-all" />
                        <CheckCircle2 size={12} className="absolute left-1 top-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                        I agree to share my <span className="text-white font-bold">real-time location</span> and search history with my company owner as per the fleet safety and logistics policy.
                      </span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="tactile-btn-light w-full py-5 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? 'Processing...' : 'Create Mechanic Account'}
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
                  Not a mechanic?{' '}
                  <Link to="/register" className="text-white hover:text-brand-primary transition-colors font-black uppercase tracking-widest text-xs">
                    Change Role
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="mb-8">
                <h2 className="text-4xl lg:text-5xl font-display font-black mb-3 text-white tracking-tight">Verify Company</h2>
                <p className="text-zinc-400 font-medium text-lg">Authentication successful. Please enter your company invite code to continue.</p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-2">Company Invite Link or ID</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Paste link or enter ID"
                      className="tactile-input w-full py-4 pl-12 pr-4 border-brand-primary/30 focus:border-brand-primary"
                      value={formData.inviteCode}
                      readOnly={!!searchParams.get('company') || !!searchParams.get('invite')}
                      onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                    />
                  </div>
                  <p className="text-[9px] text-zinc-500 font-medium ml-2 italic">Provided by your fleet manager.</p>
                </div>

                <button type="submit" className="tactile-btn-light w-full py-5 text-lg group">
                  <span className="flex items-center justify-center gap-2">
                    Complete Registration
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button 
                  type="button"
                  onClick={() => setStep('initial')}
                  className="w-full py-2 text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Back to Profile
                </button>
              </form>
            </motion.div>
          )}
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
