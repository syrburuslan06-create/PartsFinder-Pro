import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Clock, Bookmark, CreditCard, 
  ArrowRight, Sparkles, Activity, Zap,
  TrendingUp, Calendar, ChevronRight,
  Package, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchResult } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function UserHomePage() {
  const navigate = useNavigate();
  const { savedParts } = useAppContext();
  const [quickSearch, setQuickSearch] = useState('');
  const [userName, setUserName] = useState('OPERATOR');
  const [totalSearches, setTotalSearches] = useState(0);
  const [hoursActive, setHoursActive] = useState(0);
  const [plan, setPlan] = useState('Free Trial');
  const [isPaid, setIsPaid] = useState(false);
  const [nextPayment, setNextPayment] = useState('N/A');
  const userRole = localStorage.getItem('userRole') || 'mechanic';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profile) {
            setUserName(profile.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'OPERATOR');
            setPlan(profile.plan === 'director' ? 'Director' : profile.is_paid ? 'Professional' : 'Free Trial');
            setIsPaid(profile.is_paid || false);
            
            if (profile.next_payment_date) {
              const date = new Date(profile.next_payment_date);
              setNextPayment(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
            }
          }

          // Get search count
          const { count: searchCount } = await supabase
            .from('search_history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          if (searchCount !== null) {
            setTotalSearches(searchCount);
          }

          // Get hours active
          try {
            const { data: sessions, error: sessionError } = await supabase
              .from('user_sessions')
              .select('duration_minutes')
              .eq('user_id', user.id);
              
            if (!sessionError && sessions) {
              const totalMinutes = sessions.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
              setHoursActive(Math.round((totalMinutes / 60) * 10) / 10);
            } else if (sessionError && sessionError.code === '42P01') {
              // Table doesn't exist, we can't create it from client, just set to 0
              setHoursActive(0);
            } else if (sessions && sessions.length === 0) {
              // Create initial session
              await supabase.from('user_sessions').insert({
                user_id: user.id,
                started_at: new Date().toISOString(),
                duration_minutes: 0
              });
            }
          } catch (e) {
            console.error('Error fetching sessions:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      // Navigate to search page with the query
      navigate(`/search?q=${encodeURIComponent(quickSearch)}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg pt-4 lg:pt-8 pb-32 lg:pb-8 px-4 lg:px-12 flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-4 lg:space-y-6 flex-1 flex flex-col">
        
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-widest mb-2 border border-brand-primary/20">
              <Sparkles size={10} className="animate-pulse" />
              Operational Core Active
            </div>
            <h1 className="text-3xl lg:text-5xl font-display font-black text-white tracking-tighter leading-none uppercase">
              HELLO, <span className="text-brand-primary italic">{userName}.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="tactile-card p-3 lg:p-4 flex items-center gap-4 border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass flex items-center justify-center border border-white/10">
                <Calendar className="text-white" size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Next Payment</p>
                <p className="text-base font-black text-white">{nextPayment}</p>
              </div>
              <Link to="/payment" className="ml-2 p-2 rounded-lg bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-all">
                <CreditCard size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Search Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tactile-card p-4 lg:p-6 border-brand-primary/20 bg-brand-primary/5 shadow-glow relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Zap size={120} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xl lg:text-2xl font-display font-black text-white mb-4 flex items-center gap-3">
              <Zap className="text-brand-primary" size={24} />
              Quick Search Matrix
            </h2>
            <form onSubmit={handleQuickSearch} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
              <input 
                type="text" 
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Enter Part #, VIN, or Vehicle Name..." 
                className="tactile-input w-full pl-14 pr-32 py-4 text-base lg:text-lg border-white/20 focus:border-brand-primary"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 tactile-btn-light py-2 px-6 text-xs"
              >
                DEPLOY
              </button>
            </form>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1">
          {/* Stats Column */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <div className="tactile-card p-6 border-white/10">
              <h3 className="text-lg font-display font-black text-white mb-6 flex items-center gap-3">
                <Activity size={18} className="text-brand-primary" />
                Performance
              </h3>
              <div className="space-y-6">
                <StatCard 
                  icon={<Search size={18} />} 
                  label="Total Searches" 
                  value={totalSearches.toString()} 
                  subValue="Lifetime"
                  color="text-brand-primary"
                />
                <StatCard 
                  icon={<Clock size={18} />} 
                  label="Hours Active" 
                  value={`${hoursActive}h`} 
                  subValue="Lifetime"
                  color="text-emerald-500"
                />
              </div>
            </div>

            <div className="tactile-card p-6 bg-white/5 border-white/10">
              <h3 className="text-lg font-display font-black text-white mb-4 flex items-center gap-3">
                <CreditCard size={18} className="text-brand-primary" />
                Subscription
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Plan</span>
                  <span className="text-xs font-black text-white uppercase">{plan}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Status</span>
                  <span className={`text-[9px] font-black uppercase flex items-center gap-2 ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {isPaid ? 'Active' : 'Trial'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Parts Column */}
          <div className="lg:col-span-8">
            <div className="tactile-card p-6 h-full border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-black text-white flex items-center gap-3">
                  <Bookmark size={18} className="text-brand-primary" />
                  Saved Inventory
                </h3>
                <Link to="/saved" className="text-[9px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                  View All <ChevronRight size={12} />
                </Link>
              </div>

              <div className="space-y-3">
                {savedParts.length > 0 ? (
                  savedParts.map((part, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-all group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <Package className="text-zinc-500 group-hover:text-brand-primary transition-colors" size={20} />
                          </div>
                          <div>
                            <p className="text-base font-black text-white group-hover:text-brand-primary transition-colors truncate max-w-[200px]">{part.partName}</p>
                            <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{part.partNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-white">{part.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <Bookmark className="text-zinc-600" size={24} />
                    </div>
                    <p className="text-zinc-500 font-bold text-sm">No parts saved.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }: { icon: React.ReactNode, label: string, value: string, subValue: string, color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-2xl font-display font-black text-white leading-none">{value}</p>
        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{subValue}</p>
      </div>
    </div>
  );
}
