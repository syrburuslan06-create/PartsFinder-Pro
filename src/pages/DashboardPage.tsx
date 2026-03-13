import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Bookmark, 
  Bell, 
  Truck, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  Plus,
  ChevronRight,
  Users,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useAppContext } from '../contexts/AppContext';

const activityData = [
  { name: 'Mon', searches: 12, saved: 4 },
  { name: 'Tue', searches: 18, saved: 7 },
  { name: 'Wed', searches: 15, saved: 3 },
  { name: 'Thu', searches: 25, saved: 9 },
  { name: 'Fri', searches: 22, saved: 6 },
  { name: 'Sat', searches: 30, saved: 12 },
  { name: 'Sun', searches: 28, saved: 10 },
];

const categoryData = [
  { name: 'Engine', value: 45 },
  { name: 'Brakes', value: 25 },
  { name: 'Transmission', value: 15 },
  { name: 'Electrical', value: 10 },
  { name: 'Suspension', value: 5 },
];

export default function DashboardPage() {
  const { 
    savedParts, 
    alerts, 
    inventory, 
    workers,
    totalSearches,
    searchHistory
  } = useAppContext();

  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  const stats = [
    { 
      label: 'Total Searches', 
      value: totalSearches, 
      change: '+12%', 
      icon: Search, 
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/10'
    },
    { 
      label: 'Saved Parts', 
      value: savedParts.length, 
      change: '+5%', 
      icon: Bookmark, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    { 
      label: 'Active Alerts', 
      value: alerts.filter(a => a.active).length, 
      change: 'Stable', 
      icon: Bell, 
      color: 'text-amber-400',
      bg: 'bg-amber-400/10'
    },
    { 
      label: 'Fleet Size', 
      value: inventory.length, 
      change: '+2', 
      icon: Truck, 
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase">
            <Activity size={10} className="text-brand-primary" />
            System Overview
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            COMMAND <span className="text-brand-primary italic">CENTER.</span>
          </h1>
          <p className="text-zinc-400 font-medium">Welcome back, {currentUser?.name}. Here's your fleet status.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/search" className="tactile-btn-light px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Plus size={16} /> New Search
          </Link>
        </div>
      </header>

      {/* Quick Search & Director Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 tactile-card p-6 flex flex-col md:flex-row items-center gap-4 bg-brand-primary/5 border-brand-primary/20"
        >
          <div className="flex-1 space-y-1 w-full">
            <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
              <Zap size={18} className="text-brand-primary" /> Quick Search
            </h3>
            <p className="text-xs text-zinc-400 font-medium">Jump straight to searching for a saved vehicle.</p>
          </div>
          <div className="flex-1 w-full flex gap-2">
            <select className="tactile-input flex-1 py-3 px-4 text-sm appearance-none">
              <option value="" disabled selected>Select Vehicle...</option>
              {inventory.map(v => (
                <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} {v.nickname ? `(${v.nickname})` : ''}</option>
              ))}
            </select>
            <Link to="/search" className="tactile-btn-light px-6 py-3 shrink-0">
              <Search size={18} />
            </Link>
          </div>
        </motion.div>

        {currentUser?.role === 'director' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="tactile-card p-6 flex items-center justify-between bg-emerald-500/5 border-emerald-500/20"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-display font-black text-white flex items-center gap-2">
                <Users size={18} className="text-emerald-400" /> Team Activity
              </h3>
              <p className="text-xs text-zinc-400 font-medium">Searches by workers today</p>
            </div>
            <div className="text-4xl font-display font-black text-emerald-400">
              {workers.reduce((acc, w) => acc + (w.searches || 0), 0)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="tactile-card p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border border-white/5 shadow-glass`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-white/5 border border-white/10 ${
                stat.change.includes('+') ? 'text-emerald-400' : 'text-zinc-500'
              }`}>
                {stat.change.includes('+') ? <ArrowUpRight size={10} /> : null}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-display font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 tactile-card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-black text-white">Search Activity</h3>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Weekly performance metrics</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Searches</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Saved</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141414', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="searches" 
                  stroke="#F27D26" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSearches)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="saved" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSaved)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="tactile-card p-8 space-y-8"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-display font-black text-white">Part Categories</h3>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Distribution by type</p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#71717a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#141414', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#F27D26' : '#ffffff10'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-brand-primary' : 'bg-zinc-700'}`} />
                  <span className="text-xs font-bold text-zinc-300">{cat.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-500">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tactile-card p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-black text-white">Recent Searches</h3>
            <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {searchHistory.length > 0 ? searchHistory.slice(0, 5).map((search, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-primary`}>
                  <Search size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{search.query}</p>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Truck size={10} /> {search.vehicleInfo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Clock size={10} /> {new Date(search.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
              </div>
            )) : (
              <div className="text-center py-8">
                <Search size={32} className="text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium text-sm">No recent searches</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Team Activity (Director Only) */}
        {currentUser?.role === 'director' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tactile-card p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-black text-white">Team Performance</h3>
              <Link to="/workers" className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">Manage Team</Link>
            </div>
            
            <div className="space-y-4">
              {workers.slice(0, 4).map((worker, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 font-display font-black">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{worker.name}</p>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{worker.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">12</p>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Searches</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
