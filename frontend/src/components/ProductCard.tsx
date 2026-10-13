import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Product } from '../types';
import { getWhatsAppEnquiryUrl, BRAND_LOGOS } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const brandLogo = product.brandLogo || (product.brand ? BRAND_LOGOS[product.brand] : undefined);
  const isGeneric = !product.brand || product.brand === 'Unspecified' || product.brand === 'Unbranded / Generic';

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-[#E2E6EC] flex flex-col h-full overflow-hidden group">
      
      {/* Image Container with category overlay tag and brand label */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Label Overlay Tag */}
        <div className="absolute top-3 left-3 bg-[#14263D]/90 text-[#D7A94B] text-[11px] font-extrabold px-3 py-1 rounded-md backdrop-blur-sm shadow-sm uppercase tracking-wider">
          {product.category}
        </div>

        {/* Dedicated Brand Badge / Logo Area */}
        {!isGeneric && (
          <div className="absolute top-2.5 right-2.5 z-10 flex h-12 max-w-[52%] items-center justify-center rounded-lg bg-white px-2.5 shadow-[0_6px_16px_rgba(11,23,40,0.28)] ring-1 ring-black/10">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={`${product.brand} logo`}
                className="h-8 w-auto max-w-full object-contain"
                loading="lazy"
              />
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-tight text-[#14263D]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D7A94B] shrink-0" />
                {product.brand}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Brand Name Text above title if logo is shown */}
          {!isGeneric && (
            <div className="text-[11px] font-bold text-[#D7A94B] uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>{product.brand}</span>
            </div>
          )}

          <h3 className="text-base font-extrabold text-[#14263D] group-hover:text-[#D7A94B] transition-colors leading-snug">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          <p className="text-[#667085] text-sm mt-2 leading-relaxed line-clamp-2">
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
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
          
          {/* View Details White Button */}
          <Link
            to={`/product/${product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-[#14263D] text-[11px] sm:text-xs font-bold py-2.5 px-2.5 rounded-lg border border-[#E2E6EC] transition-colors text-center whitespace-nowrap"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>

          <a
            href={getWhatsAppEnquiryUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#14263D] hover:bg-[#0B1728] text-white text-[11px] sm:text-xs font-bold py-2.5 px-2.5 rounded-lg shadow-sm transition-colors text-center whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            <span>Enquire Price</span>
          </a>

        </div>
      </div>

    </div>
  );
};
