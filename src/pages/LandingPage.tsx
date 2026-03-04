import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Home, Search, Bookmark, Truck, BarChart3, Shield, Settings, Power, 
  Bell, User, Play, ArrowRight, Camera, CheckCircle2, Zap, Building2, 
  UserCog, History, Plus, ExternalLink, Copy, Check, Clock, TrendingUp, 
  Target, Rocket, Mic, ChevronRight, AlertTriangle, Wrench, Users,
  Layers, Sparkles, X
} from 'lucide-react';

export default function LandingPage() {
  const [searchQueryIndex, setSearchQueryIndex] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<null | { name: string, initial: string, history: { part: string, time: string }[] }>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const workers = [
    { 
      name: "Joe Russo", 
      initial: "JR", 
      action: "Sourced Mack Anthem Brake Caliper", 
      time: "2m ago",
      history: [
        { part: "Mack Anthem Brake Caliper", time: "2m ago", vehicle: "Unit #102", status: "Found" },
        { part: "Oil Filter — Cummins ISX15", time: "1h ago", vehicle: "Unit #102", status: "Ordered" },
        { part: "Turbocharger Gasket Kit", time: "3h ago", vehicle: "Unit #205", status: "Found" }
      ]
    },
    { 
      name: "Mike Smith", 
      initial: "MS", 
      action: "Verified Fitment for Unit #402", 
      time: "11m ago",
      history: [
        { part: "Meritor EX225L Caliper", time: "11m ago", vehicle: "Unit #402", status: "Verified" },
        { part: "V8 Fuel Injector", time: "4h ago", vehicle: "Unit #402", status: "Found" },
        { part: "Air Dryer Cartridge", time: "5h ago", vehicle: "Unit #388", status: "No Stock" }
      ]
    },
    { 
      name: "Dan King", 
      initial: "DK", 
      action: "Saved Battery to Parts Bin", 
      time: "1h ago",
      history: [
        { part: "Unit #33 Battery", time: "1h ago", vehicle: "Unit #33", status: "Saved" },
        { part: "Alternator — Delco Remy", time: "Yesterday", vehicle: "Unit #33", status: "Found" }
      ]
    },
    { 
      name: "Sarah Chen", 
      initial: "SC", 
      action: "Identified Transmission Sensor", 
      time: "3h ago",
      history: [
        { part: "Transmission Speed Sensor", time: "3h ago", vehicle: "Unit #99", status: "Found" },
        { part: "Clutch Kit — Eaton Fuller", time: "Yesterday", vehicle: "Unit #99", status: "Verified" }
      ]
    }
  ];

  const searchQueries = [
    "Front Brake Caliper Assembly L/H",
    "Oil Filter — Cummins ISX15",
    "Turbocharger Gasket Kit",
    "V8 Fuel Injector - Mack Anthem"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSearchQueryIndex((prev) => (prev + 1) % searchQueries.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
      {/* ENTRANCE REVEAL OVERLAY */}
      <motion.div 
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
        className="fixed inset-0 bg-brand-primary z-[200] origin-top"
      />

      {/* NAVIGATION HEADER */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl h-16 bg-bg/80 backdrop-blur-xl border border-border rounded-2xl z-[100] px-6"
      >
        <div className="h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tighter text-white uppercase">PartsFinder</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors">Features</a>
            <a href="#demo" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors px-4">Login</Link>
              <Link to="/register" className="bg-brand-primary text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all active:scale-95">Get Started</Link>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-border flex items-center justify-center text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Layers size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-2xl border-b border-border overflow-hidden z-50"
            >
              <div className="p-6 flex flex-col gap-6">
                <nav className="flex flex-col gap-4">
                  <a 
                    href="#features" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-black uppercase tracking-widest text-muted hover:text-white py-2"
                  >
                    Features
                  </a>
                  <a 
                    href="#demo" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-black uppercase tracking-widest text-muted hover:text-white py-2"
                  >
                    Demo
                  </a>
                  <a 
                    href="#pricing" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-black uppercase tracking-widest text-muted hover:text-white py-2"
                  >
                    Pricing
                  </a>
                </nav>
                <div className="h-px bg-border w-full" />
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center text-sm font-black uppercase tracking-widest text-muted hover:text-white py-4 border border-border rounded-xl"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center text-sm font-black uppercase tracking-widest bg-brand-primary text-white py-4 rounded-xl"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* MAIN CONTENT */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pt-32 pb-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* HERO SECTION */}
          <section className="text-center mb-32 relative">
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-border text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary mb-8"
              >
                <Sparkles size={12} className="animate-pulse" />
                The Industry Standard for Fleet Sourcing
              </motion.div>
              <h1 className="text-6xl lg:text-9xl font-black mb-8 leading-[0.85] uppercase tracking-tighter">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="block"
                >
                  PARTS FINDER
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="text-brand-primary italic block"
                >
                  PRO.
                </motion.span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="text-xl lg:text-2xl text-ink-secondary max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
              >
                AI-powered sourcing for professional mechanics and fleet owners. Identify any part, verify fitment, compare 200+ suppliers — one screen.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-6"
              >
                <Link to="/register" className="tactile-btn-light px-10 py-5 text-lg group">
                  Start Free 14-Day Trial
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#demo" className="tactile-btn-dark px-10 py-5 text-lg">
                  See How It Works
                </a>
              </motion.div>
            </motion.div>
          </section>

          {/* STATS ROW */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
            <StatCard index={0} label="Parts Indexed" value="4.2M+" trend="↑ 12% this month" color="text-brand-primary" />
            <StatCard index={1} label="Fitment Accuracy" value="99.7%" trend="↑ 0.2% vs last qtr" color="text-brand-secondary" />
            <StatCard index={2} label="Suppliers Connected" value="200+" trend="↑ 4 new this week" color="text-warning" />
            <StatCard index={3} label="Avg. Time Saved" value="47 min" trend="Per search event" color="text-white" />
          </section>

          {/* LIVE SEARCH DEMO CARD */}
          <section id="demo" className="mb-32">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="tactile-card overflow-hidden max-w-5xl mx-auto relative group"
            >
              {/* SCANNING LINE ANIMATION */}
              <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-brand-primary/20 blur-[2px] z-20 pointer-events-none"
              />
              
              <div className="p-6 border-b border-border bg-white/[0.02]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Interactive Sourcing Matrix</h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={searchQueryIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink font-medium text-sm pointer-events-none"
                      >
                        {searchQueries[searchQueryIndex]}
                      </motion.div>
                    </AnimatePresence>
                    <input 
                      type="text" 
                      readOnly
                      className="w-full bg-input border border-border rounded-lg py-4 pl-4 pr-10 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button className="tactile-btn-light px-6 flex-1 md:flex-none">
                      <Camera size={18} />
                      Scan
                    </button>
                    <button className="tactile-btn-dark px-6 flex-1 md:flex-none">
                      Search
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-brand-secondary/5 border border-brand-secondary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-secondary/20 flex items-center justify-center">
                      <Zap size={16} className="text-brand-secondary" />
                    </div>
                    <span className="text-sm font-bold">🤖 Meritor EX225L — Front Brake Caliper</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-secondary">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fitment Verified</span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead className="bg-white/5 border-b border-border">
                      <tr>
                        <th className="p-4 font-black uppercase tracking-widest text-muted">Supplier</th>
                        <th className="p-4 font-black uppercase tracking-widest text-muted">Price</th>
                        <th className="p-4 font-black uppercase tracking-widest text-muted">Stock</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <SupplierRow index={0} name="AutoZone Pro (0.8 mi)" price="$184.99" stock="In Stock (12)" best />
                      <SupplierRow index={1} name="NAPA Auto (2.1 mi)" price="$201.50" stock="In Stock (4)" />
                      <SupplierRow index={2} name="Advance Auto (3.4 mi)" price="$219.00" stock="Low Stock (1)" warning />
                      <SupplierRow index={3} name="Worldpac (Ships 2-day)" price="$227.40" stock="Order Only" danger />
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 bg-white/[0.02] border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                <button className="tactile-btn-light px-10 py-4 text-sm w-full md:w-auto md:flex-1 md:max-w-xs">
                  Order from AutoZone — $184.99
                </button>
                <button className="tactile-btn-dark px-8 py-4 text-sm w-full md:w-auto">
                  <Bookmark size={16} />
                  Save to Parts Bin
                </button>
              </div>
            </motion.div>
          </section>

          {/* CORE FEATURES */}
          <section id="features" className="space-y-16 mb-32">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-4 inline-block">Capabilities</span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Engineered for Speed</h2>
            </div>
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <FeatureCard icon={<Camera className="text-brand-primary" />} title="AI Visual Identification" desc="Identify any part from a single photo in under 8 seconds." />
              <FeatureCard icon={<CheckCircle2 className="text-brand-secondary" />} title="Fitment Compatibility" desc="100% fitment guarantee locked to your vehicle's VIN." />
              <FeatureCard icon={<BarChart3 className="text-warning" />} title="Multi-Supplier Comparison" desc="Compare 200+ suppliers for price and local availability." />
              <FeatureCard icon={<Truck className="text-brand-primary" />} title="Fleet Command Dashboard" desc="Full oversight of your team's sourcing and activity." />
              <FeatureCard icon={<Bookmark className="text-brand-secondary" />} title="Digital Garage" desc="Centralized database of your fleet's specific needs." />
              <FeatureCard icon={<Zap className="text-warning" />} title="Smart Team Onboarding" desc="Invite links that automatically link mechanics to your fleet." />
            </motion.div>
          </section>

          {/* USER ROLES */}
          <section className="space-y-16 mb-32">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-4 inline-block">User Roles</span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Built For Your Role</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <RoleCard 
                role="MECHANIC" 
                icon={<Wrench size={24} />} 
                title="In the Field. Zero Friction." 
                color="border-brand-primary"
                list={[
                  "Photo → Part ID in 8s",
                  "VIN-locked results",
                  "Tech docs & torque specs",
                  "Self-Paid or Company seat"
                ]}
              />
              <RoleCard 
                role="FLEET OWNER" 
                icon={<UserCog size={24} />} 
                title="Command. Control. Cut Costs." 
                color="border-warning"
                list={[
                  "Real-time mechanic tracking",
                  "Geographic team map",
                  "Add-remove seats instantly",
                  "Procurement analytics",
                  "Smart invite links"
                ]}
              />
            </div>
          </section>

          {/* TEAM ACTIVITY DEMO */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-4 inline-block">Fleet Oversight</span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Real-Time Team Activity</h2>
              <p className="text-muted text-sm mt-4">Click on any worker to view their full search history.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {workers.map((worker, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedWorker(worker)}
                  className="tactile-card p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-lg group-hover:scale-110 transition-transform">
                      {worker.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-white">{worker.name}</h4>
                      <p className="text-xs text-ink-secondary">{worker.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-muted uppercase tracking-widest">{worker.time}</span>
                    <ChevronRight size={16} className="text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" className="space-y-16 mb-32">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted mb-4 inline-block">Pricing</span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Access Tiers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard 
                title="Solo Tech" 
                price="$29" 
                desc="AI Visual Search, VIN Fitment, 3 Supplier Compare, 10 Saved Vehicles" 
                btnText="Start Solo"
              />
              <PricingCard 
                title="Fleet Core" 
                price="$89" 
                desc="Everything in Solo + All 200+ Suppliers + Unlimited Vehicles + 5 Mechanic Seats" 
                btnText="Deploy Fleet Core"
                featured
              />
              <PricingCard 
                title="Enterprise" 
                price="Custom" 
                desc="Unlimited Seats, White-label, API, ERP/DMS Integration, Custom Supplier Deals" 
                btnText="Contact Sales"
              />
            </div>
          </section>

          {/* CTA SECTION */}
          <section>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="tactile-card p-12 lg:p-24 text-center relative overflow-hidden bg-gradient-to-br from-[#1a2235] to-[#162035] border-brand-primary/30"
            >
              {/* FLOATING DECO */}
              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 w-64 h-64 bg-brand-primary/10 blur-[80px] rounded-full"
              />
              <motion.div 
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-secondary/10 blur-[80px] rounded-full"
              />

              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary mb-8 inline-block">⚡ Mission Ready</span>
                <h2 className="text-5xl lg:text-8xl font-black mb-8 uppercase leading-none tracking-tighter">
                  Stop Guessing. <br />
                  Start <span className="text-brand-primary italic">Sourcing.</span>
                </h2>
                <p className="text-xl text-ink-secondary max-w-2xl mx-auto mb-12 font-medium">
                  Every minute of vehicle downtime has a dollar value. PF PRO gives your team the speed and accuracy to eliminate it.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                  <Link to="/register" className="tactile-btn-light px-12 py-6 text-xl">
                    Start Free 14-Day Trial
                  </Link>
                  <Link to="/register" className="tactile-btn-dark px-12 py-6 text-xl">
                    Start Free Trial
                  </Link>
                </div>
                <div className="flex flex-wrap justify-center gap-10 text-[11px] font-black uppercase tracking-widest text-muted">
                  <span>✓ No credit card required</span>
                  <span>✓ Cancel anytime</span>
                  <span>✓ Deploy in 5 minutes</span>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </motion.main>

      {/* WORKER DETAIL MODAL */}
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
              className="relative w-full max-w-lg bg-bg-dark border border-border rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-xl">
                    {selectedWorker.initial}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">{selectedWorker.name}</h3>
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Worker Activity Log</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-6">Recent Search History</h4>
                <div className="space-y-4">
                  {selectedWorker.history.map((item: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Search size={14} className="text-brand-primary" />
                          <span className="text-sm font-bold text-white">{item.part}</span>
                        </div>
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-secondary">
                          <Truck size={12} />
                          {item.vehicle}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          item.status === 'Ordered' ? 'text-brand-secondary border-brand-secondary/30 bg-brand-secondary/10' :
                          item.status === 'Verified' ? 'text-brand-primary border-brand-primary/30 bg-brand-primary/10' :
                          item.status === 'No Stock' ? 'text-danger border-danger/30 bg-danger/10' :
                          'text-warning border-warning/30 bg-warning/10'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border-t border-border">
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

      {/* FOOTER */}
      <motion.footer 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-bg-dark border-t border-border py-20 px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tighter text-white uppercase">PartsFinder</span>
            </Link>
            <p className="text-muted text-sm max-w-xs leading-relaxed">
              The professional standard for heavy-duty parts sourcing and fleet management.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Product</h4>
              <ul className="space-y-4 text-xs font-bold text-muted">
                <li><a href="#features" className="hover:text-brand-primary transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-brand-primary transition-colors">Demo</a></li>
                <li><a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">© 2026 PartsFinder. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}

function StatCard({ label, value, trend, color, index = 0 }: { label: string, value: string, trend: string, color: string, index?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="tactile-card p-6"
    >
      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-3xl font-black mb-2 ${color}`}>{value}</p>
      <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand-secondary">
        <TrendingUp size={10} />
        {trend}
      </div>
    </motion.div>
  );
}

function SupplierRow({ name, price, stock, best = false, warning = false, danger = false, index = 0 }: { name: string, price: string, stock: string, best?: boolean, warning?: boolean, danger?: boolean, index?: number }) {
  return (
    <motion.tr 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`${best ? 'bg-brand-primary/5' : ''} hover:bg-white/[0.02] transition-colors`}
    >
      <td className="p-4 font-bold text-white">
        {name}
        {best && <span className="ml-2 text-[8px] font-black text-brand-primary uppercase tracking-widest">★ Best</span>}
      </td>
      <td className="p-4 font-mono text-ink">{price}</td>
      <td className="p-4">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${danger ? 'text-danger bg-danger/10 border-danger/20' : warning ? 'text-warning bg-warning/10 border-warning/20' : 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20'}`}>
          {stock}
        </span>
      </td>
      <td className="p-4 text-right">
        <button className="px-4 py-1.5 rounded border border-brand-primary/30 text-[10px] font-black text-brand-primary uppercase hover:bg-brand-primary hover:text-white transition-all">
          Order
        </button>
      </td>
    </motion.tr>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -8, 
        borderColor: 'rgba(59, 130, 246, 0.3)',
        transition: { duration: 0.2 } 
      }}
      className="tactile-card p-8 group cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-black mb-3 uppercase tracking-tight group-hover:text-white transition-colors">{title}</h3>
      <p className="text-xs text-ink-secondary leading-relaxed group-hover:text-ink transition-colors">{desc}</p>
    </motion.div>
  );
}

function RoleCard({ role, icon, title, list, color }: { role: string, icon: React.ReactNode, title: string, list: string[], color: string }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`tactile-card p-10 border-l-4 ${color}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{role}</span>
      </div>
      <h3 className="text-2xl font-black mb-8 uppercase leading-tight">{title}</h3>
      <motion.ul 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-4"
      >
        {list.map((listItem, i) => (
          <motion.li key={i} variants={item} className="flex items-center gap-3 text-sm text-ink-secondary font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            {listItem}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

function PricingCard({ title, price, desc, btnText, featured = false }: { title: string, price: string, desc: string, btnText: string, featured?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`tactile-card p-10 flex flex-col h-full relative ${featured ? 'border-brand-primary/50 shadow-glow' : ''}`}
    >
      {featured && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest"
        >
          Most Popular
        </motion.div>
      )}
      <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-5xl font-black">{price}</span>
        {price !== 'Custom' && <span className="text-muted font-bold">/mo</span>}
      </div>
      <p className="text-xs text-ink-secondary leading-relaxed mb-10 flex-grow">{desc}</p>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={featured ? 'tactile-btn-light w-full py-4 text-xs' : 'tactile-btn-dark w-full py-4 text-xs'}
      >
        {btnText}
      </motion.button>
    </motion.div>
  );
}

function RoadmapItem({ icon, title, desc, status, statusColor }: { icon: React.ReactNode, title: string, desc: string, status: string, statusColor: string }) {
  return (
    <div className="tactile-card p-6 flex items-center gap-6">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-sm font-black uppercase tracking-tight">{title}</h4>
          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-ink-secondary">{desc}</p>
      </div>
    </div>
  );
}

