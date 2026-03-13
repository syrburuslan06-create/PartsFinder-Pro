import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, LayoutDashboard, Settings, Bell, User, LogOut, 
  Camera, LifeBuoy, Sparkles, Bookmark, UserPlus, Car, 
  Activity, X, Home, LayoutGrid, Lightbulb, ShieldCheck, Power, Users, ShieldAlert,
  Menu, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'mechanic';
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [initials, setInitials] = useState('U');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        if (profile?.full_name) {
          const nameParts = profile.full_name.split(' ');
          if (nameParts.length > 1) {
            setInitials(`${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase());
          } else {
            setInitials(profile.full_name.substring(0, 2).toUpperCase());
          }
        } else if (user.email) {
          setInitials(user.email.substring(0, 2).toUpperCase());
        }
      }
    }
    fetchUser();
  }, []);

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
    <div className="flex h-screen h-[100dvh] bg-bg text-ink overflow-hidden font-sans">
      {/* Desktop Sidebar - Cyber-Industrial Rail */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 w-20 bg-surface border-r border-white/5 flex-col items-center py-8 justify-between">
        <div className="flex flex-col items-center gap-8 w-full">
          <Link to="/home" className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-glow border border-brand-primary/20">
            <Sparkles size={20} />
          </Link>
          
          <div className="w-8 h-px bg-white/5" />

          <nav className="flex flex-col items-center gap-6 w-full">
            <SidebarIcon to="/home" icon={<Home size={20} />} label="Home" active={location.pathname === '/home'} />
            
            {userRole === 'admin' ? (
              <>
                <SidebarIcon to="/admin" icon={<ShieldAlert size={20} />} label="Mission" active={location.pathname === '/admin'} />
                <SidebarIcon to="/home" icon={<Activity size={20} />} label="Health" active={false} />
                <SidebarIcon to="/profile" icon={<Settings size={20} />} label="Config" active={location.pathname === '/profile'} />
              </>
            ) : userRole === 'owner' ? (
              <>
                <SidebarIcon to="/owner/dashboard" icon={<LayoutDashboard size={20} />} label="Dash" active={location.pathname === '/owner/dashboard'} />
                <SidebarIcon to="/owner/dashboard" icon={<Users size={20} />} label="Team" active={false} />
                <SidebarIcon to="/profile" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/profile'} />
              </>
            ) : userRole === 'supplier' ? (
              <>
                <SidebarIcon to="/supplier/dashboard" icon={<LayoutDashboard size={20} />} label="Dash" active={location.pathname === '/supplier/dashboard'} />
                <SidebarIcon to="/profile" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/profile'} />
              </>
            ) : (
              <>
                <SidebarIcon to="/search" icon={<Search size={20} />} label="Source" active={location.pathname === '/search'} />
                <SidebarIcon to="/saved" icon={<Bookmark size={20} />} label="Saved" active={location.pathname === '/saved'} />
                <SidebarIcon to="/profile" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/profile'} />
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
          >
            <Power size={20} className="group-hover:shadow-glow-red" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden lg:pl-20 bg-bg">
        {/* Topbar */}
        <header className="h-16 lg:h-20 border-b border-white/5 bg-surface/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 shrink-0 z-40 sticky top-0">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-400 hover:text-white">
              <Menu size={24} />
            </button>
            <Link to="/home" className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-2">
              <span className="text-brand-primary">PF</span>PRO
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl hidden md:block ml-4">
            <form onSubmit={handleQuickSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search part number, VIN, or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-input border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder:text-zinc-600 font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <span className="text-[10px] text-zinc-600 font-mono border border-white/10 rounded px-1.5 py-0.5">⌘K</span>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 text-brand-primary text-[10px] font-bold tracking-widest uppercase shadow-glow">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              System Online
            </div>
            
            <button className="relative w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-secondary rounded-full shadow-glow-red" />
            </button>
            
            <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-white/5">
               <div className="text-right hidden md:block">
                 <div className="text-xs font-bold text-white">User Account</div>
                 <div className="text-[10px] text-zinc-500 font-mono uppercase">{userRole}</div>
               </div>
               <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                 {initials}
               </div>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-grid-small relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />
          <div className="relative z-10 p-4 lg:p-8 pb-32 lg:pb-8 max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-white/10 z-[60] p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display font-bold text-xl text-white">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                <MobileMenuLink to="/home" icon={<Home size={18} />} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
                {userRole === 'owner' ? (
                  <>
                    <MobileMenuLink to="/owner/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileMenuLink to="/owner/dashboard" icon={<Users size={18} />} label="Team" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                ) : (
                  <>
                    <MobileMenuLink to="/search" icon={<Search size={18} />} label="Source Parts" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileMenuLink to="/saved" icon={<Bookmark size={18} />} label="Saved Items" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                )}
                <MobileMenuLink to="/profile" icon={<Settings size={18} />} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-colors mt-8"
                >
                  <Power size={18} />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Floating Mobile Action Bar */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-4 w-full max-w-sm">
           <nav className="flex-1 h-16 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass flex items-center justify-around px-2">
              <MobileNavItem to="/search" icon={<Search size={24} />} active={location.pathname === '/search'} label="Search" />
              <MobileNavItem to="/saved" icon={<Bookmark size={24} />} active={location.pathname === '/saved'} label="Saved" />
              <MobileNavItem to="/alerts" icon={<Bell size={24} />} active={location.pathname === '/alerts'} label="Alerts" />
              <MobileNavItem to="/home" icon={<LayoutDashboard size={24} />} active={location.pathname === '/home' || location.pathname === '/owner/dashboard' || location.pathname === '/admin'} label="Dashboard" />
           </nav>
        </div>
      </main>
    </div>
  );
}

function SidebarIcon({ to, icon, label, active = false }: { to: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link to={to} className="group relative flex flex-col items-center gap-1.5 w-full">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-brand-primary transition-all duration-300 group-hover:h-6 opacity-0 group-hover:opacity-100" />
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          active 
            ? 'bg-brand-primary text-black shadow-glow' 
            : 'text-zinc-500 hover:text-white hover:bg-white/5'
        }`}
      >
        {icon}
      </motion.div>
      <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
        active ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'
      }`}>
        {label}
      </span>
    </Link>
  );
}

function MobileNavItem({ to, icon, active = false, label }: { to: string, icon: React.ReactNode, active?: boolean, label: string }) {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all ${
        active ? 'text-brand-primary' : 'text-zinc-500 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </Link>
  );
}

function MobileMenuLink({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
