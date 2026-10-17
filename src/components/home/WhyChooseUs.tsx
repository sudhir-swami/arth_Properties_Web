import React from 'react';
import { Target, Wallet, MessageSquareText, MapPinCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Personalized Property Recommendations',
      description:
        'We listen closely to your specific family or business requirements, presenting listings that genuinely fit your criteria rather than pushing generic stock.',
      icon: Target,
      highlight: 'Tailored Discovery',
    },
    {
      title: 'Budget-Conscious Guidance',
      description:
        'Transparent discussions on pricing, recurring maintenance costs, and transaction fees so you make confident decisions that respect your financial plans.',
      icon: Wallet,
      highlight: 'Financial Clarity',
    },
    {
      title: 'Responsive Communication',
      description:
        'Prompt phone, WhatsApp, and in-person responses. We value your time and keep you continuously informed at every stage of your property journey.',
      icon: MessageSquareText,
      highlight: 'Always Accessible',
    },
    {
      title: 'Local Property Assistance',
      description:
        'Deep on-ground knowledge of Hadapsar, Gadital, Magarpatta, and surrounding eastern Pune localities to help you assess connectivity, neighborhood amenities, and future value.',
      icon: MapPinCheck,
      highlight: 'Hadapsar Specialists',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-navy-950 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold-400 font-bold text-xs uppercase tracking-widest block mb-2">
            Our Commitment
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Why Choose Arth Properties
          </h2>
          <p className="text-sm md:text-base text-slate-300 mt-3 leading-relaxed">
            As an independent, client-focused real estate agency in Hadapsar, we prioritize your long-term satisfaction with honest advice and dedicated service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-navy-900/80 border border-navy-800 rounded-2xl p-6 hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-gold-400 block mb-1">
                    {pt.highlight}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {pt.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
