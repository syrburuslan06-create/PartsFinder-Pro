import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Building2, Clock, Search, ShieldAlert, 
  Trash2, Ban, CheckCircle2, BarChart3, TrendingUp,
  Activity, ArrowUpRight, X, Filter, MoreVertical,
  ShieldCheck, AlertTriangle, Loader2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface PlatformStats {
  totalUsers: number;
  totalCompanies: number;
  totalTimeSpent: string;
  adminTimeSpent: string;
  activeSessions: number;
}

interface CompanyRecord {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  status: 'active' | 'blocked';
  joinedDate: string;
  seats: number;
}

interface MechanicRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  hoursThisWeek: number;
  hoursThisMonth: number;
  lastActive: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [mechanics, setMechanics] = useState<MechanicRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [isLockdown, setIsLockdown] = useState(() => {
    return localStorage.getItem('system_lockdown') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [adminTimer, setAdminTimer] = useState(0);
  const [activeTab, setActiveTab] = useState<'companies' | 'mechanics' | 'logs' | 'security'>('companies');

  useEffect(() => {
    async function fetchAdminData() {
      setIsLoading(true);
      if (!isSupabaseConfigured) {
        setCompanies([]);
        setMechanics([]);
        setAuditLogs([]);
        setIsLoading(false);
        return;
      }
      try {
        // Fetch companies
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*, profiles!companies_owner_id_fkey(full_name, email)');

        if (companiesError) throw companiesError;

        const formattedCompanies: CompanyRecord[] = companiesData.map(c => ({
          id: c.id,
          name: c.name,
          ownerName: c.profiles?.full_name || 'Unknown',
          email: c.profiles?.email || 'Unknown',
          status: 'active', // Assuming active for now, could add a status column
          joinedDate: new Date(c.created_at).toLocaleDateString(),
          seats: c.seat_limit || 0
        }));
        setCompanies(formattedCompanies);

        // Fetch mechanics
        const { data: mechanicsData, error: mechanicsError } = await supabase
          .from('profiles')
          .select('*, companies(name)')
          .eq('role', 'mechanic');

        if (mechanicsError) throw mechanicsError;

        const formattedMechanics: MechanicRecord[] = mechanicsData.map(m => ({
          id: m.id,
          name: m.full_name || 'Unknown',
          company: m.companies?.name || 'Independent',
          email: m.email || 'Unknown',
          hoursThisWeek: 0, // Mock for now
          hoursThisMonth: 0, // Mock for now
          lastActive: new Date(m.created_at).toLocaleDateString() // Using created_at as a fallback
        }));
        setMechanics(formattedMechanics);

        // Fetch audit logs (searches)
        const { data: searchesData, error: searchesError } = await supabase
          .from('searches')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (searchesError) throw searchesError;
        
        const formattedLogs: AuditLog[] = searchesData.map(s => ({
          id: s.id,
          user: s.profiles?.full_name || 'Unknown',
          action: 'SEARCH',
          target: s.query,
          timestamp: new Date(s.created_at).toLocaleTimeString()
        }));
        setAuditLogs(formattedLogs);

        // Fetch security logs
        const { data: securityData, error: securityError } = await supabase
          .from('security_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (securityError) throw securityError;

        const formattedSecurityLogs = securityData.map(s => ({
          id: s.id,
          email: s.email_tried || 'Unknown',
          ip: s.ip_address || 'Unknown',
          type: s.event_type,
          severity: s.severity,
          details: s.details,
          timestamp: new Date(s.created_at).toLocaleString()
        }));
        setSecurityLogs(formattedSecurityLogs);

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const toggleLockdown = () => {
    const newState = !isLockdown;
    setIsLockdown(newState);
    localStorage.setItem('system_lockdown', newState.toString());
  };

  const clearSecurityLogs = () => {
    setSecurityLogs([]);
  };

  // Admin Session Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setAdminTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBlockCompany = (id: string) => {
    setCompanies(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c
    ));
  };

  const handleDeleteMechanic = (id: string) => {
    if (window.confirm('Are you sure you want to delete this mechanic account? This action cannot be undone.')) {
      setMechanics(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMechanics = mechanics.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-8 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest mb-2 border border-red-500/20">
              <ShieldAlert size={10} />
              Super Admin Access Only
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
              PLATFORM <span className="text-brand-primary italic">CONTROL.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="tactile-card p-4 flex items-center gap-4 border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Clock className="text-brand-primary" size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Admin Session</p>
                <p className="text-lg font-mono font-black text-white">{formatTime(adminTimer)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users />} label="Total Users" value={companies.length + mechanics.length} trend="+12% this week" />
          <StatCard icon={<Building2 />} label="Total Companies" value={companies.length} trend="+2 new today" />
          <StatCard icon={<Activity />} label="Active Sessions" value={14} trend="Live now" />
          <StatCard icon={<BarChart3 />} label="Avg. Time / User" value="4.2 hrs" trend="+0.5 hrs vs last week" />
        </div>

        {/* Management Section */}
        <div className="tactile-card border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
              <button 
                onClick={() => setActiveTab('companies')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'companies' ? 'bg-white/10 text-white shadow-glow' : 'text-zinc-500 hover:text-white'}`}
              >
                Companies
              </button>
              <button 
                onClick={() => setActiveTab('mechanics')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mechanics' ? 'bg-white/10 text-white shadow-glow' : 'text-zinc-500 hover:text-white'}`}
              >
                Mechanics
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white shadow-glow' : 'text-zinc-500 hover:text-white'}`}
              >
                Audit Logs
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-white/10 text-white shadow-glow' : 'text-zinc-500 hover:text-white'}`}
              >
                Security
              </button>
            </div>

            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tactile-input pl-12 py-3 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Entity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact / Company</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Usage / Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeTab === 'companies' ? (
                  filteredCompanies.map(company => (
                    <tr key={company.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase">{company.name}</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Joined {company.joinedDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-bold text-white">{company.ownerName}</p>
                        <p className="text-[10px] text-zinc-500">{company.email}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-xs font-black text-white">{company.seats}</p>
                            <p className="text-[8px] text-zinc-500 uppercase font-black">Seats</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                            company.status === 'active' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-red-400 border-red-400/30 bg-red-400/10'
                          }`}>
                            {company.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button 
                          onClick={() => handleBlockCompany(company.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            company.status === 'active' 
                              ? 'text-zinc-500 border-white/10 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10' 
                              : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20'
                          }`}
                          title={company.status === 'active' ? 'Block Company' : 'Unblock Company'}
                        >
                          {company.status === 'active' ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'mechanics' ? (
                  filteredMechanics.map(mechanic => (
                    <tr key={mechanic.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 font-black">
                            {mechanic.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase">{mechanic.name}</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Last active: {mechanic.lastActive}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-bold text-white">{mechanic.company}</p>
                        <p className="text-[10px] text-zinc-500">{mechanic.email}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-6">
                          <div>
                            <p className="text-xs font-black text-white">{mechanic.hoursThisWeek}h</p>
                            <p className="text-[8px] text-zinc-500 uppercase font-black">This Week</p>
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">{mechanic.hoursThisMonth}h</p>
                            <p className="text-[8px] text-zinc-500 uppercase font-black">This Month</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button 
                          onClick={() => handleDeleteMechanic(mechanic.id)}
                          className="p-2 rounded-lg border border-white/10 text-zinc-500 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all"
                          title="Delete Account"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'logs' ? (
                  auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6">
                        <p className="text-sm font-black text-white uppercase">{log.user}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">ID: {log.id}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase border text-brand-primary border-brand-primary/30 bg-brand-primary/10">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-bold text-white">{log.target}</p>
                        <p className="text-[10px] text-zinc-500">{log.timestamp}</p>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2 rounded-lg border border-white/10 text-zinc-500 hover:text-white transition-all">
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  securityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6">
                        <p className="text-sm font-black text-white uppercase">{log.email}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">IP: {log.ip}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          log.severity === 'critical' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                          log.severity === 'warning' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                          'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-bold text-white">{log.details ? JSON.stringify(log.details) : 'No details'}</p>
                        <p className="text-[10px] text-zinc-500">{log.timestamp}</p>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2 rounded-lg border border-white/10 text-zinc-500 hover:text-red-400 transition-all">
                          <Ban size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {activeTab === 'security' && securityLogs.length > 0 && (
              <div className="p-6 border-t border-white/5 flex justify-end">
                <button 
                  onClick={clearSecurityLogs}
                  className="tactile-btn-dark px-6 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 border-red-500/20 hover:bg-red-500/10"
                >
                  Clear Security Logs
                </button>
              </div>
            )}
          </div>
        </div>

        {/* System Health & Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 tactile-card p-6 border-white/10">
            <h3 className="text-lg font-display font-black text-white mb-6 flex items-center gap-3">
              <Activity size={18} className="text-brand-primary" />
              System Health
            </h3>
            <div className="space-y-6">
              <HealthItem label="Database Core" status="Operational" latency="12ms" />
              <HealthItem label="Gemini AI API" status="Operational" latency="145ms" />
              <HealthItem label="Image Processing" status="Operational" latency="89ms" />
              <HealthItem label="Auth Gateway" status="Operational" latency="5ms" />
            </div>
          </div>

          <div className="tactile-card p-6 border-red-500/20 bg-red-500/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-black text-white flex items-center gap-3">
                <AlertTriangle size={18} className="text-red-500" />
                Security Control
              </h3>
              <button 
                onClick={toggleLockdown}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                  isLockdown 
                    ? 'bg-red-500 text-white border-red-600 shadow-glow' 
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {isLockdown ? 'LOCKDOWN ACTIVE' : 'SYSTEM OPEN'}
              </button>
            </div>
            <div className="space-y-4">
              {isLockdown && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert size={14} />
                  Emergency Lockdown Enabled
                </div>
              )}
              <AlertItem 
                type="warning" 
                title="Multiple Login Failures" 
                desc="IP 192.168.1.45 attempted 10+ logins on mike@logpro.com" 
              />
              <AlertItem 
                type="info" 
                title="New High-Volume User" 
                desc="Sarah Chen performed 50+ searches in the last hour." 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthItem({ label, status, latency }: { label: string, status: string, latency: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow" />
        <span className="text-sm font-bold text-white uppercase tracking-tight">{label}</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{status}</span>
        <span className="text-[10px] font-mono text-zinc-500">{latency}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string | number, trend: string }) {
  return (
    <div className="tactile-card p-6 border-white/10 hover:border-brand-primary/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-brand-primary transition-colors">
          {icon}
        </div>
        <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
      </div>
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-display font-black text-white mb-2">{value}</p>
      <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{trend}</p>
    </div>
  );
}

function AlertItem({ type, title, desc }: { type: 'warning' | 'info' | 'danger', title: string, desc: string }) {
  const colors = {
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    info: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20',
    danger: 'text-red-400 bg-red-400/10 border-red-400/20'
  };

  return (
    <div className={`p-3 rounded-xl border ${colors[type]}`}>
      <p className="text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <p className="text-[9px] font-medium opacity-80 leading-relaxed">{desc}</p>
    </div>
  );
}
