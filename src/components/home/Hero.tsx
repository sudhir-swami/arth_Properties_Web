import React from 'react';
import { Link } from 'react-router-dom';
import { SearchFilterBar } from './SearchFilterBar';
import { ArrowRight, PhoneCall, ShieldCheck, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenEnquiry?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="relative bg-navy-950 text-white overflow-hidden">
      {/* Background Architectural Image with Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85"
          alt="Modern Architectural Home in Pune"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/80 to-navy-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-gold-500/30 text-gold-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Hadapsar & Pune Real Estate Agency • अर्थ प्रॉपर्टीज</span>
          </div>
        </div>

        {/* Hero Title & Copy */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Find Your Perfect Property with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
              Arth Properties
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Discover homes, rental properties, and commercial spaces in Hadapsar and across Pune. Find the right property with personalized guidance from our team.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-navy-950 font-extrabold text-sm shadow-gold-glow transition-all duration-200"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {onOpenEnquiry ? (
              <button
                onClick={onOpenEnquiry}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-800/90 hover:bg-navy-800 text-white font-bold text-sm border border-slate-700 hover:border-gold-500/50 backdrop-blur-md transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>Contact Our Team</span>
              </button>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-800/90 hover:bg-navy-800 text-white font-bold text-sm border border-slate-700 hover:border-gold-500/50 backdrop-blur-md transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>Contact Our Team</span>
              </Link>
            )}
          </div>
        </div>

        {/* Embedded Working Search Filter Bar */}
        <div className="mt-6 md:mt-10">
          <SearchFilterBar initialTransactionType="buy" />
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="bg-navy-900/60 border border-navy-800 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-xl md:text-2xl font-extrabold text-gold-400">100%</span>
            <span className="text-xs text-slate-300 font-medium">Customer-Focused</span>
          </div>
          <div className="bg-navy-900/60 border border-navy-800 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-xl md:text-2xl font-extrabold text-white">Hadapsar</span>
            <span className="text-xs text-slate-300 font-medium">Local Market Insight</span>
          </div>
          <div className="bg-navy-900/60 border border-navy-800 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-xl md:text-2xl font-extrabold text-gold-400">Verified</span>
            <span className="text-xs text-slate-300 font-medium">Property Recommendations</span>
          </div>
          <div className="bg-navy-900/60 border border-navy-800 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-xl md:text-2xl font-extrabold text-white">Transparent</span>
            <span className="text-xs text-slate-300 font-medium">Assistance & Visits</span>
          </div>
        </div>
      </div>
    </div>
  );
};
