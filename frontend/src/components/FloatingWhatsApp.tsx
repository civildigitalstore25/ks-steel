import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '../data/products';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={getWhatsAppEnquiryUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400/50 group"
    >
      <div className="relative flex items-center justify-center">
        <MessageSquare className="w-6 h-6 fill-current text-white shrink-0" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
      </div>
      <span className="hidden sm:inline-block text-sm sm:text-base font-bold tracking-wide">
        WhatsApp
      </span>
    </a>
  );
};
