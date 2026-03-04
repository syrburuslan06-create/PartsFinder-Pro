import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, LayoutDashboard, Settings, Bell, User, LogOut, 
  Camera, LifeBuoy, Sparkles, Bookmark, UserPlus, Car, 
  Activity, X, Home, LayoutGrid, Lightbulb, ShieldCheck, Power, Users, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { supabase } from '../lib/supabase';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'mechanic';
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('companyId');
    localStorage.removeItem('isPaid');
    localStorage.removeItem('isGuest');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen h-[100dvh] bg-bg text-ink overflow-hidden perspective-1000">
      {/* Desktop Sidebar - Refined Vertical Rail */}
      <div className="hidden lg:flex fixed left-4 top-4 bottom-4 z-50">
        <div className="w-16 h-full bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-glass flex flex-col items-center py-6 justify-between">
          <div className="flex flex-col items-center gap-6 w-full">
            <SidebarIcon 
              to="/home" 
              icon={<Home size={18} />} 
              label="Home" 
              active={location.pathname === '/home'} 
            />
            
            <div className="w-8 h-px bg-white/5" />

            <nav className="flex flex-col items-center gap-5 w-full">
              {userRole === 'admin' ? (
                <>
                  <SidebarIcon to="/admin" icon={<ShieldAlert size={18} />} label="Mission Control" active={location.pathname === '/admin'} />
                  <SidebarIcon to="/home" icon={<Activity size={18} />} label="System Health" active={false} />
                  <SidebarIcon to="/profile" icon={<Settings size={18} />} label="Config" active={location.pathname === '/profile'} />
                </>
              ) : userRole === 'owner' ? (
                <>
                  <SidebarIcon to="/owner/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/owner/dashboard'} />
                  <SidebarIcon to="/owner/dashboard" icon={<Users size={18} />} label="Team" active={false} />
                  <SidebarIcon to="/support" icon={<Lightbulb size={18} />} label="Insights" active={false} />
                  <SidebarIcon to="/profile" icon={<Settings size={18} />} label="Settings" active={location.pathname === '/profile'} />
                </>
              ) : (
                <>
                  <SidebarIcon to="/search" icon={<Search size={18} />} label="Source" active={location.pathname === '/search'} />
                  <SidebarIcon to="/saved" icon={<Bookmark size={18} />} label="Saved" active={location.pathname === '/saved'} />
                  <SidebarIcon to="/support" icon={<Lightbulb size={18} />} label="Support" active={false} />
                  <SidebarIcon to="/profile" icon={<Settings size={18} />} label="Settings" active={location.pathname === '/profile'} />
                </>
              )}
            </nav>
          </div>

          <div className="flex flex-col items-center gap-5 w-full">
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
            >
              <Power size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden lg:pl-24">
        {/* Topbar */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 lg:h-24 border-b border-white/5 bg-bg/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-12 shrink-0 z-40"
        >
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shadow-glow">
              <Search className="text-white" size={16} />
            </div>
            <span className="font-display font-black text-lg tracking-tighter text-white">PF PRO</span>
          </div>
          
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleQuickSearch} className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tactile-input w-full pl-14 pr-6 py-3.5 text-sm"
              />
            </form>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl shadow-glass border border-white/10 text-white text-[10px] font-black tracking-widest uppercase">
              <Sparkles size={12} className="animate-pulse text-brand-primary" />
              System Online
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 backdrop-blur-xl shadow-glass border border-white/10 flex items-center justify-center text-zinc-400 relative hover:text-white transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-primary rounded-full shadow-glow" />
            </motion.button>
            
            <Link to="/profile" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 backdrop-blur-xl shadow-glass border border-white/10 overflow-hidden hover:bg-white/10 transition-all flex items-center justify-center">
               <div className="text-[10px] lg:text-xs font-black text-white">AM</div>
            </Link>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto pt-4 lg:pt-0 pb-32 lg:pb-0">
          {children}
        </div>

        {/* Floating Mobile Navigation */}
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-[340px] px-4">
          <AnimatePresence>
            {isActionMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex gap-4 mb-6"
              >
                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl shadow-glow flex items-center justify-center text-white transition-all border border-white/20 group-hover:bg-white/20">
                    <Car size={24} />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md shadow-glass px-3 py-1.5 rounded-lg border border-white/10">Car Scan</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl shadow-glow flex items-center justify-center text-white transition-all border border-white/20 group-hover:bg-white/20">
                    <Activity size={24} />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md shadow-glass px-3 py-1.5 rounded-lg border border-white/10">Track</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl shadow-glow flex items-center justify-center text-white transition-all border border-white/20 group-hover:bg-white/20">
                    <Sparkles size={24} />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md shadow-glass px-3 py-1.5 rounded-lg border border-white/10">AI Core</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 w-full">
            <nav className="flex-1 h-16 px-4 bg-white/5 backdrop-blur-2xl shadow-glass rounded-full border border-white/10 flex items-center justify-between">
              <MobileNavItem to="/home" icon={<Home size={20} />} active={location.pathname === '/home'} />
              {userRole === 'owner' ? (
                <>
                  <MobileNavItem to="/owner/dashboard" icon={<LayoutDashboard size={20} />} active={location.pathname === '/owner/dashboard'} />
                </>
              ) : (
                <>
                  <MobileNavItem to="/search" icon={<Search size={20} />} active={location.pathname === '/search'} />
                </>
              )}
              
              <button 
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-glass border ${
                  isActionMenuOpen 
                    ? 'bg-brand-primary text-white rotate-90 shadow-glow border-white/20' 
                    : 'text-zinc-400 hover:text-white bg-white/10 border-white/10'
                }`}
              >
                {isActionMenuOpen ? <X size={20} /> : <Camera size={20} />}
              </button>
              
              <MobileNavItem to="/support" icon={<LifeBuoy size={20} />} active={location.pathname === '/support'} />
              <MobileNavItem to="/profile" icon={<User size={20} />} active={location.pathname === '/profile'} />
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarIcon({ to, icon, label, active = false }: { to: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link to={to} className="group relative flex flex-col items-center gap-1 w-full">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          active 
            ? 'bg-white/10 text-white shadow-glow' 
            : 'text-zinc-500 hover:text-white hover:bg-white/5'
        }`}
      >
        {icon}
      </motion.div>
      <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors ${
        active ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'
      }`}>
        {label}
      </span>
    </Link>
  );
}

function NavItem({ to, icon, label, active = false }: { to: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link 
        to={to} 
        className={`flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-300 relative group ${
          active 
            ? 'bg-white/10 text-brand-primary border border-white/20' 
            : 'text-zinc-500 hover:bg-white/5 hover:text-ink border border-transparent'
        }`}
      >
        <div className={`${active ? 'text-brand-primary' : 'text-zinc-500 group-hover:text-brand-primary'} transition-colors`}>
          {icon}
        </div>
        <span className="font-black uppercase tracking-widest text-xs">{label}</span>
        {active && (
          <motion.div 
            layoutId="nav-active-dot"
            className="absolute right-6 w-1.5 h-1.5 bg-brand-primary rounded-full shadow-glow-blue"
          />
        )}
      </Link>
    </motion.div>
  );
}

function MobileNavItem({ to, icon, active = false }: { to: string, icon: React.ReactNode, active?: boolean }) {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center w-10 h-10 rounded-full transition-all ${
        active ? 'bg-white/20 text-white shadow-glow' : 'text-zinc-500'
      }`}
    >
      {icon}
    </Link>
  );
}
