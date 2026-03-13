import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Camera, 
  Sparkles, 
  Loader2,
  Settings,
  Lock,
  Globe,
  Smartphone,
  AlertTriangle,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const userRole = localStorage.getItem('userRole') || 'mechanic';
  const [name, setName] = useState('Professional Operator');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || '');
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          if (profile && profile.full_name) {
            setName(profile.full_name);
          } else {
            setName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Professional Operator');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  
  const planName = userRole === 'director' || userRole === 'owner' ? 'Director Plan' : userRole === 'supplier' ? 'Supplier Plan' : 'Individual Plan';
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Profile updated successfully');
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      alert('Subscription cancelled');
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    handleLogout();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
          <p className="text-zinc-400">Manage your account and preferences.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm font-bold"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2 md:col-span-1">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18} />} label="Profile" />
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18} />} label="Security" />
          <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<Bell size={18} />} label="Notifications" />
          <TabButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={<CreditCard size={18} />} label="Billing" />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-8">
          
          {activeTab === 'profile' && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="tactile-card p-8"
            >
              <h2 className="text-xl font-display font-bold text-white mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    <User size={48} className="text-zinc-500" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-brand-primary text-white rounded-lg shadow-glow hover:scale-110 transition-transform">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{name}</p>
                  <p className="text-zinc-400 text-sm">{email}</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider">
                    {userRole} Account
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all" 
                  />
                </div>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="tactile-btn-light px-8 py-3 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Save Changes
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'security' && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="tactile-card p-8">
                <h2 className="text-xl font-display font-bold text-white mb-6">Change Password</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all" 
                    />
                  </div>
                  <button 
                    onClick={handleChangePassword}
                    disabled={isLoading || !currentPassword || !newPassword}
                    className="tactile-btn-light px-8 py-3 flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                    Update Password
                  </button>
                </div>
              </div>

              <div className="tactile-card p-8 border-red-500/20">
                <h2 className="text-xl font-display font-bold text-white mb-2">Danger Zone</h2>
                <p className="text-zinc-400 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold"
                >
                  Delete Account
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'notifications' && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="tactile-card p-8"
            >
              <h2 className="text-xl font-display font-bold text-white mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <h3 className="text-white font-bold">Email Alerts</h3>
                    <p className="text-zinc-400 text-sm">Receive updates about your account and new features.</p>
                  </div>
                  <button 
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${emailAlerts ? 'bg-brand-primary' : 'bg-zinc-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${emailAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <h3 className="text-white font-bold">Price Drop Alerts</h3>
                    <p className="text-zinc-400 text-sm">Get notified when saved parts drop in price.</p>
                  </div>
                  <button 
                    onClick={() => setPriceDropAlerts(!priceDropAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${priceDropAlerts ? 'bg-brand-primary' : 'bg-zinc-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${priceDropAlerts ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'billing' && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="tactile-card p-8"
            >
              <h2 className="text-xl font-display font-bold text-white mb-6">Subscription Details</h2>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-brand-primary/20 to-transparent border border-brand-primary/30 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-1">Current Plan</div>
                    <h3 className="text-2xl font-black text-white">{planName}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                    Active
                  </div>
                </div>
                <div className="text-zinc-400 text-sm">
                  Next billing date: <span className="text-white font-bold">{nextBillingDate.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/payment')}
                  className="w-full tactile-btn-light py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Update Payment Method
                </button>
                <button 
                  onClick={handleCancelSubscription}
                  className="w-full py-4 rounded-xl bg-transparent text-zinc-400 border border-white/10 hover:bg-white/5 hover:text-white transition-all font-bold"
                >
                  Cancel Subscription
                </button>
              </div>
            </motion.section>
          )}

        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="tactile-card p-8 max-w-md w-full border-red-500/20"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-6 mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Delete Account?</h3>
              <p className="text-zinc-400 text-center text-sm mb-8">
                This action cannot be undone. All your data, saved parts, and search history will be permanently deleted.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
        active 
          ? 'bg-white/10 text-white border border-white/20' 
          : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 font-bold">
        {icon}
        {label}
      </div>
      <ChevronRight size={16} className={active ? 'opacity-100' : 'opacity-0'} />
    </button>
  );
}
