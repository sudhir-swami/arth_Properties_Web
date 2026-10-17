import React from 'react';
import { MessageSquareText, SearchCode, CalendarCheck, Handshake } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Tell Us Your Requirements',
      description:
        'Share your preferred locality, budget range, property type (buy or rent), configuration, and timeline via phone, WhatsApp, or our enquiry form.',
      icon: MessageSquareText,
    },
    {
      number: '02',
      title: 'Explore Suitable Properties',
      description:
        'Our team reviews available options and curates a personalized shortlist of verified properties matching your exact criteria.',
      icon: SearchCode,
    },
    {
      number: '03',
      title: 'Arrange a Property Visit',
      description:
        'We schedule and accompany you on physical site inspections at your convenience, allowing you to evaluate the neighborhood, layout, and amenities.',
      icon: CalendarCheck,
    },
    {
      number: '04',
      title: 'Get Assistance Through Next Steps',
      description:
        'Receive step-by-step guidance through pricing discussions, documentation verification, agreements, and possession formalities.',
      icon: Handshake,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold-600 font-bold text-xs uppercase tracking-widest block mb-2">
            Simple & Transparent Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight">
            How Arth Properties Works With You
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-3">
            A structured, customer-first approach designed to make finding and finalizing your property smooth and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-card transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold text-gold-500/40">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-navy-900 mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-gold-600">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
