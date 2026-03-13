import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Layers, Users, Globe, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = 140; // Increased offset to prevent header overlap
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-brand-primary selection:text-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 h-20 z-[100] px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between tactile-card px-8 rounded-full border-white/10 bg-bg/50 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-glow">
              <Layers className="text-white" size={24} />
            </div>
            <span className="text-xl font-display font-black tracking-tighter text-white">PFPRO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors uppercase cursor-pointer">HOW IT WORKS</button>
            <button onClick={() => handleNav('pillars')} className="hover:text-white transition-colors uppercase cursor-pointer">ECONOMIC PILLARS</button>
            <button onClick={() => handleNav('features')} className="hover:text-white transition-colors uppercase cursor-pointer">FEATURES</button>
            <button onClick={() => handleNav('pricing')} className="hover:text-white transition-colors uppercase cursor-pointer">PRICING</button>
            <button onClick={() => handleNav('about-us')} className="hover:text-white transition-colors uppercase cursor-pointer">ABOUT US</button>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">LOGIN</Link>
            <Link to="/register" className="tactile-btn-light px-8 py-3 text-[10px] uppercase tracking-widest">
              GET STARTED
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-zinc-500 hover:text-white transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 tactile-card p-8 space-y-6 border-white/10 bg-bg/90 backdrop-blur-xl rounded-3xl">
            <button onClick={() => handleNav('how-it-works')} className="block w-full text-left text-lg font-black uppercase tracking-tight text-zinc-400">HOW IT WORKS</button>
            <button onClick={() => handleNav('pillars')} className="block w-full text-left text-lg font-black uppercase tracking-tight text-zinc-400">ECONOMIC PILLARS</button>
            <button onClick={() => handleNav('features')} className="block w-full text-left text-lg font-black uppercase tracking-tight text-zinc-400">FEATURES</button>
            <button onClick={() => handleNav('pricing')} className="block w-full text-left text-lg font-black uppercase tracking-tight text-zinc-400">PRICING</button>
            <button onClick={() => handleNav('about-us')} className="block w-full text-left text-lg font-black uppercase tracking-tight text-zinc-400">ABOUT US</button>
            <hr className="border-white/10" />
            <Link to="/login" className="block text-lg font-black uppercase tracking-tight text-white" onClick={() => setIsMenuOpen(false)}>LOGIN</Link>
            <Link to="/register" className="tactile-btn-light w-full py-4 rounded-xl text-center uppercase tracking-widest text-xs" onClick={() => setIsMenuOpen(false)}>GET STARTED</Link>
          </div>
        )}
      </nav>

      <main>
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
      </main>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/10 bg-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center shadow-glow">
                  <Layers className="text-white" size={28} />
                </div>
                <span className="text-2xl font-display font-black tracking-tighter text-white">PFPRO</span>
              </div>
              <p className="text-zinc-400 text-lg max-w-sm leading-relaxed font-medium">
                The world's most advanced parts sourcing platform for professional fleets and mechanics.
              </p>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4 text-zinc-500 font-bold text-sm">
                <li><button onClick={() => handleNav('features')} className="hover:text-white transition-colors cursor-pointer">Features</button></li>
                <li><button onClick={() => handleNav('pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</button></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Signup</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Company</h4>
              <ul className="space-y-4 text-zinc-500 font-bold text-sm">
                <li><button onClick={() => handleNav('about-us')} className="hover:text-white transition-colors cursor-pointer">About Us</button></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-500 text-sm font-medium">© 2026 PFPRO. All rights reserved.</p>
            <div className="flex gap-8 text-zinc-500">
              <a href="#" className="hover:text-white transition-colors"><Users size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Activity size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
