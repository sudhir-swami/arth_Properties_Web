import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/formatters';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const waUrl = getWhatsAppLink(
    '+919689965655',
    'Hello Arth Properties, I am visiting your website and would like assistance discovering suitable properties in Pune.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col select-none">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="mb-3 mr-1 bg-white text-navy-950 text-xs py-2 px-3.5 rounded-xl shadow-xl border border-slate-200 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -right-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-semibold text-navy-900">Need help finding a property?</p>
          <p className="text-slate-600 mt-0.5">Chat directly with Arth Properties team on WhatsApp.</p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp with Arth Properties"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-semibold pr-1">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
};
