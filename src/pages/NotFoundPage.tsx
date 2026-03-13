import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="tactile-card p-12 max-w-md w-full text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto border border-brand-primary/20 shadow-glow">
          <AlertTriangle className="text-brand-primary" size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-display font-black text-white">404</h1>
          <h2 className="text-xl font-bold text-zinc-300">Page Not Found</h2>
          <p className="text-zinc-500 text-sm">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/" className="tactile-btn-light w-full py-4 rounded-xl flex items-center justify-center gap-2">
          <Home size={18} />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
