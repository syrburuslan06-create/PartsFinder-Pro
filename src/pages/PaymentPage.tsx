import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Shield, Lock, CheckCircle2, ChevronRight, Info } from 'lucide-react';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      localStorage.setItem('isPaid', 'true');
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-bg">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Payment Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-display font-black mb-2 text-white">Complete your subscription</h1>
          <p className="text-zinc-500 mb-10 font-medium">Start your Professional plan for $49/month</p>

          <div className="tactile-card p-8 border-white/10">
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-2">Cardholder Name</label>
                <input type="text" required placeholder="John Doe" className="tactile-input w-full py-4 px-4" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-2">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input type="text" required placeholder="0000 0000 0000 0000" className="tactile-input w-full py-4 pl-12 pr-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-2">Expiry Date</label>
                  <input type="text" required placeholder="MM / YY" className="tactile-input w-full py-4 px-4" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-2">CVC</label>
                  <input type="text" required placeholder="123" className="tactile-input w-full py-4 px-4" />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="tactile-btn-light w-full py-5 text-lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Subscribe Now — $49.00
                      <ChevronRight size={20} />
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 text-zinc-500">
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                  <Lock size={12} />
                  Secure SSL
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                  <Shield size={12} />
                  Encrypted
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:sticky lg:top-32"
        >
          <div className="tactile-card p-8 border-white/10 bg-white/5">
            <h3 className="text-xl font-display font-black mb-6 text-white">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass flex items-center justify-center border border-white/10">
                    <CheckCircle2 className="text-brand-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Professional Plan</p>
                    <p className="text-xs text-zinc-500 font-medium">Monthly Subscription</p>
                  </div>
                </div>
                <span className="font-black text-white">$49.00</span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm text-zinc-500 font-medium">
                <span>Subtotal</span>
                <span>$49.00</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-500 font-medium">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-3 text-white">
                <span>Total due today</span>
                <span className="text-brand-primary">$49.00</span>
              </div>
            </div>

            <div className="mt-10 p-4 rounded-xl bg-white/5 shadow-glass border border-white/10 flex gap-3">
              <Info size={20} className="text-brand-primary flex-shrink-0" />
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Your subscription will automatically renew every month. You can cancel anytime from your account settings.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
