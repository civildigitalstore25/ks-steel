import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  Tag
} from 'lucide-react';
import { PRODUCTS, BUSINESS_INFO, getWhatsAppEnquiryUrl } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#14263D]">Product Not Found</h2>
          <p className="text-slate-600 text-sm mt-2">
            The requested product details could not be found or has been updated in our catalogue.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 bg-[#14263D] text-white font-bold text-sm py-2.5 px-6 rounded-lg hover:bg-[#0B1728] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="font-sans bg-[#F5F6F8] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#14263D] font-bold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#D7A94B]" />
            <span>Back to Products Catalogue</span>
          </Link>
        </div>

        {/* Main Product Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10">
            
            {/* Left Column: Image */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.brand && (
                  <span className="absolute top-4 left-4 bg-[#14263D] text-[#D7A94B] font-extrabold text-xs px-3 py-1.5 rounded-md shadow-md flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D7A94B]" />
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Local Availability Badge */}
              <div className="w-full mt-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D7A94B]" />
                  <span>Available at Store in Pasupathikoil</span>
                </span>
                <span className="text-[#25D366] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>In Stock</span>
                </span>
              </div>
            </div>

            {/* Right Column: Product Details */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#D7A94B] uppercase tracking-wider mb-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{product.category}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14263D] leading-tight">
                  {product.name}
                </h1>

                <p className="text-slate-600 mt-4 leading-relaxed text-sm sm:text-base">
                  {product.fullDescription}
                </p>

                {/* Verified Specs Table */}
                {product.specifications && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-[#14263D] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D7A94B]" />
                      <span>Product Specifications</span>
                    </h3>
                    <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200/80">
                      {Object.entries(product.specifications).map(([key, val], idx) => (
                        <div
                          key={key}
                          className={`flex flex-col sm:flex-row sm:justify-between px-4 py-2.5 text-xs sm:text-sm ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                          } border-b border-slate-100 last:border-0`}
                        >
                          <span className="font-semibold text-slate-500">{key}</span>
                          <span className="font-bold text-[#14263D] mt-0.5 sm:mt-0">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <a
                  href={getWhatsAppEnquiryUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-md transition-colors text-center"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Enquire Price & Availability on WhatsApp</span>
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#14263D] hover:bg-[#0B1728] text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-md transition-colors text-center"
                >
                  <Phone className="w-5 h-5 text-[#D7A94B]" />
                  <span>Call Store (+91 98429 28278)</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#14263D] mb-6">
              Related Building Materials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
