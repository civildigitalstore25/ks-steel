import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Menu, X, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppEnquiryUrl } from '../data/products';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm w-full font-sans">
      {/* Top Information Bar */}
      <div className="bg-[#0B1728] text-white text-xs md:text-sm py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Left: Location Pin */}
          <a
            href={BUSINESS_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#D7A94B] transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#D7A94B] shrink-0" />
            <span>{BUSINESS_INFO.locationShort}</span>
          </a>

          {/* Right: Phone */}
          <a
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="flex items-center gap-2 hover:text-[#D7A94B] transition-colors font-medium"
          >
            <Phone className="w-4 h-4 text-[#D7A94B] shrink-0" />
            <span>{BUSINESS_INFO.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-[#14263D] rounded-md flex items-center justify-between p-2 shadow-md group-hover:bg-[#0B1728] transition-colors">
              <div className="flex flex-col justify-center items-center w-full h-full text-[#D7A94B] font-extrabold text-lg leading-none tracking-tighter">
                <span>KS</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#14263D] leading-tight group-hover:text-[#0B1728] transition-colors">
                K.S. STEEL
              </span>
              <span className="text-[11px] font-semibold text-[#D7A94B] uppercase tracking-widest leading-none">
                CORPORATION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-base font-semibold transition-colors py-2 ${
                    active
                      ? 'text-[#14263D] font-bold'
                      : 'text-slate-700 hover:text-[#14263D]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#D7A94B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Enquire Now Gold Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire Now</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-slate-700 hover:text-[#14263D] hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-md font-semibold text-base transition-colors ${
                    active
                      ? 'bg-[#14263D] text-white'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#D7A94B] text-[#0B1728] font-bold py-3 rounded-md shadow text-center"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Enquire Now on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
