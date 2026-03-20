import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Camera, 
  Truck, 
  CheckCircle2, 
  TrendingUp, 
  Check, 
  Shield,
  Users,
  BarChart3,
  Search,
  Wrench,
  Star,
  ChevronRight,
  Play,
  Database,
  Globe,
  Clock
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="bg-bg min-h-screen text-ink selection:bg-brand-primary selection:text-white overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-bg to-transparent" />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                 backgroundSize: '100px 100px' 
               }} 
          />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-brand-primary mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              The OS for Heavy-Duty Parts
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter leading-[0.9] mb-8 text-white">
              TRUCKSAVER / <br />
              <span className="text-brand-primary italic">PartsFinder Pro</span>
            </h1>
            
            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl">
              Enterprise-grade parts sourcing for workers, directors, and fleet operators. Search 200+ suppliers at once.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="tactile-btn-light px-8 py-4 text-sm"
              >
                Start Free
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="tactile-btn-dark px-8 py-4 text-sm"
              >
                See How It Works
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm font-medium text-zinc-500">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-bg bg-zinc-800 flex items-center justify-center text-xs text-white">
                    <Users size={14} />
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="text-white font-bold">12,000+</span> pros</p>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            <div className="relative z-10 tactile-card p-3 bg-bg/80 backdrop-blur-2xl border-white/10 shadow-2xl transform transition-transform duration-500 group">
              <div className="rounded-xl overflow-hidden bg-[#0A0A0A] relative aspect-[4/3] flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-50 pointer-events-none" />
                
                {/* UI Header */}
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 shrink-0 bg-white/[0.02]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-black/50 border border-white/5 text-[9px] font-mono text-zinc-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                    PFPRO_LIVE_FEED
                  </div>
                </div>

                {/* UI Body */}
                <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden relative">
                  {/* Search Bar */}
                  <div className="h-10 bg-white/5 rounded-lg border border-white/5 flex items-center px-3 gap-3">
                    <Search size={14} className="text-zinc-500" />
                    <TypewriterText texts={['Searching 4.2M Records...', 'Verifying VIN Fitment...', 'Comparing Supplier Prices...']} />
                    <div className="ml-auto flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    </div>
                  </div>

                  {/* Live Feed Grid */}
                  <div className="flex-1 overflow-hidden relative mask-fade-b">
                    <LiveFeed />
                  </div>
                  
                  {/* Floating Overlay Card */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2, type: "spring" }}
                    className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl max-w-[180px] z-20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                      <span className="text-[9px] font-bold uppercase text-zinc-400">Live Sourcing</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-full bg-brand-secondary" 
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                        <span>Connecting...</span>
                        <span className="text-white font-bold">200+ Suppliers</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Glow behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/20 blur-[100px] -z-10 rounded-full opacity-50" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-secondary/10 blur-[80px] -z-10 rounded-full opacity-50" />
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="border-y border-white/5 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {[
            { label: "Parts Indexed", value: "4.2M+", icon: <Database size={16} className="text-brand-primary" /> },
            { label: "Suppliers", value: "200+", icon: <Globe size={16} className="text-brand-secondary" /> },
            { label: "Fitment Accuracy", value: "99.9%", icon: <CheckCircle2 size={16} className="text-warning" /> },
            { label: "Uptime Saved", value: "85%", icon: <Clock size={16} className="text-cta" /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-left group"
            >
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                {stat.icon}
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
              </div>
              <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">The Workflow</span>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter mb-6">
              FROM CHAOS TO <span className="text-zinc-500">CONTROL.</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              We've stripped away the complexity of parts procurement. Three steps to get your fleet back on the road.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Visual Identification",
                desc: "Snap a photo. Our AI analyzes geometry and markings to identify the part instantly.",
                icon: <Camera size={24} />,
                color: "text-brand-primary",
                bg: "bg-brand-primary/10"
              },
              {
                step: "02",
                title: "VIN Verification",
                desc: "We cross-reference the part with your vehicle's VIN to guarantee 100% fitment.",
                icon: <Shield size={24} />,
                color: "text-brand-secondary",
                bg: "bg-brand-secondary/10"
              },
              {
                step: "03",
                title: "Global Sourcing",
                desc: "Compare stock and pricing from 200+ suppliers. Order with one click.",
                icon: <Globe size={24} />,
                color: "text-warning",
                bg: "bg-warning/10"
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="tactile-card p-8 group hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} border border-white/5`}>
                    {item.icon}
                  </div>
                  <span className="text-4xl font-black text-white/5 font-display">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section id="features" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-brand-secondary font-bold tracking-widest uppercase text-xs mb-4 block">Capabilities</span>
              <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter">
                BUILT FOR <span className="text-zinc-500">SPEED.</span>
              </h2>
            </div>
            <Link to="/register" className="text-white font-bold flex items-center gap-2 hover:text-brand-primary transition-colors">
              Explore all features <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="tactile-card p-8 relative overflow-hidden group hover:border-brand-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-6">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Part ID</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Upload a photo of any broken part. Our Gemini-powered AI instantly identifies the component, manufacturer, and part number.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="tactile-card p-8 relative overflow-hidden group hover:border-brand-secondary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 flex items-center justify-center text-brand-secondary mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">VIN Lookup</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Paste any 17-character VIN to instantly decode Year, Make, Model, and Engine. Guarantee 100% fitment before you order.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="tactile-card p-8 relative overflow-hidden group hover:border-warning/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center text-warning mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fleet Management</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Add your entire team of mechanics. Track their search history, manage their access, and control your monthly spend from one dashboard.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="tactile-card p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">40+ Suppliers</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Search across 40+ authorized US suppliers simultaneously. Compare prices, stock status, and delivery times in a single view.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ECONOMIC PILLARS */}
      <section id="pillars" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
             >
               <span className="text-warning font-bold tracking-widest uppercase text-xs mb-4 block">Impact</span>
               <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter mb-8">
                 THE COST OF <br/> <span className="text-zinc-500">DOWNTIME.</span>
               </h2>
               <div className="space-y-8">
                 <div className="flex gap-6">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white font-bold border border-white/10">01</div>
                   <div>
                     <h4 className="text-xl font-bold text-white mb-2">Eliminate Wait Times</h4>
                     <p className="text-zinc-400">Reduce sourcing time by 85%. Get parts same-day instead of next-week.</p>
                   </div>
                 </div>
                 <div className="flex gap-6">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white font-bold border border-white/10">02</div>
                   <div>
                     <h4 className="text-xl font-bold text-white mb-2">Stop Overpaying</h4>
                     <p className="text-zinc-400">Average savings of 18% per order by comparing multiple suppliers instantly.</p>
                   </div>
                 </div>
                 <div className="flex gap-6">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-white font-bold border border-white/10">03</div>
                   <div>
                     <h4 className="text-xl font-bold text-white mb-2">Scale Without Friction</h4>
                     <p className="text-zinc-400">Onboard new mechanics in minutes. Centralized billing and management.</p>
                   </div>
                 </div>
               </div>
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary blur-[100px] opacity-20" />
               <div className="tactile-card p-12 bg-bg/80 backdrop-blur relative border-white/10">
                 <div className="flex items-end justify-between mb-12">
                   <div>
                     <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Efficiency Gain</div>
                     <div className="text-5xl font-black text-white">+412%</div>
                   </div>
                   <div className="text-brand-secondary">
                     <TrendingUp size={32} />
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full w-[85%] bg-brand-primary rounded-full" />
                   </div>
                   <div className="flex justify-between text-xs font-mono text-zinc-500">
                     <span>PFPRO Sourcing</span>
                     <span>85/100 Speed</span>
                   </div>
                   
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-8">
                     <div className="h-full w-[20%] bg-zinc-700 rounded-full" />
                   </div>
                   <div className="flex justify-between text-xs font-mono text-zinc-500">
                     <span>Traditional Sourcing</span>
                     <span>20/100 Speed</span>
                   </div>
                 </div>
               </div>
             </motion.div>
           </div>
        </div>
      </section>

      {/* ROLE SELECTION / GET STARTED */}
      <section id="get-started" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter mb-6">
              CHOOSE YOUR <span className="text-brand-primary">PATH.</span>
            </h2>
            <p className="text-zinc-400 text-lg">Select your role to customize your experience.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
            <Link to="/register/mechanic" className="block h-full group tactile-card p-10 hover:border-brand-primary/50 transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 transition-transform">
                <Wrench size={32} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Worker</h3>
              <p className="text-zinc-400 mb-8 min-h-[48px]">For mechanics and shop floor pros needing instant part identification and fitment verification.</p>
              <div className="flex items-center text-brand-primary font-bold text-sm uppercase tracking-widest">
                Start Sourcing <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
            <Link to="/register/owner" className="block h-full group tactile-card p-10 hover:border-brand-secondary/50 transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-8 group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Director</h3>
              <p className="text-zinc-400 mb-8 min-h-[48px]">For fleet owners and managers needing team oversight, cost analytics, and seat management.</p>
              <div className="flex items-center text-brand-secondary font-bold text-sm uppercase tracking-widest">
                Manage Fleet <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter mb-6">
              TRANSPARENT <span className="text-zinc-500">PRICING.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <PricingCard 
              title="Worker" 
              price="$49.99" 
              features={['AI Visual Search', 'VIN Fitment Lock', '200+ Supplier Compare', 'Unlimited Searches']}
              cta="Subscribe"
              link="/register/mechanic"
            />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <PricingCard 
              title="Director" 
              price="$49.99" 
              perSeat={true}
              features={['Everything in Worker', 'Director Dashboard', 'Worker Management', 'Centralized Billing', 'Team Analytics']}
              cta="Subscribe"
              featured
              link="/register/owner"
            />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <PricingCard 
              title="Enterprise" 
              price="Custom" 
              features={['Unlimited Seats', 'ERP Integration', 'API Access', 'White-label Portal', 'Dedicated Support']}
              cta="Contact Sales"
              link="mailto:sales@partshub.com"
            />
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Community</span>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter mb-6">
              TRUSTED BY <span className="text-zinc-500">THE BEST.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "PFPRO cut our sourcing time from hours to minutes. It's the only tool my guys want to use.",
                author: "Mike R.",
                role: "Fleet Manager, Logistics Co.",
                stars: 5
              },
              {
                quote: "The VIN fitment lock is a lifesaver. We haven't had a single return since switching to PFPRO.",
                author: "Sarah J.",
                role: "Lead Mechanic, City Transit",
                stars: 5
              },
              {
                quote: "Finally, a platform that actually understands how the heavy-duty industry works. Brilliant.",
                author: "David K.",
                role: "Owner, K-Trucking",
                stars: 5
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="tactile-card p-8 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-1 text-brand-secondary mb-6">
                  {[...Array(t.stars)].map((_, si) => <Star key={si} size={14} fill="currentColor" />)}
                </div>
                <p className="text-lg text-zinc-300 font-medium mb-8 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.author}</div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about-us" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs mb-4 block">Our Mission</span>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter mb-6">
              BUILT FOR THE <span className="text-zinc-500">FRONTLINES.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              PFPRO was founded by logistics veterans and AI engineers who saw the massive inefficiency in heavy-duty parts sourcing. We believe that the people keeping our world moving deserve tools that are as powerful as the machines they maintain.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="text-3xl font-black text-white mb-1">2018</div>
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Founded</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-1">Detroit</div>
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">HQ</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 relative group">
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-20" 
                   style={{ 
                     backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                   }} 
              />
              
              {/* Stylized Map Elements */}
              <div className="absolute inset-0">
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.path 
                    d="M 100 300 Q 250 100 400 200" 
                    fill="none" 
                    stroke="url(#gradient1)" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M 50 150 Q 200 250 350 50" 
                    fill="none" 
                    stroke="url(#gradient2)" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                      <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Nodes */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10 relative" />
                    <div className="absolute inset-0 bg-brand-primary rounded-full animate-ping opacity-50" />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Detroit HQ</span>
                    </div>
                  </div>
                </motion.div>

                {[
                  { top: '20%', left: '30%', delay: 1.2, label: "Seattle" },
                  { top: '70%', left: '20%', delay: 1.4, label: "LA" },
                  { top: '30%', left: '80%', delay: 1.6, label: "NYC" },
                  { top: '80%', left: '70%', delay: 1.8, label: "Miami" },
                ].map((node, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: node.delay }}
                    className="absolute"
                    style={{ top: node.top, left: node.left }}
                  >
                    <div className="w-2 h-2 bg-zinc-500 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-black text-white tracking-tighter mb-12 text-center">FAQ</h2>
          <div className="space-y-6">
            <FaqItem q="How accurate is the Visual ID?" a="Our AI is trained on over 4.2 million heavy-duty parts images and achieves 99.2% accuracy in field conditions." />
            <FaqItem q="Does it work for all truck brands?" a="Yes, we support all major manufacturers including Mack, Peterbilt, Kenworth, Volvo, Freightliner, and International." />
            <FaqItem q="Can I add my own suppliers?" a="Enterprise plans allow you to integrate your own preferred vendor lists and negotiated pricing." />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl lg:text-8xl font-display font-black text-white tracking-tighter mb-8">
            READY TO <br/> <span className="text-brand-primary">OPTIMIZE?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Join the platform that is redefining how the heavy-duty industry moves.
          </p>
          <Link to="/register" className="tactile-btn-light px-16 py-6 text-lg inline-flex">
            Get Started Now
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

function PricingCard({ title, price, features, cta, featured, link, perSeat }: { title: string, price: string, features: string[], cta: string, featured?: boolean, link: string, perSeat?: boolean }) {
  return (
    <div className={`tactile-card p-8 flex flex-col ${featured ? 'border-brand-primary/50 bg-brand-primary/5' : 'border-white/10'}`}>
      {featured && <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">Most Popular</div>}
      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{title}</h3>
      <div className="text-4xl font-black text-white mb-8">{price}<span className="text-sm text-zinc-500 font-medium ml-1">{price !== 'Custom' && (perSeat ? '/mo per seat' : '/mo')}</span></div>
      
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
            <Check size={16} className="text-brand-primary shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      
      <Link to={link} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center ${featured ? 'bg-brand-primary text-white shadow-glow' : 'bg-white/5 text-white hover:bg-white/10'}`}>
        {cta}
      </Link>
    </div>
  );
}

function TypewriterText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  React.useEffect(() => {
    const currentText = texts[index];
    const speed = isDeleting ? 50 : 100;
    
    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
      } else {
        setDisplayText(
          isDeleting 
            ? currentText.substring(0, displayText.length - 1) 
            : currentText.substring(0, displayText.length + 1)
        );
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, texts]);

  return (
    <div className="text-xs text-zinc-400 font-mono">
      {displayText}
      <span className="animate-pulse">|</span>
    </div>
  );
}

function LiveFeed() {
  const [items, setItems] = useState([
    { id: 1, type: 'match', title: 'Bendix Air Dryer', subtitle: 'Freightliner Cascadia', price: '$142.50', status: 'In Stock' },
    { id: 2, type: 'search', title: 'Searching Database...', subtitle: 'VIN: 1M8GDM9A...', status: 'Processing' },
    { id: 3, type: 'alert', title: 'Price Drop Alert', subtitle: 'Michelin X Line Energy', price: '-15%', status: 'Opportunity' },
  ]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev];
        const lastItem = newItems.pop();
        if (lastItem) newItems.unshift({ ...lastItem, id: Date.now() });
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center ${
              item.type === 'match' ? 'bg-brand-primary/20 text-brand-primary' :
              item.type === 'alert' ? 'bg-brand-secondary/20 text-brand-secondary' :
              'bg-zinc-800 text-zinc-400'
            }`}>
              {item.type === 'match' ? <CheckCircle2 size={14} /> :
               item.type === 'alert' ? <Zap size={14} /> :
               <Search size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-white truncate">{item.title}</div>
              <div className="text-[9px] text-zinc-500 truncate">{item.subtitle}</div>
            </div>
            <div className="text-right">
              {item.price && <div className="text-[10px] font-bold text-white">{item.price}</div>}
              <div className={`text-[8px] font-bold uppercase tracking-wider ${
                item.status === 'In Stock' ? 'text-brand-primary' :
                item.status === 'Opportunity' ? 'text-brand-secondary' :
                'text-zinc-500'
              }`}>{item.status}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-bold text-white">{q}</span>
        <ChevronRight size={20} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}
