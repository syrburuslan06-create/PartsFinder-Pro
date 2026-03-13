import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Shield, Lock, CheckCircle2, ChevronRight, Info, AlertTriangle, Loader2, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Check for cancel or success in URL
    const query = new URLSearchParams(location.search);
    if (query.get('canceled')) {
      setError('Payment was canceled. You have not been charged.');
    }
    if (query.get('success')) {
      // If success, update local storage and redirect
      localStorage.setItem('isPaid', 'true');
      navigate('/home');
    }
  }, [location, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to subscribe.');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'individual',
          userId: session.user.id,
          successUrl: `${window.location.origin}/payment?success=true`,
          cancelUrl: `${window.location.origin}/payment?canceled=true`,
        }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response. Please try again later.");
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred while processing your payment.');
      setIsProcessing(false);
    }
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
          <p className="text-zinc-500 mb-10 font-medium">Start your Individual plan for $49.99/month</p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-500 text-sm font-bold"
              >
                <AlertTriangle size={20} className="flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="tactile-card p-8 border-white/10">
            {isLoggedIn === false ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Lock className="text-zinc-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
                <p className="text-zinc-400 mb-8">You must be logged in to subscribe to a plan.</p>
                <Link 
                  to="/login" 
                  state={{ from: { pathname: '/payment' } }}
                  className="tactile-btn-light w-full py-4 text-lg inline-flex items-center justify-center gap-2"
                >
                  <LogIn size={20} />
                  Log in to continue
                </Link>
              </div>
            ) : (
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isProcessing || isLoggedIn === null}
                    className="tactile-btn-light w-full py-5 text-lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Redirecting to Stripe...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Subscribe via Stripe — $49.99
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
                    Stripe Encrypted
                  </div>
                </div>
              </form>
            )}
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
                    <p className="font-bold text-white">Individual Plan</p>
                    <p className="text-xs text-zinc-500 font-medium">Monthly Subscription</p>
                  </div>
                </div>
                <span className="font-black text-white">$49.99</span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm text-zinc-500 font-medium">
                <span>Subtotal</span>
                <span>$49.99</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-500 font-medium">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-3 text-white">
                <span>Total due today</span>
                <span className="text-brand-primary">$49.99</span>
              </div>
            </div>

            <div className="mt-10 p-4 rounded-xl bg-white/5 shadow-glass border border-white/10 flex gap-3">
              <Info size={20} className="text-brand-primary flex-shrink-0" />
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                You will be redirected to Stripe's secure checkout. Your subscription will automatically renew every month. You can cancel anytime from your account settings.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
