import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="tactile-card p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
            <FileText className="text-brand-primary" size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white">Terms of Service</h1>
        </div>
        
        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using PartsFinder Pro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>PartsFinder Pro provides users with access to a rich collection of resources, including various communications tools, search services, and personalized content. You understand and agree that the Service may include advertisements and that these advertisements are necessary for PartsFinder Pro to provide the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. User Conduct</h2>
            <p>You agree to not use the Service to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Upload, post, email, transmit or otherwise make available any Content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.</li>
              <li>Harm minors in any way.</li>
              <li>Impersonate any person or entity.</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Modifications to Service</h2>
            <p>PartsFinder Pro reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that PartsFinder Pro shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Termination</h2>
            <p>You agree that PartsFinder Pro may, under certain circumstances and without prior notice, immediately terminate your account and access to the Service. Cause for such termination shall include, but not be limited to, breaches or violations of the Terms of Service or other incorporated agreements or guidelines.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
