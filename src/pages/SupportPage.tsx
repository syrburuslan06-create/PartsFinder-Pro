import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Cpu, MessageSquare, LifeBuoy, Zap, Shield, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function SupportPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([
    { role: 'model', content: "Neural Core initialized. I am your technical fleet assistant. How can I help you identify parts or resolve technical issues today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

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
          systemInstruction: "You are the AI Core for PartsFinder Pro, a high-end technical support assistant for fleet managers and mechanics. You have deep knowledge of automotive parts, heavy machinery, and global supply chains. Be professional, technical, and efficient. CRITICAL: Only recommend parts from authorized US suppliers: RockAuto, PartsGeek, CarParts.com, AutoZone, JEGS, Buy Auto Parts, OEM Parts Online, 1A Auto, Advance Auto Parts, NAPA Auto Parts, Car-Part.com, AmericanTrucks, 4 Wheel Online, CSI Accessories, PartsVoice (for cars) and FinditParts, TruckPro, Beltway Truck Parts, DEX Heavy Duty Parts, Mr Truck Parts, Wheeler Fleet, Custom Truck One Source (for trucks). Use Google Search to verify part numbers and availability on these specific sites.",
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
    <div className="p-4 lg:p-8 h-full flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <header className="mb-4 lg:mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 shadow-glass border border-white/10 text-white text-[9px] font-black mb-2 tracking-[0.2em] uppercase"
          >
            <Sparkles size={10} className="text-white" />
            Support Core
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-0">
          {/* Chat Interface */}
          <div className="lg:col-span-8 flex flex-col tactile-card overflow-hidden border-white/10 h-full">
            <div className="p-4 lg:p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 shadow-glass border border-white/10 flex items-center justify-center">
                  <Cpu className="text-white" size={18} />
                </div>
                <div>
                  <p className="font-black text-white text-[10px] uppercase tracking-widest">AI CORE INTERFACE</p>
                  <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Online • Low Latency</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4 no-scrollbar">
              <AnimatePresence initial={false}>
                {chat.map((msg, idx) => (
                  <div key={`msg-${idx}`}>
                    <ChatMessage 
                      type={msg.role === 'user' ? 'user' : 'bot'} 
                      content={msg.content} 
                    />
                  </div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 shadow-glass border border-white/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                      <Loader2 size={18} className="animate-spin text-white" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">Processing...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 lg:p-6 border-t border-white/10 bg-white/5">
              <form onSubmit={handleSend} className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  placeholder={isLoading ? "Thinking..." : "Transmit message..."} 
                  className="tactile-input pr-16 lg:pr-20 py-3 lg:py-4 disabled:opacity-50 text-[10px] lg:text-xs"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 lg:p-3 bg-brand-primary text-white rounded-xl shadow-glow hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="tactile-card p-6 border-white/10">
              <h3 className="font-display font-black text-lg mb-6 flex items-center gap-3 text-white">
                <Zap className="text-white" size={18} />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <ActionButton icon={<MessageSquare size={16} />} label="Live Technician" />
                <ActionButton icon={<LifeBuoy size={16} />} label="Documentation" />
                <ActionButton icon={<Shield size={16} />} label="Warranty Claims" />
              </div>
            </div>

            <div className="tactile-card p-6 bg-white/5 border-white/10">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-4">System Status</p>
              <div className="space-y-3">
                <StatusItem label="Matrix Search" status="Operational" />
                <StatusItem label="Visual Core" status="Operational" />
                <StatusItem label="Supplier API" status="98ms" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ type, content }: { type: 'user' | 'bot', content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] p-6 rounded-3xl font-medium leading-relaxed ${
        type === 'user' 
          ? 'bg-brand-primary text-white rounded-tr-none shadow-glow' 
          : 'bg-white/5 shadow-glass border border-white/10 text-white rounded-tl-none'
      }`}>
        <p className="text-sm md:text-base">{content}</p>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 shadow-glass border border-white/10 hover:bg-white/10 transition-all text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white group">
      <div className="flex items-center gap-4">
        <div className="text-zinc-500 group-hover:text-white transition-colors">{icon}</div>
        {label}
      </div>
      <ChevronRight size={16} className="text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-1" />
    </button>
  );
}

function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function StatusItem({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-zinc-500 font-bold">{label}</span>
      <span className="text-[10px] font-black text-white uppercase tracking-widest">{status}</span>
    </div>
  );
}
