import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Camera, 
  Shield, 
  Zap, 
  X, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Info
} from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const steps: Step[] = [
  {
    title: "Universal Finder",
    description: "Search by part name, VIN, or part number. Our AI cross-references 40+ suppliers in real-time.",
    icon: <Search size={24} />,
    color: "bg-blue-500"
  },
  {
    title: "Vision ID",
    description: "Upload a photo of any part. Our Gemini-powered AI identifies it and checks for visual damage automatically.",
    icon: <Camera size={24} />,
    color: "bg-purple-500"
  },
  {
    title: "Trust Score",
    description: "Every result gets a 0-100 score based on fitment accuracy, supplier reliability, and price competitiveness.",
    icon: <Shield size={24} />,
    color: "bg-emerald-500"
  },
  {
    title: "Grounding Matrix",
    description: "See exactly why the AI recommended a part. We provide the reasoning path for every visual identification.",
    icon: <Zap size={24} />,
    color: "bg-amber-500"
  }
];

export default function OnboardingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="tactile-card max-w-lg w-full overflow-hidden border-white/10"
          >
            <div className="relative h-48 overflow-hidden">
              <div className={`absolute inset-0 opacity-20 ${steps[currentStep].color}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-6 rounded-full ${steps[currentStep].color} text-white shadow-glow`}
                >
                  {steps[currentStep].icon}
                </motion.div>
              </div>
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-xl hover:bg-black/60 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  {steps[currentStep].title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {steps.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentStep ? 'w-8 bg-brand-primary shadow-glow' : 'w-2 bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <button
                  onClick={nextStep}
                  className="tactile-btn-light px-8 py-3 text-xs flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next Step'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
