import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Cpu, Loader2, Sparkles, Shield, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLocation } from 'react-router-dom';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([
    { role: 'model', content: "Neural Core initialized. How can I assist you with your operations today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const userRole = localStorage.getItem('userRole') || 'guest';

  // Don't show on landing page
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname.startsWith('/register')) {
    return null;
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isOpen]);

  const getSystemPrompt = (role: string) => {
    const basePrompt = "You are the AI Core for Parts Hub, a high-end technical support assistant. You have deep knowledge of automotive parts, heavy machinery, and global supply chains. Be professional, technical, and efficient. CRITICAL: Only recommend parts from authorized US suppliers: RockAuto, PartsGeek, CarParts.com, AutoZone, JEGS, Buy Auto Parts, OEM Parts Online, 1A Auto, Advance Auto Parts, NAPA Auto Parts, Car-Part.com, AmericanTrucks, 4 Wheel Online, CSI Accessories, PartsVoice (for cars) and FinditParts, TruckPro, Beltway Truck Parts, DEX Heavy Duty Parts, Mr Truck Parts, Wheeler Fleet, Custom Truck One Source (for trucks). Use Google Search to verify part numbers and availability on these specific sites.";
    
    switch (role) {
      case 'director':
      case 'owner':
        return `${basePrompt} You are talking to a Fleet Director/Owner. Focus your answers on fleet management, cost optimization, bulk ordering, employee performance, and high-level supply chain metrics.`;
      case 'supplier':
        return `${basePrompt} You are talking to a Parts Supplier. Focus your answers on inventory management, order fulfillment, catalog uploads, pricing strategies, and market demand for specific parts.`;
      case 'super_admin':
        return `${basePrompt} You are talking to a Super Admin. You have full access to platform statistics, user management, and system health. Provide comprehensive, unfiltered technical details and platform-wide insights.`;
      case 'mechanic':
      default:
        return `${basePrompt} You are talking to a Mechanic/Individual. Focus your answers on part identification, compatibility, installation guides, and finding the best prices for specific vehicle repairs.`;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...chat, { role: 'user', content: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: getSystemPrompt(userRole),
          tools: [{ googleSearch: {} }]
        }
      });

      const botResponse = response.text || "I encountered a synchronization error with the neural core. Please try again.";
      setChat(prev => [...prev, { role: 'model', content: botResponse }]);
    } catch (error) {
      console.error("Support Chat Error:", error);
      setChat(prev => [...prev, { role: 'model', content: "Downlink interrupted. Please check your connection to the AI Core." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-primary text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform z-50"
          >
            <MessageSquare size={24} className="fill-current" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-bg animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-bg/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Cpu className="text-white relative z-10" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-display font-black tracking-tight leading-none mb-1">AI CORE</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    <span className="text-[10px] text-brand-primary font-mono uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {chat.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-brand-primary text-black rounded-tr-sm font-medium' 
                      : 'bg-white/5 border border-white/10 text-zinc-300 rounded-tl-sm'
                  }`}>
                    {msg.role === 'model' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu size={12} className="text-brand-primary" />
                        <span className="text-[10px] font-mono text-brand-primary uppercase tracking-wider">System</span>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
                    <Loader2 size={16} className="text-brand-primary animate-spin" />
                    <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Processing...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Query the AI Core..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-mono"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-brand-primary hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-white/10 disabled:hover:text-white"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
