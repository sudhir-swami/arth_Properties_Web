import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Phone, MessageSquare, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { getWhatsAppLink } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onOpenEnquiry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const waUrl = getWhatsAppLink(
    '+919689965655',
    'Hello Arth Properties, I would like to enquire about properties in Hadapsar and Pune.'
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-navy-900 border-b-2 border-gold-500 pb-0.5'
                      : 'text-slate-600 hover:text-gold-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* WhatsApp Link */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span>WhatsApp</span>
            </a>

            {/* Click to Call */}
            <a
              href="tel:+919689965655"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg text-navy-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-600" />
              <span>+91 96899 65655</span>
            </a>

            {/* Enquire CTA */}
            {onOpenEnquiry ? (
              <button
                onClick={onOpenEnquiry}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-lg shadow-sm transition-colors border border-navy-700"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
              </button>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-lg shadow-sm transition-colors border border-navy-700"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
              </Link>
            )}

            {/* Admin Quick Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-lg text-navy-700 bg-gold-100 hover:bg-gold-200"
                title="Go to Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-navy-900" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-5 h-5 fill-emerald-600/20" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 mb-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-base font-semibold ${
                    isActive
                      ? 'bg-navy-50 text-navy-950 font-bold border-l-4 border-gold-500'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100">
            <a
              href="tel:+919689965655"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-navy-900 bg-slate-100 rounded-lg"
            >
              <Phone className="w-4 h-4 text-gold-600" />
              <span>Call +91 96899 65655</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            {onOpenEnquiry ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-lg shadow-sm"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            ) : (
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-lg shadow-sm"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
            )}

            <div className="pt-2 text-center">
              <Link to="/admin/login" className="text-xs text-slate-400 hover:text-slate-600">
                Administrator Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
