import React from 'react';
import { Phone, MessageSquare, MapPin } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/formatters';

interface ContactCTAProps {
  onOpenEnquiry?: () => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ onOpenEnquiry }) => {
  const waUrl = getWhatsAppLink(
    '+919689965655',
    'Hello Arth Properties, I am looking for a property in Pune and would like to speak to your team.'
  );

  return (
    <section className="py-16 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-navy-900/90 border border-gold-500/30 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl backdrop-blur-md text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold mb-6 border border-gold-500/30">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Hadapsar, Pune • Direct Assistance</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Looking for a Property in Pune?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you want to buy an apartment, find a rental flat, or invest in commercial retail space, our team is ready to assist you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Click to Call */}
            <a
              href="tel:+919689965655"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 96899 65655</span>
            </a>

            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us Directly</span>
            </a>

            {/* Enquiry Form Button */}
            {onOpenEnquiry && (
              <button
                onClick={onOpenEnquiry}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-navy-800 hover:bg-navy-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all"
              >
                <span>Request a Callback</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
