import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Layers, Users, Globe, Activity } from 'lucide-react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-brand-primary selection:text-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 h-20 z-[100] px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between tactile-card px-8 rounded-full border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-glow">
              <Layers className="text-white" size={24} />
            </div>
            <span className="text-xl font-display font-black tracking-tighter text-white">PF PRO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#matrix" className="hover:text-white transition-colors">The Matrix</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="tactile-btn-light px-6 py-2.5 text-[10px]">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-zinc-500 hover:text-white transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 tactile-card p-8 space-y-6 border-white/10">
            <a href="#features" className="block text-lg font-bold text-zinc-400" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#matrix" className="block text-lg font-bold text-zinc-400" onClick={() => setIsMenuOpen(false)}>The Matrix</a>
            <a href="#pricing" className="block text-lg font-bold text-zinc-400" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="block text-lg font-bold text-zinc-400" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <hr className="border-white/10" />
            <Link to="/login" className="block text-lg font-bold text-white" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" className="tactile-btn-light w-full py-4 rounded-xl text-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/10 bg-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center shadow-glow">
                  <Layers className="text-white" size={28} />
                </div>
                <span className="text-2xl font-display font-black tracking-tighter text-white">PF PRO</span>
              </div>
              <p className="text-zinc-400 text-lg max-w-sm leading-relaxed font-medium">
                The world's most advanced parts sourcing platform for professional fleets and mechanics.
              </p>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4 text-zinc-500 font-bold text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Neural Search</a></li>
                <li><a href="#matrix" className="hover:text-white transition-colors">Matrix Feed</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Company</h4>
              <ul className="space-y-4 text-zinc-500 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-500 text-sm font-medium">© 2024 PartsFinder Pro. All rights reserved.</p>
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
