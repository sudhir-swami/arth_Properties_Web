import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Compass, ShieldCheck, HeartHandshake, Eye, Award } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/formatters';

export const AboutPage: React.FC = () => {
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Near+Siddhi+Driving+School+Unnati+Nagar+Gadital+Hadapsar+Pune+411028';
  const waUrl = getWhatsAppLink('+919689965655', 'Hello Arth Properties, I would like to learn more about your real estate services.');

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold uppercase tracking-wider mb-4">
            <span>About Us • अर्थ प्रॉपर्टीज</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
            Discover Arth Properties
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A customer-focused real estate agency dedicated to helping you discover suitable homes, rental flats, and commercial premises across Hadapsar and Pune.
          </p>
        </div>

        {/* Narrative & Visual Showcase */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
                Grounded in Hadapsar, Serving Pune Property Seekers
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Arth Properties is established with a clear mission: to make property search in Pune transparent, reliable, and tailored to each client’s individual situation.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Whether you are a first-time homebuyer searching for a family apartment near Magarpatta, a tenant looking for a ready flat near Gadital, or a business owner seeking high-visibility retail space on the Pune-Solapur Highway, we offer personalized guidance every step of the way.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-navy-900">Office Location:</span>
                    <br />Near Siddhi Driving School, Unnati Nagar, Gadital, Hadapsar, Pune, Maharashtra 411028, India.
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-gold-700 hover:text-gold-800 underline underline-offset-4"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
                  alt="Hadapsar Pune Real Estate"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Guiding Principles */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Our Agency Values
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              The principles that govern our interactions with every property seeker.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-navy-50 text-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">Customer First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We take the time to understand your personal lifestyle requirements, commute needs, and budget before proposing listings.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-navy-50 text-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">Honesty & Clarity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear communication on legal aspects, physical condition, layout pros and cons, and real pricing without misleading claims.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-navy-50 text-navy-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">Local Dedication</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unmatched on-ground insight into Hadapsar, Gadital, Saswad Road, and surrounding neighborhoods.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Ready to Explore Properties in Pune?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Get in touch with our team today. We are always ready to discuss your requirements and schedule visits.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/properties"
              className="px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-extrabold text-sm rounded-xl transition-all"
            >
              Browse Properties
            </Link>
            <a
              href="tel:+919689965655"
              className="px-6 py-3.5 bg-navy-800 hover:bg-navy-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>+91 96899 65655</span>
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
