import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO, PRODUCT_CATEGORIES, getWhatsAppEnquiryUrl } from '../data/products';

export const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Product Catalogue', to: '/products' },
    { label: 'About Us', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact & Directions', to: '/contact' },
  ];

  return (
    <footer className="bg-[#0B1728] text-slate-300 font-sans border-t border-slate-800">
      <div className="bg-[#14263D] py-4 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-5">
          <div className="min-w-0">
            <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
              Need building materials in Pasupathi Kovil?
            </h3>
            <p className="hidden sm:block text-slate-300 mt-1.5 text-sm max-w-2xl">
              Genuine steel, cement, pipes, paints, tools, and construction supplies from our local store.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 shrink-0">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold text-sm px-3 py-2 sm:px-5 sm:py-2.5 rounded-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-sm px-3 py-2 sm:px-5 sm:py-2.5 rounded-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6 sm:gap-8">
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#D7A94B] text-[#0B1728] rounded flex items-center justify-center font-extrabold text-sm">
                KS
              </div>
              <span className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                K.S. STEEL CORP
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed max-w-md line-clamp-3 sm:line-clamp-none">
              Your trusted local dealer in Pasupathi Kovil for steel rebars, cement, MS pipes, paints, power tools, roofing sheets, and essential building supplies.
            </p>
            <a
              href={BUSINESS_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#D7A94B] hover:underline font-semibold"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Find us on Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-2.5 sm:mb-3 border-l-4 border-[#D7A94B] pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-[13px] sm:text-sm">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-[#D7A94B] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm sm:text-base mb-2.5 sm:mb-3 border-l-4 border-[#D7A94B] pl-2.5">
              Categories
            </h4>
            <ul className="space-y-1.5 text-[13px] sm:text-sm">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="hover:text-[#D7A94B] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold text-sm sm:text-base mb-2.5 sm:mb-3 border-l-4 border-[#D7A94B] pl-2.5">
              Store Contact
            </h4>
            <ul className="space-y-2 text-[13px] sm:text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D7A94B] shrink-0 mt-0.5" />
                <span className="leading-snug">{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#D7A94B] shrink-0 mt-0.5" />
                <span className="flex flex-wrap gap-x-3 gap-y-0.5">
                  <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="hover:text-[#D7A94B]">
                    {BUSINESS_INFO.phone}
                  </a>
                  <a href={`tel:${BUSINESS_INFO.phoneSecondaryRaw}`} className="hover:text-[#D7A94B]">
                    {BUSINESS_INFO.phoneSecondary}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]">
                  WhatsApp {BUSINESS_INFO.whatsappNumber}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#070E18] py-3 px-4 text-center text-[11px] sm:text-xs text-slate-500 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2 sm:pr-36">
          <span>&copy; {new Date().getFullYear()} K.S. Steel Corporation. All rights reserved.</span>
          <span>{BUSINESS_INFO.locationShort}</span>
        </div>
      </div>
    </footer>
  );
};
