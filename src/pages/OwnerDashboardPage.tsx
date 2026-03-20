import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Clock, Search, MapPin, 
  Calendar, CreditCard, ArrowUpRight, History,
  Activity, Shield, ExternalLink, Copy, Check, X, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkerHistoryItem {
  part: string;
  time: string;
  vehicle: string;
  status: string;
}

interface WorkerActivity {
  id: string;
  workerName: string;
  initial: string;
  action: string;
  partSearched: string;
  timestamp: string;
  location: string;
  hoursWorked: string;
  history: WorkerHistoryItem[];
}

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function OwnerDashboardPage() {
  const [workers, setWorkers] = useState<WorkerActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerActivity | null>(null);
  const [copied, setCopied] = useState(false);
  const [ownerName, setOwnerName] = useState('Fleet Manager');
  const [stats, setStats] = useState({
    workersOnline: 0,
    totalWorkers: 0,
    partsSourcedToday: 0,
    fleetEfficiency: 94,
    totalSavedParts: 0,
    totalInventory: 0,
    totalSearches: 0
  });
  const [searchTries] = useState(() => {
    const saved = localStorage.getItem('owner_search_tries');
    return saved ? parseInt(saved) : 5;
  });
  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!companyId || !isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Fetch owner name
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          if (profile?.full_name) {
            setOwnerName(profile.full_name);
          }
        }

        // 1. Fetch workers (profiles)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', companyId);

        if (profilesError) throw profilesError;

        const workerProfiles = profiles.filter(p => p.role === 'worker');

        // 2. Fetch searches for the company
        const { data: searches, error: searchesError } = await supabase
          .from('searches')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        if (searchesError) throw searchesError;

        // 3. Fetch saved parts for the company
        // Since saved_parts is linked to mechanic_id, we fetch for all workers
        const workerIds = profiles.map(p => p.id);
        const { count: savedPartsCount } = await supabase
          .from('saved_parts')
          .select('*', { count: 'exact', head: true })
          .in('mechanic_id', workerIds);

        // 4. Fetch inventory for the company
        const { count: inventoryCount } = await supabase
          .from('inventory')
          .select('*', { count: 'exact', head: true })
          .in('user_id', workerIds);

        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const searchesToday = searches.filter(s => new Date(s.created_at) >= today).length;
        
        // Mock "online" status based on recent activity (last 30 mins)
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
        const onlineWorkerIds = new Set(
          searches
            .filter(s => new Date(s.created_at) >= thirtyMinsAgo)
            .map(s => s.worker_id)
        );

        setStats({
          workersOnline: onlineWorkerIds.size,
          totalWorkers: workerProfiles.length,
          partsSourcedToday: searchesToday,
          fleetEfficiency: workerProfiles.length > 0 ? Math.min(98, 85 + (searchesToday / (workerProfiles.length || 1)) * 2) : 0,
          totalSavedParts: savedPartsCount || 0,
          totalInventory: inventoryCount || 0,
          totalSearches: searches.length
        });

        // Map to WorkerActivity format
        const activityMap: WorkerActivity[] = workerProfiles.map(profile => {
          const profileSearches = searches.filter(s => s.worker_id === profile.id);
          const latestSearch = profileSearches[0];

          return {
            id: profile.id,
            workerName: profile.full_name,
            initial: profile.full_name.split(' ').map((n: string) => n[0]).join(''),
            action: latestSearch && new Date(latestSearch.created_at) >= thirtyMinsAgo ? 'ACTIVE' : 'IDLE',
            partSearched: latestSearch ? latestSearch.result_part_name || latestSearch.query : 'None',
            timestamp: latestSearch ? new Date(latestSearch.created_at).toLocaleString() : 'N/A',
            location: 'Field Unit',
            hoursWorked: 'N/A',
            history: profileSearches.slice(0, 10).map(s => ({
              part: s.result_part_name || s.query,
              time: new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              vehicle: s.search_type || 'Unit #',
              status: s.result_part_number ? 'Verified' : 'Searching'
            }))
          };
        });

        setWorkers(activityMap);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [companyId]);

  const inviteLink = `${window.location.origin}/register/mechanic?company=${companyId || 'fleet-alpha-99'}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg pt-4 lg:pt-8 pb-32 lg:pb-8 px-4 lg:px-6 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div>
            <h1 className="text-3xl lg:text-5xl font-display font-black text-white tracking-tighter uppercase leading-none">
              FLEET <span className="text-brand-primary italic">OVERVIEW.</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold mt-2 uppercase tracking-widest">Welcome back, {ownerName}</p>
          </div>

          <div className="flex flex-wrap gap-3 lg:gap-4">
            <div className="tactile-card p-3 lg:p-4 flex items-center gap-4 border-brand-primary/30 bg-brand-primary/5 flex-1 lg:flex-none">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 shadow-glow flex items-center justify-center border border-brand-primary/30">
                <Users className="text-brand-primary" size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Workers Online</p>
                <p className="text-base font-black text-white">{stats.workersOnline} Active Now</p>
              </div>
            </div>

            <div className="tactile-card p-3 lg:p-4 flex items-center gap-4 border-white/10 flex-1 lg:flex-none">
              <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass flex items-center justify-center border border-white/10">
                <Activity className="text-white" size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Fleet Efficiency</p>
                <p className="text-base font-black text-white">{stats.fleetEfficiency.toFixed(1)}% Optimal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1">
          {/* Stats Overview */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <div className="tactile-card p-6 border-white/10">
              <h3 className="text-lg font-display font-black text-white mb-6 flex items-center gap-3">
                <Activity size={18} className="text-white" />
                Fleet Overview
              </h3>
              <div className="space-y-6">
                <StatRow label="Workers Online" value={`${stats.workersOnline} / ${stats.totalWorkers} Active`} progress={(stats.workersOnline / (stats.totalWorkers || 1)) * 100} />
                <StatRow label="Parts Sourced Today" value={`${stats.partsSourcedToday} Units`} progress={Math.min(100, (stats.partsSourcedToday / 50) * 100)} />
                <StatRow label="Fleet Efficiency" value={`${stats.fleetEfficiency.toFixed(0)}%`} progress={stats.fleetEfficiency} />
              </div>
            </div>

            <div className="tactile-card p-6 border-white/10 bg-white/5">
              <h3 className="text-lg font-display font-black text-white mb-6 flex items-center gap-3">
                <Shield size={18} className="text-brand-primary" />
                Asset Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Saved Parts</p>
                  <p className="text-xl font-black text-white">{stats.totalSavedParts}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Inventory</p>
                  <p className="text-xl font-black text-white">{stats.totalInventory}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Searches</p>
                  <p className="text-xl font-black text-white">{stats.totalSearches}</p>
                </div>
              </div>
            </div>

            <div className="tactile-card p-6 border-white/10">
              <h3 className="text-lg font-display font-black text-white mb-4 flex items-center gap-3">
                <History size={18} className="text-brand-primary" />
                Recent Fleet Searches
              </h3>
              <div className="space-y-3">
                {workers.flatMap(w => w.history).slice(0, 5).map((search, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white truncate max-w-[150px]">{search.part}</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{search.vehicle}</span>
                    </div>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                      {search.time}
                    </span>
                  </div>
                ))}
                {workers.length === 0 && (
                  <p className="text-center py-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">No recent searches</p>
                )}
              </div>
            </div>

            <div className="tactile-card p-6 bg-brand-primary/10 text-white border-brand-primary/20 shadow-glow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-display font-black flex items-center gap-3">
                  <CreditCard size={18} />
                  Billing Status
                </h3>
                <div className="text-right">
                  <p className="text-[8px] font-black text-brand-primary uppercase tracking-widest">Next Payment</p>
                  <p className="text-xs font-black text-white">March 15</p>
                </div>
              </div>
              <p className="text-white/80 text-xs font-medium mb-4 leading-relaxed">Your current plan covers 15 worker seats. Add more seats to scale your operation.</p>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <Search size={14} className="text-brand-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Free Trial Tries</span>
                </div>
                <span className="text-xs font-black text-white">{searchTries} / 5 Left</span>
              </div>

              <button className="tactile-btn-light w-full py-3 text-xs">
                Manage Subscription
              </button>
            </div>

            <div className="tactile-card p-6 border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-black text-white flex items-center gap-3">
                  <UserPlus size={18} className="text-brand-primary" />
                  Recruit Team
                </h3>
                <Link to="/owner/add-worker" className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all border border-brand-primary/20">
                  <UserPlus size={14} />
                </Link>
              </div>
              <p className="text-zinc-400 text-xs font-medium mb-6 leading-relaxed">
                Share this unique link with your workers. They will be automatically linked to your fleet upon registration.
              </p>
              <div className="relative group">
                <input 
                  type="text" 
                  readOnly 
                  value={inviteLink}
                  className="tactile-input w-full py-3 pl-4 pr-12 text-[10px] font-mono border-white/10 bg-white/5"
                />
                <button 
                  onClick={copyInviteLink}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-brand-primary"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              {copied && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[9px] text-brand-primary font-black uppercase tracking-widest mt-2 text-center"
                >
                  Link Copied to Clipboard
                </motion.p>
              )}
            </div>
          </div>

          {/* Worker Activity Feed */}
          <div className="lg:col-span-8">
            <div className="tactile-card p-6 h-full border-brand-primary/50 shadow-glow relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-black text-white flex items-center gap-3">
                  <History size={18} className="text-white" />
                  Worker Activity
                </h3>
                <button className="text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
                  Export Logs
                </button>
              </div>

              <div className="space-y-3">
                {isLoading ? (
                  <div className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-brand-primary mb-4" size={32} />
                    <p className="text-zinc-500 font-bold">Synchronizing Fleet Data...</p>
                  </div>
                ) : workers.map((worker) => (
                  <div 
                    key={worker.id} 
                    onClick={() => setSelectedWorker(worker)}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/50 hover:bg-white/[0.08] transition-all group cursor-pointer"
                  >
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 shadow-glass flex items-center justify-center border border-white/10 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 transition-all">
                          <Users className="text-zinc-500 group-hover:text-brand-primary transition-colors" size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-white leading-tight">{worker.workerName}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest bg-brand-primary px-2 py-0.5 rounded shadow-glow">
                              {worker.action}
                            </span>
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Clock size={10} />
                              {worker.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 flex-grow lg:flex-grow-0">
                        <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Part</p>
                          <p className="text-sm font-bold text-white truncate max-w-[140px]">{worker.partSearched}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Location</p>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5 truncate max-w-[140px]">
                            <MapPin size={12} className="text-brand-primary" />
                            {worker.location}
                          </p>
                        </div>
                      </div>

                      <button className="self-center p-3 rounded-xl bg-white/5 shadow-glass border border-white/10 text-zinc-400 group-hover:text-white group-hover:border-brand-primary/30 group-hover:bg-brand-primary/10 transition-all">
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {workers.length === 0 && (
                <div className="py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 shadow-glass flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Users className="text-zinc-300" size={32} />
                </div>
                  <p className="text-zinc-500 font-bold">No active workers yet.</p>
                  <p className="text-zinc-400 text-sm mt-2">Add a worker seat to start tracking activity.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Worker History Modal */}
      <AnimatePresence>
        {selectedWorker && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWorker(null)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-bg-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-xl shadow-glow">
                    {selectedWorker.initial}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">{selectedWorker.workerName}</h3>
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Worker Activity Log</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Recent Search History</h4>
                <div className="space-y-4">
                  {selectedWorker.history.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Search size={14} className="text-brand-primary" />
                          <span className="text-sm font-bold text-white">{item.part}</span>
                        </div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                          <Clock size={12} />
                          {item.vehicle}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          item.status === 'Ordered' ? 'text-brand-secondary border-brand-secondary/30 bg-brand-secondary/10' :
                          item.status === 'Verified' ? 'text-brand-primary border-brand-primary/30 bg-brand-primary/10' :
                          item.status === 'No Stock' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                          'text-amber-400 border-amber-400/30 bg-amber-400/10'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border-t border-white/5">
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="tactile-btn-light w-full py-4 text-xs"
                >
                  Close Activity Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatRow({ label, value, progress }: { label: string, value: string, progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
      </div>
      <div className="h-2 w-full bg-white/5 shadow-glass rounded-full overflow-hidden border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-brand-primary shadow-glow"
        />
      </div>
    </div>
  );
}
