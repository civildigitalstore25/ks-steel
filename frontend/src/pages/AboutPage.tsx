import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppEnquiryUrl } from '../data/products';

export const AboutPage: React.FC = () => {
  return (
    <div className="font-sans bg-[#F5F6F8] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Banner */}
        <div className="bg-[#14263D] text-white rounded-2xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-[#D7A94B] font-bold text-xs uppercase tracking-widest">
              ABOUT K.S. STEEL CORPORATION
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 leading-tight">
              Your Trusted Local Supplier for Construction & Plumbing Materials
            </h1>
            <p className="text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
              Located in Pasupathikoil, Tamil Nadu, K.S. Steel Corporation supplies contractors, builders, plumbers, and homeowners with high-quality plumbing pipes, water storage tanks, CP bathroom fittings, UltraTech cement, and TMT reinforcement steel rebars.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden lg:block bg-gradient-to-l from-white to-transparent" />
        </div>

        {/* Overview & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14263D]">
              Direct Sourcing from Leading Brands
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              At K.S. Steel Corporation, we prioritize product quality and customer satisfaction. We stock top-rated building supplies from recognized manufacturers to ensure every building project in Pasupathikoil and surrounding areas achieves lasting structural durability.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-3 text-slate-800 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <span>Authorized Astral & Ashirvad plumbing and borewell piping systems</span>
              </li>
              <li className="flex items-start gap-3 text-slate-800 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <span>Multi-layer UV-stabilized Vectus overhead water tanks</span>
              </li>
              <li className="flex items-start gap-3 text-slate-800 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <span>UltraTech OPC & PPC construction grade cement</span>
              </li>
              <li className="flex items-start gap-3 text-slate-800 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <span>Amman TMT Fe 550D high-ductility structural rebars</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden shadow-sm aspect-4/3 bg-slate-200 border border-slate-200">
              <img
                src="/images/hero.jpg"
                alt="Construction pipes warehouse"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm aspect-4/3 bg-slate-200 border border-slate-200">
              <img
                src="/images/steel.jpg"
                alt="Amman TMT Steel Rebars"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm aspect-4/3 bg-slate-200 border border-slate-200">
              <img
                src="/images/water-tank.jpg"
                alt="Vectus Water Storage Tanks"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm aspect-4/3 bg-slate-200 border border-slate-200">
              <img
                src="/images/cement.jpg"
                alt="UltraTech Cement Bags"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Business Location & Contact Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#14263D]">
              Visit K.S. Steel Corporation Store
            </h3>
            <p className="text-slate-600 text-sm flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#D7A94B] shrink-0" />
              <span>{BUSINESS_INFO.address}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#14263D] text-white font-bold text-sm py-3 px-6 rounded-lg shadow hover:bg-[#0B1728] transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 px-6 rounded-lg shadow hover:bg-[#1EBE57] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Enquiry</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
