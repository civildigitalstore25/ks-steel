import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Truck, 
  ChevronRight
} from 'lucide-react';
import { 
  BUSINESS_INFO, 
  PRODUCT_CATEGORIES, 
  PRODUCTS, 
  getWhatsAppEnquiryUrl 
} from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const featuredProducts = PRODUCTS.filter(p => p.isPopular).slice(0, 6);

  return (
    <div className="font-sans bg-[#F5F6F8]">
      
      {/* 4. HOMEPAGE HERO SECTION */}
      <section className="relative min-h-[620px] md:min-h-[680px] flex items-center bg-[#0B1728] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Plumbing pipes and building materials warehouse"
            className="w-full h-full object-cover object-right md:object-center opacity-85 scale-105"
          />
          {/* Dark Navy Gradient Overlay matching Figma design */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1728] via-[#0B1728]/95 to-[#0B1728]/35 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1728] via-transparent to-transparent opacity-80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-[#D7A94B]/20 border border-[#D7A94B]/40 text-[#D7A94B] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#D7A94B] animate-pulse" />
              <span>BUILDING MATERIALS IN PASUPATHIKOIL</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              Quality Building Materials for Every Construction Need
            </h1>

            {/* Supporting Paragraph */}
            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-xl">
              Explore plumbing pipes, water tanks, taps, cement, steel and essential materials for your next project—all from one trusted local shop.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2.5 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold text-base px-7 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 text-center"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href={getWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-base px-7 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 text-center"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>

            {/* Location Text */}
            <div className="mt-8 flex items-center gap-2 text-slate-300 text-sm font-medium">
              <MapPin className="w-4 h-4 text-[#D7A94B] shrink-0" />
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D7A94B] hover:underline transition-colors flex items-center gap-1"
              >
                <span>Conveniently located in Ayyampettai, Pasupathikoil</span>
                <ChevronRight className="w-4 h-4 text-[#D7A94B]" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* VERIFIED BRANDS STRIP */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Authorized Local Supplier for Leading Construction Brands
          </p>
          <div className="flex flex-wrap items-center justify-around gap-6 md:gap-10 opacity-90">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg sm:text-xl tracking-tight">
              <ShieldCheck className="w-6 h-6 text-[#14263D]" />
              <span>ASTRAL PIPES</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg sm:text-xl tracking-tight">
              <ShieldCheck className="w-6 h-6 text-[#14263D]" />
              <span>ASHIRVAD</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg sm:text-xl tracking-tight">
              <ShieldCheck className="w-6 h-6 text-[#14263D]" />
              <span>VECTUS TANKS</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg sm:text-xl tracking-tight">
              <ShieldCheck className="w-6 h-6 text-[#14263D]" />
              <span>ULTRATECH CEMENT</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg sm:text-xl tracking-tight">
              <ShieldCheck className="w-6 h-6 text-[#14263D]" />
              <span>AMMAN TMT STEEL</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SHOWCASE GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#D7A94B] font-bold text-xs uppercase tracking-widest">
              OUR CATALOGUE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14263D] mt-1">
              Building Material Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#14263D] hover:text-[#D7A94B] font-bold text-sm transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/80 overflow-hidden group flex flex-col"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1728]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-xs font-bold text-[#D7A94B] uppercase tracking-wider">
                    {cat.featuredBrands.join(" • ")}
                  </span>
                  <h3 className="text-lg font-bold drop-shadow-sm">{cat.name}</h3>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center text-xs font-bold text-[#14263D] group-hover:text-[#D7A94B] transition-colors gap-1">
                  <span>Browse Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE K.S. STEEL CORP */}
      <section className="bg-[#14263D] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#D7A94B] font-bold text-xs uppercase tracking-widest">
              LOCAL TRUST & QUALITY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-2">
              Why Builders & Homeowners Trust K.S. Steel Corporation
            </h2>
            <p className="text-slate-300 mt-3 text-sm sm:text-base">
              Serving Pasupathikoil and surrounding regions with verified construction materials and direct pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#0B1728] p-6 rounded-xl border border-slate-700/60 flex flex-col items-start">
              <div className="w-12 h-12 bg-[#D7A94B]/20 text-[#D7A94B] rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">100% Genuine Brands</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Direct authorized sourcing for Astral, Ashirvad, Vectus, UltraTech, and Amman Steel.
              </p>
            </div>

            <div className="bg-[#0B1728] p-6 rounded-xl border border-slate-700/60 flex flex-col items-start">
              <div className="w-12 h-12 bg-[#D7A94B]/20 text-[#D7A94B] rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Direct Store Prices</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Transparent local pricing for retail customers, contractor accounts, and bulk project orders.
              </p>
            </div>

            <div className="bg-[#0B1728] p-6 rounded-xl border border-slate-700/60 flex flex-col items-start">
              <div className="w-12 h-12 bg-[#D7A94B]/20 text-[#D7A94B] rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Prompt Site Delivery</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Fast supply delivery directly to your house construction or agricultural site in Pasupathikoil.
              </p>
            </div>

            <div className="bg-[#0B1728] p-6 rounded-xl border border-slate-700/60 flex flex-col items-start">
              <div className="w-12 h-12 bg-[#D7A94B]/20 text-[#D7A94B] rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Expert Guidance</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Get practical technical assistance on pipe sizing, tank capacities, and structural steel grades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#D7A94B] font-bold text-xs uppercase tracking-widest">
              POPULAR SUPPLIES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14263D] mt-1">
              Featured Building Materials
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#14263D] hover:bg-[#0B1728] text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow transition-colors"
          >
            <span>Explore Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* STORE LOCATION CTA BANNER */}
      <section className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-[#D7A94B] font-bold text-xs uppercase tracking-widest">
              VISIT OUR PASUPATHIKOIL STORE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#14263D] mt-2">
              K.S. Steel Corporation
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              We welcome local home builders, contractors, plumbers, and farmers to visit our store in Ayyampettai, Pasupathikoil. Inspect product samples, check stock availability, and get direct quotes.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D7A94B] shrink-0 mt-0.5" />
                <span className="font-semibold">{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0" />
                <span className="font-semibold">WhatsApp: +91 98429 28278</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#14263D] hover:bg-[#0B1728] text-white font-bold px-6 py-3 rounded-lg shadow transition-colors"
              >
                <MapPin className="w-5 h-5 text-[#D7A94B]" />
                <span>Get Directions on Google Maps</span>
              </a>
              <a
                href={getWhatsAppEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold px-6 py-3 rounded-lg shadow transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-80 lg:h-96 relative bg-slate-100">
            <iframe
              title="K.S. Steel Corporation Store Location"
              src={BUSINESS_INFO.googleMapsEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
