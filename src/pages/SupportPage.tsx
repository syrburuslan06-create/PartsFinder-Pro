import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LifeBuoy, MessageSquare, Phone, Mail, 
  ChevronDown, Search, ExternalLink, 
  CheckCircle2, Send, Loader2, AlertCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Search",
    question: "How do I use the VIN decoder?",
    answer: "Simply enter your 17-digit VIN in the search bar. Our AI will automatically decode the vehicle specifications and filter compatible parts for you."
  },
  {
    category: "Search",
    question: "What is the Trust Score?",
    answer: "The Trust Score is a 0-100% rating based on part number match, price competitiveness, supplier reliability, and historical success data. Click the score badge to see the full breakdown."
  },
  {
    category: "Account",
    question: "How do I add workers to my fleet?",
    answer: "As a Director, go to your Dashboard and copy the 'Invite Link'. Send this link to your workers; when they register using it, they will be automatically added to your fleet."
  },
  {
    category: "Billing",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can manage and cancel your subscription from the Profile > Billing section. You will retain access until the end of your current billing cycle."
  },
  {
    category: "Technical",
    question: "Does the app work offline?",
    answer: "Yes! PartsFinder Pro is a PWA. You can access your saved parts and search history without an internet connection. Changes will sync once you're back online."
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest"
        >
          <LifeBuoy size={14} />
          Help Center
        </motion.div>
        <h1 className="text-5xl lg:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
          HOW CAN WE <span className="text-brand-primary italic">HELP?</span>
        </h1>
        <p className="text-zinc-400 font-medium max-w-2xl mx-auto">
          Search our knowledge base or get in touch with our support team for personalized assistance.
        </p>
      </header>

      {/* Quick Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContactCard 
          icon={<MessageSquare className="text-brand-primary" />}
          title="Live Chat"
          description="Average response: 2 mins"
          action="Start Chat"
        />
        <ContactCard 
          icon={<Phone className="text-emerald-400" />}
          title="Phone Support"
          description="Mon-Fri, 8am-6pm EST"
          action="Call Now"
        />
        <ContactCard 
          icon={<Mail className="text-indigo-400" />}
          title="Email Us"
          description="support@partsfinder.pro"
          action="Send Email"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">Frequently Asked Questions</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search FAQs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tactile-input w-full py-4 pl-12 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
              <div key={idx} className="tactile-card overflow-hidden border-white/5">
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-brand-primary uppercase tracking-widest">{faq.category}</span>
                    <p className="text-sm font-bold text-white">{faq.question}</p>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`text-zinc-500 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5"
                    >
                      <div className="p-5 text-sm text-zinc-400 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )) : (
              <div className="text-center py-12 tactile-card border-white/5">
                <AlertCircle size={32} className="text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">No matching FAQs found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <div className="tactile-card p-8 border-white/10 space-y-6 bg-brand-primary/5">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Direct Message</h3>
              <p className="text-xs text-zinc-400 font-medium">Can't find what you need? Message us directly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Subject</label>
                <select className="tactile-input w-full py-3 px-4 text-sm appearance-none" required>
                  <option value="">Select a topic...</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  className="tactile-input w-full py-3 px-4 text-sm min-h-[120px] resize-none" 
                  placeholder="Describe your issue in detail..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || isSubmitted}
                className={`tactile-btn-light w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 ${isSubmitted ? 'bg-emerald-500 border-emerald-500 text-white' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 size={16} />
                    Message Sent
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="tactile-card p-6 border-white/5 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Resources</h4>
            <div className="space-y-2">
              <ResourceLink label="Developer API Docs" />
              <ResourceLink label="Supplier Integration Guide" />
              <ResourceLink label="Fleet Management Best Practices" />
              <ResourceLink label="Security Whitepaper" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="tactile-card p-6 border-white/5 space-y-4 group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:shadow-glow transition-all">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-display font-black text-white">{title}</h3>
        <p className="text-xs text-zinc-500 font-medium">{description}</p>
      </div>
      <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
        {action} <ExternalLink size={10} />
      </button>
    </motion.div>
  );
}

function ResourceLink({ label }: { label: string }) {
  return (
    <a href="#" className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all group">
      {label}
      <ChevronDown size={14} className="-rotate-90 text-zinc-700 group-hover:text-brand-primary transition-colors" />
    </a>
  );
}
