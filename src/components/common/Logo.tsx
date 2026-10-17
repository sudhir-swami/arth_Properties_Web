import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  light?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ light = false, className = '', showTagline = true }) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Architectural Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md ${
        light ? 'bg-gold-500 text-navy-950' : 'bg-navy-900 text-gold-400 border border-navy-700/60'
      }`}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-xl font-bold tracking-tight ${
            light ? 'text-white' : 'text-navy-900'
          }`}>
            Arth<span className="text-gold-500">Properties</span>
          </span>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
            light ? 'bg-navy-800 text-gold-300' : 'bg-gold-50 text-gold-700 border border-gold-200'
          }`}>
            अर्थ
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] tracking-wider uppercase font-semibold ${
            light ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Hadapsar • Pune
          </span>
        )}
      </div>
    </Link>
  );
};
