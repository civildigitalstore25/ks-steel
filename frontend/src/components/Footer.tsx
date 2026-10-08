import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO, PRODUCT_CATEGORIES, getWhatsAppEnquiryUrl } from '../data/products';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1728] text-slate-300 font-sans border-t border-slate-800">
      {/* Top Banner CTA */}
      <div className="bg-[#14263D] py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need Quality Building Materials in Pasupathikoil?
            </h3>
            <p className="text-slate-300 mt-2 text-sm sm:text-base">
              Get genuine pipes, water tanks, taps, cement, and TMT steel rebars directly from our local store.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold px-6 py-3 rounded-md shadow transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us Now</span>
            </a>
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold px-6 py-3 rounded-md shadow transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#D7A94B] text-[#0B1728] rounded flex items-center justify-center font-extrabold text-base">
              KS
            </div>
            <span className="font-extrabold text-xl text-white tracking-wide">
              K.S. STEEL CORP
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your trusted local dealer in Pasupathikoil for plumbing pipes, tanks, taps, cement, TMT steel rebars, and essential building supplies.
          </p>
          <div className="pt-2">
            <a
              href={BUSINESS_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#D7A94B] hover:underline font-semibold"
            >
              <MapPin className="w-4 h-4" />
              <span>Find us on Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-4 border-l-4 border-[#D7A94B] pl-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#D7A94B] transition-colors flex items-center gap-1.5">
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#D7A94B] transition-colors flex items-center gap-1.5">
                <span>Product Catalogue</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#D7A94B] transition-colors flex items-center gap-1.5">
                <span>About Us</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#D7A94B] transition-colors flex items-center gap-1.5">
                <span>Contact Us & Directions</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div>
          <h4 className="text-white font-bold text-lg mb-4 border-l-4 border-[#D7A94B] pl-3">
            Product Categories
          </h4>
          <ul className="space-y-2 text-sm">
            {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="hover:text-[#D7A94B] transition-colors flex items-center gap-1.5"
                >
                  <span>{cat.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Store Location & Contact */}
        <div>
          <h4 className="text-white font-bold text-lg mb-4 border-l-4 border-[#D7A94B] pl-3">
            Store Contact
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D7A94B] shrink-0 mt-0.5" />
              <span>{BUSINESS_INFO.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#D7A94B] shrink-0" />
              <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="hover:text-[#D7A94B]">
                {BUSINESS_INFO.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0" />
              <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]">
                WhatsApp: +91 98429 28278
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#070E18] py-4 px-4 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} K.S. Steel Corporation. All rights reserved.</span>
          <span>Ayyampettai, Pasupathikoil, Tamil Nadu</span>
        </div>
      </div>
    </footer>
  );
};
