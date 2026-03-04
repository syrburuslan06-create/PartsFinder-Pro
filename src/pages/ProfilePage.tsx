import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Bell, CreditCard, LogOut, ChevronRight, Camera, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 shadow-glass border border-white/10 text-white text-[9px] font-black mb-2 tracking-[0.2em] uppercase"
            >
              <Sparkles size={10} className="text-white" />
              Settings Core
            </motion.div>
            <h1 className="text-3xl lg:text-5xl font-display font-black text-white tracking-tighter leading-none">ACCOUNT <span className="text-brand-primary italic">SETTINGS.</span></h1>
          </div>
          <button className="tactile-btn-dark px-4 py-2 text-red-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="tactile-card p-6 lg:p-8 border-white/10">
            <div className="flex items-center gap-6 lg:gap-8 mb-6 lg:mb-8">
              <div className="relative group">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/5 shadow-glass flex items-center justify-center border border-white/10 overflow-hidden group-hover:border-white/20 transition-all">
                  <User size={36} className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-brand-primary text-white rounded-xl shadow-glow hover:scale-110 transition-transform">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-display font-black text-white">Alex Mechanic</h3>
                <p className="text-zinc-400 font-medium text-sm lg:text-base">Fleet Manager at Solutions Inc.</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest shadow-glow">
                  Professional Plan
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" defaultValue="Alex Mechanic" className="tactile-input py-2.5 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" defaultValue="alex@solutions.com" className="tactile-input py-2.5 text-xs" />
              </div>
            </div>
            
            <button className="tactile-btn-dark mt-6 lg:mt-8 px-8 py-3 text-sm">Save Changes</button>
          </section>

          {/* Subscription Section */}
          <section className="tactile-card p-6 lg:p-8 border-white/10">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/5 shadow-glass border border-white/10">
                  <CreditCard className="text-white" size={18} />
                </div>
                <h3 className="text-lg lg:text-xl font-display font-black text-white">Subscription</h3>
              </div>
              <button className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Manage Billing</button>
            </div>

            <div className="p-4 lg:p-6 rounded-2xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-base lg:text-lg font-display font-black text-white">Professional Plan</p>
                <p className="text-[10px] lg:text-xs text-zinc-400 font-medium mt-0.5">$49.00 / mo • Next billing: March 20, 2024</p>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 font-bold">
                <CreditCard size={16} />
                <span className="text-xs">•••• 4242</span>
              </div>
            </div>
          </section>

          {/* Other Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <SettingsCard 
              icon={<Shield size={20} />}
              title="Security"
              description="Password, 2FA, and sessions"
            />
            <SettingsCard 
              icon={<Bell size={20} />}
              title="Notifications"
              description="Email and push preferences"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SettingsCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.button 
      whileHover={{ y: -5, rotateY: 2 }}
      className="tactile-card p-6 flex items-center justify-between border-white/10 text-left group preserve-3d"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/5 shadow-glass border border-white/10 group-hover:border-white/20 transition-all">
          {React.cloneElement(icon as React.ReactElement, { className: 'text-zinc-500 group-hover:text-white transition-colors' })}
        </div>
        <div>
          <h4 className="text-lg font-display font-black text-white">{title}</h4>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">{description}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-1" />
    </motion.button>
  );
}
