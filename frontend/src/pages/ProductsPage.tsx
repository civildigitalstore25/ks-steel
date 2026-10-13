import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, X, RefreshCw } from 'lucide-react';
import type { Product } from '../types';
import { PRODUCT_CATEGORIES } from '../data/products';
import { fetchPublicProducts } from '../services/api';
import { CategorySidebar } from '../components/CategorySidebar';
import { ProductSearchToolbar } from '../components/ProductSearchToolbar';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state when URL params change
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedBrand(searchParams.get('brand') || 'all');
  }, [searchParams]);

  // Load all products for category counts
  const loadAllProducts = async () => {
    try {
      const data = await fetchPublicProducts();
      setAllProducts(data);
    } catch (err) {
      console.warn('Failed to load products from mock store:', err);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  // Load filtered products
  const loadFilteredProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchPublicProducts({
        search: searchQuery,
        category: selectedCategory,
        brand: selectedBrand
      });
      setLiveProducts(data);
    } catch (err) {
      console.warn('Mock store query error:', err);
      setLiveProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilteredProducts();
  }, [searchQuery, selectedCategory, selectedBrand]);

  // Listen for mock data updates (e.g. admin add/edit/delete or re-seed)
  useEffect(() => {
    const handleUpdate = () => {
      loadAllProducts();
      loadFilteredProducts();
    };
    window.addEventListener('ks_products_updated', handleUpdate);
    return () => {
      window.removeEventListener('ks_products_updated', handleUpdate);
    };
  }, [searchQuery, selectedCategory, selectedBrand]);

  // Extract all unique brands available in the database
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    allProducts.forEach((p) => {
      if (p.brand && p.brand !== 'Unspecified') brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [allProducts]);

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
    <div className="font-sans bg-[#F5F6F8] min-h-screen pb-12">
      <section className="bg-[#14263D] text-white pt-8 pb-16 sm:pt-10 sm:pb-20 relative overflow-hidden">
        <div className="bg-[#1D3350]/50 rounded-full w-[420px] h-[420px] absolute -right-28 -top-36 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D7A94B]/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#D7A94B] font-extrabold text-[11px] uppercase tracking-[0.18em]">
            Product catalogue
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-tight tracking-tight">
            Our Products
          </h1>
          <p className="text-slate-300 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
            Steel, cement, pipes, paints, tools, and roofing from our Pasupathi Kovil store. Ask for current availability and price.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <ProductSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchInput}
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandSelect}
          availableBrands={availableBrands}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="lg:hidden -mx-4 px-4 mb-5 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#14263D] text-[#D7A94B]'
                : 'bg-white text-[#202A36] border border-slate-200'
            }`}
          >
            All ({allProducts.length})
          </button>
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="hidden lg:block lg:col-span-3">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              products={allProducts}
            />
          </div>

          <div className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#14263D] leading-tight">
                  {activeTitle}
                </h2>
                <p className="text-[#667085] text-sm mt-1 leading-relaxed max-w-2xl">
                  {activeDesc}
                </p>
              </div>
              <div className="bg-white border border-[#E2E6EC] text-[#14263D] text-xs font-extrabold px-3 py-1.5 rounded-full self-start sm:self-auto shrink-0 flex items-center gap-1.5 shadow-sm">
                {loading && <RefreshCw className="w-3 h-3 animate-spin text-[#D7A94B]" />}
                <span>{liveProducts.length} products</span>
              </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="py-16 text-center text-slate-500 font-semibold text-sm">
                Fetching catalogue items from database...
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
