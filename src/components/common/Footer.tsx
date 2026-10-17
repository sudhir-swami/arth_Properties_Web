import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { MapPin, Phone, MessageSquare, Compass, Shield, Lock } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/formatters';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Near+Siddhi+Driving+School+Unnati+Nagar+Gadital+Hadapsar+Pune+411028';
  const waUrl = getWhatsAppLink('+919689965655', 'Hello Arth Properties, I would like to enquire about your services.');

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo light showTagline={false} />
            <p className="text-sm text-slate-400 leading-relaxed">
              A customer-focused real estate agency helping customers discover suitable residential and commercial properties according to their requirements and budgets in Hadapsar, Pune.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                title="WhatsApp Us"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="tel:+919689965655"
                className="w-9 h-9 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center hover:bg-gold-500 hover:text-navy-950 transition-all"
                title="Call Directly"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 text-slate-300 border border-navy-700 flex items-center justify-center hover:bg-navy-700 transition-all"
                title="Google Maps Location"
              >
                <Compass className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500 inline-block"></span>
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-gold-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=apartment" className="hover:text-gold-400 transition-colors">
                  Apartments in Hadapsar
                </Link>
              </li>
              <li>
                <Link to="/properties?transaction=rent" className="hover:text-gold-400 transition-colors">
                  Rental Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=commercial_shop" className="hover:text-gold-400 transition-colors">
                  Commercial Spaces
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">
                  About Arth Properties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Service Areas */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500 inline-block"></span>
              Service Areas
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Specialized property assistance across prime Pune localities:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Hadapsar', 'Gadital', 'Magarpatta City', 'Amanora', 'Handewadi Road', 'Saswad Road', 'Fursungi', 'Mundhwa', 'Wanowrie', 'Kharadi'].map((area) => (
                <Link
                  key={area}
                  to={`/properties?location=${encodeURIComponent(area)}`}
                  className="bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-gold-300 px-2.5 py-1 rounded border border-navy-800 transition-colors"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Office Address */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500 inline-block"></span>
              Office Address
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div className="text-slate-300 leading-snug">
                  Near Siddhi Driving School,<br />
                  Unnati Nagar, Gadital, Hadapsar,<br />
                  Pune, Maharashtra 411028, India.
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 underline underline-offset-4"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Get Google Maps Directions
                </a>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a
                  href="tel:+919689965655"
                  className="text-slate-200 hover:text-gold-400 font-medium"
                >
                  +91 96899 65655
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {currentYear} Arth Properties (अर्थ प्रॉपर्टीज). All rights reserved. Real Estate Agency in Hadapsar, Pune.
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              Customer-Focused Guidance
            </span>
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Lock className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
