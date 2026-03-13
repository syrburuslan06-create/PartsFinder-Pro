import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="tactile-card p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
            <Shield className="text-brand-primary" size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white">Privacy Policy</h1>
        </div>
        
        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>We may use the information we collect about you to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide, maintain, and improve our Services.</li>
              <li>Perform internal operations, including, for example, to prevent fraud and abuse of our Services.</li>
              <li>Send or facilitate communications between you and other users.</li>
              <li>Send you communications we think will be of interest to you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Sharing of Information</h2>
            <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>With third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us.</li>
              <li>With the general public if you submit content in a public forum.</li>
              <li>With third parties with whom you choose to let us share information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Statement, please contact us at privacy@partsfinderpro.com.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
