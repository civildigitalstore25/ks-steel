import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Product } from '../types';
import { getWhatsAppEnquiryUrl } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#E2E6EC] flex flex-col h-full overflow-hidden group">
      
      {/* Image Container with category overlay tag */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Label Overlay Tag */}
        <div className="absolute top-3 left-3 bg-[#14263D]/90 text-[#D7A94B] text-[11px] font-extrabold px-3 py-1 rounded-md backdrop-blur-sm shadow-sm uppercase tracking-wider">
          {product.category}
        </div>

        {/* Brand Tag if applicable */}
        {product.brand && product.brand !== 'Unspecified' && (
          <div className="absolute top-3 right-3 bg-white/90 text-[#14263D] text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-slate-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#D7A94B]" />
            <span>{product.brand}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-extrabold text-[#14263D] group-hover:text-[#D7A94B] transition-colors leading-snug">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          <p className="text-[#667085] text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
            {product.shortDescription}
          </p>

          {/* Verification note if present */}
          {product.verificationNote && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-800 flex items-start gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-[#D7A94B] shrink-0 mt-0.5" />
              <span>{product.verificationNote}</span>
            </div>
          )}
        </div>

        {/* Bottom Action Area */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          {/* View Details White Button */}
          <Link
            to={`/product/${product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-[#14263D] text-xs font-bold py-2.5 px-3 rounded-lg border border-[#E2E6EC] transition-colors text-center"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Enquire for Price Dark Navy Button */}
          <a
            href={getWhatsAppEnquiryUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#14263D] hover:bg-[#0B1728] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition-colors text-center"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Enquire Price</span>
          </a>

        </div>
      </div>

    </div>
  );
};
