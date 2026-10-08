import React from 'react';
import { Search, MessageSquare, X } from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '../data/products';

interface ProductSearchToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  availableBrands: string[];
}

export const ProductSearchToolbar: React.FC<ProductSearchToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  availableBrands,
}) => {
  return (
    <div className="bg-[#F5F6F8] p-4 sm:p-5 rounded-2xl border border-[#E2E6EC] shadow-sm font-sans mb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, brands or categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-[#E2E6EC] rounded-xl text-sm text-[#202A36] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#D7A94B] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Brand Filter */}
        <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-xs font-bold text-[#14263D] uppercase tracking-wider shrink-0 hidden sm:block">
            FILTER BY BRAND:
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full py-3 px-3.5 bg-white border border-[#E2E6EC] rounded-xl text-sm text-[#202A36] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D7A94B] focus:border-transparent"
          >
            <option value="all">All brands</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Enquire Now Gold Button */}
        <div className="md:col-span-3 flex justify-end">
          <a
            href={getWhatsAppEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-extrabold text-sm py-3 px-6 rounded-xl shadow transition-all transform active:scale-95 text-center"
          >
            <MessageSquare className="w-4 h-4 fill-current text-[#0B1728]" />
            <span>Enquire Now</span>
          </a>
        </div>

      </div>
    </div>
  );
};
