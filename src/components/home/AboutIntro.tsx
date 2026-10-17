import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, MapPin, Building } from 'lucide-react';

export const AboutIntro: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80"
                alt="Arth Properties Real Estate Hadapsar Pune"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-navy-900 text-white p-5 rounded-2xl shadow-xl border border-navy-800 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Arth Properties</h4>
                  <p className="text-xs text-gold-300">अर्थ प्रॉपर्टीज • Hadapsar</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-2 leading-snug">
                Customer-centric real estate solutions tailored to your unique lifestyle & budget.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <span className="text-gold-600 font-bold text-xs uppercase tracking-widest block mb-2">
                About The Agency
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight leading-tight">
                Your Trusted Real Estate Partner in Hadapsar, Pune
              </h2>
            </div>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Arth Properties (अर्थ प्रॉपर्टीज) is a dedicated real estate agency located near Siddhi Driving School, Unnati Nagar, Gadital, Hadapsar. We assist individuals, families, and businesses in discovering suitable residential flats, independent homes, and commercial properties across Pune.
            </p>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Our core principle is simple: prioritize our clients’ requirements and financial comfort above all else. With honest market insights, transparent communication, and hands-on site visit assistance, we help you find the property that fits your lifestyle.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Tailored property shortlisting',
                'Detailed on-ground site visits',
                'Transparent pricing discussions',
                'Comprehensive Hadapsar expertise',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-navy-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Office location highlight */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-navy-900">Office Location: </span>
                Near Siddhi Driving School, Unnati Nagar, Gadital, Hadapsar, Pune 411028.
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <span>Read More About Us</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
