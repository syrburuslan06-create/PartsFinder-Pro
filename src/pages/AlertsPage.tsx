import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Trash2, CheckCircle2, Clock, DollarSign, Truck, MailOpen, Mail, ExternalLink } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { AlertsService } from '../services/alertsService';

export default function AlertsPage() {
  const navigate = useNavigate();
  const { alerts, setAlerts, markAlertAsRead, markAllAlertsAsRead, deleteAllAlerts } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.is_read;
    if (filter === 'read') return alert.is_read;
    return true;
  });

  const handleDeleteAlert = async (id: string) => {
    const success = await AlertsService.deleteAlert(id);
    if (success) {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAlertsAsRead();
  };

  const handleClearAll = async () => {
    await deleteAllAlerts();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop': return <DollarSign size={20} className="text-emerald-500" />;
      case 'maintenance': return <Clock size={20} className="text-amber-500" />;
      case 'new_part': return <Truck size={20} className="text-brand-primary" />;
      default: return <Bell size={20} className="text-zinc-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.2em] uppercase">
            <Bell size={10} className="text-white" />
            Notifications Center
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            SYSTEM <span className="text-brand-primary italic">ALERTS.</span>
          </h1>
          <p className="text-zinc-400 font-medium">Real-time updates on price drops, maintenance, and availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMarkAllAsRead}
            className="tactile-btn-dark px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <CheckCircle2 size={14} /> Mark All Read
          </button>
          <button 
            onClick={handleClearAll}
            className="tactile-btn-dark px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-rose-500 hover:bg-rose-500/10"
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </header>

      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f ? 'bg-white/10 text-white shadow-glow' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="tactile-card p-20 text-center border-white/10">
          <div className="w-24 h-24 rounded-3xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center mx-auto mb-10">
            <Bell size={48} className="text-zinc-500" />
          </div>
          <h2 className="text-3xl font-display font-black text-white mb-4">No alerts found</h2>
          <p className="text-zinc-400 font-medium max-w-md mx-auto">
            You're all caught up! New alerts will appear here as they are generated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`tactile-card p-6 flex flex-col md:flex-row items-center gap-6 transition-all border-l-4 ${
                  !alert.is_read ? 'bg-brand-primary/5 border-l-brand-primary' : 'border-l-transparent'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                  !alert.is_read ? 'bg-white/10 border-white/20 shadow-glow' : 'bg-white/5 border-white/10'
                }`}>
                  {getAlertIcon(alert.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 text-wrap">
                    <h3 className="text-lg font-display font-black text-white">{alert.title}</h3>
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">{alert.description}</p>
                  
                  {alert.metadata && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {alert.type === 'price_drop' && alert.metadata.url && (
                        <a 
                          href={alert.metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> View Part
                        </a>
                      )}
                      {alert.type === 'maintenance' && (
                        <button 
                          onClick={() => navigate('/inventory')}
                          className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-1"
                        >
                          <Truck size={12} /> View Inventory
                        </button>
                      )}
                      {alert.type === 'new_part' && alert.metadata.url && (
                        <a 
                          href={alert.metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> View Supplier
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!alert.is_read ? (
                    <button 
                      onClick={() => markAlertAsRead(alert.id)}
                      className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-all"
                      title="Mark as read"
                    >
                      <Mail size={18} />
                    </button>
                  ) : (
                    <div className="p-3 text-zinc-600">
                      <MailOpen size={18} />
                    </div>
                  )}
                  <button 
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-rose-500 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
