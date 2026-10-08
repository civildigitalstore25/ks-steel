import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, X, RefreshCw } from 'lucide-react';
import type { Product } from '../types';
import { PRODUCT_CATEGORIES, PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';
import { fetchPublicProducts } from '../services/api';
import { CategorySidebar } from '../components/CategorySidebar';
import { ProductSearchToolbar } from '../components/ProductSearchToolbar';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');

  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state when URL params change
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedBrand(searchParams.get('brand') || 'all');
  }, [searchParams]);

  // Fetch products live from backend with fallback
  useEffect(() => {
    let isMounted = true;
    async function loadBackendProducts() {
      setLoading(true);
      try {
        const data = await fetchPublicProducts({
          search: searchQuery,
          category: selectedCategory,
          brand: selectedBrand
        });
        if (isMounted) {
          setLiveProducts(data);
        }
      } catch (err) {
        console.warn('Backend API unreachable, using static catalogue fallback:', err);
        if (isMounted) {
          // Filter fallback static products
          let list = FALLBACK_PRODUCTS as Product[];
          if (selectedCategory !== 'all') {
            const cat = PRODUCT_CATEGORIES.find(c => c.slug === selectedCategory || c.id === selectedCategory);
            if (cat) list = list.filter(p => p.categoryId === cat.id);
          }
          if (selectedBrand !== 'all') {
            list = list.filter(p => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
          }
          if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
              p =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                p.shortDescription.toLowerCase().includes(q)
            );
          }
          setLiveProducts(list);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBackendProducts();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, selectedBrand]);

  // Extract all unique brands available
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    FALLBACK_PRODUCTS.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    liveProducts.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [liveProducts]);

  const updateFilters = (cat: string, brand: string, search: string) => {
    const params: Record<string, string> = {};
    if (cat !== 'all') params.category = cat;
    if (brand !== 'all') params.brand = brand;
    if (search.trim() !== '') params.search = search;
    setSearchParams(params);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    updateFilters(slug, selectedBrand, searchQuery);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    updateFilters(selectedCategory, brand, searchQuery);
  };

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    updateFilters(selectedCategory, selectedBrand, query);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchParams({});
  };

  const activeCategoryObj = PRODUCT_CATEGORIES.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory
  );
  const activeTitle = activeCategoryObj ? activeCategoryObj.name : 'All Products';
  const activeDesc = activeCategoryObj
    ? activeCategoryObj.description
    : 'Browse every confirmed product currently represented in our catalogue. Contact the shop for current availability.';

  return (
    <div className="font-sans bg-[#F5F6F8] min-h-screen pb-16">
      
      {/* 4. DARK NAVY HERO SECTION */}
      <section className="bg-[#14263D] text-white py-14 md:py-20 relative overflow-hidden">
        <div className="bg-[#1D3350]/40 rounded-full w-[450px] h-[450px] absolute -right-24 -top-32 pointer-events-none" />
        <div className="bg-[#1D3350]/20 rounded-full w-[300px] h-[300px] absolute right-40 -bottom-20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-[#D7A94B] font-extrabold text-xs uppercase tracking-widest">
            OUR PRODUCT CATALOGUE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 leading-tight">
            Our Products
          </h1>
          <p className="text-slate-300 mt-3 text-base sm:text-lg max-w-2xl leading-relaxed">
            Explore our range of plumbing and construction materials.
          </p>
        </div>
      </section>

      {/* 5. SEARCH & BRAND FILTER TOOLBAR CONTAINER */}
      <div className="bg-white border-b border-[#E2E6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ProductSearchToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchInput}
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandSelect}
            availableBrands={availableBrands}
          />
        </div>
      </div>

      {/* 6. MAIN CATALOGUE LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Mobile Category Chips */}
        <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#14263D] text-[#D7A94B]'
                : 'bg-white text-[#202A36] border border-slate-200'
            }`}
          >
            All Products ({liveProducts.length})
          </button>
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  active
                    ? 'bg-[#14263D] text-[#D7A94B]'
                    : 'bg-white text-[#202A36] border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Category Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-9">
            
            {/* Heading Banner */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E6EC] shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[#D7A94B] font-extrabold text-[11px] uppercase tracking-widest">
                    COMPLETE CATALOGUE
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#14263D] mt-0.5">
                    {activeTitle}
                  </h2>
                </div>
                <div className="bg-[#14263D] text-[#D7A94B] text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-center shrink-0 flex items-center gap-1.5">
                  {loading && <RefreshCw className="w-3 h-3 animate-spin text-[#D7A94B]" />}
                  <span>{liveProducts.length} PRODUCTS</span>
                </div>
              </div>

              <p className="text-[#667085] text-sm mt-3 leading-relaxed">
                {activeDesc}
              </p>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="py-16 text-center text-slate-500 font-semibold text-sm">
                Fetching catalogue items...
              </div>
            ) : liveProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {liveProducts.map((product) => (
                  <ProductCard key={product.id || (product as any)._id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E6EC] shadow-sm my-4">
                <div className="w-16 h-16 bg-amber-50 text-[#D7A94B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#14263D]">No products found</h3>
                <p className="text-[#667085] text-sm mt-2 max-w-md mx-auto">
                  Try another search or select a different category to view available building materials.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 inline-flex items-center gap-2 bg-[#14263D] text-white font-bold text-sm py-2.5 px-6 rounded-xl hover:bg-[#0B1728] transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
