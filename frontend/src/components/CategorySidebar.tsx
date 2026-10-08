import React from 'react';
import { Grid, MessageSquare } from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCTS, getWhatsAppEnquiryUrl } from '../data/products';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {

  // Calculate dynamic product counts for each category based on actual data
  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return PRODUCTS.length;
    const catObj = PRODUCT_CATEGORIES.find(c => c.slug === slug || c.id === slug);
    if (!catObj) return 0;
    return PRODUCTS.filter(p => p.categoryId === catObj.id).length;
  };

  const categoriesList = [
    { id: 'all', slug: 'all', name: 'All Products' },
    ...PRODUCT_CATEGORIES,
  ];

  return (
    <aside className="w-full space-y-6 font-sans">
      
      {/* Category Sidebar Container */}
      <div className="bg-white rounded-xl border border-[#E2E6EC] shadow-sm overflow-hidden">
        
        {/* Sidebar Header */}
        <div className="bg-[#14263D] text-white px-5 py-4 flex items-center justify-between">
          <h2 className="font-extrabold text-sm uppercase tracking-wider">
            BROWSE BY CATEGORY
          </h2>
          <Grid className="w-4 h-4 text-[#D7A94B]" />
        </div>

        {/* Category Items List */}
        <div className="divide-y divide-slate-100">
          {categoriesList.map((cat) => {
            const isSelected =
              selectedCategory === cat.slug ||
              (selectedCategory === 'all' && cat.slug === 'all');
            const count = getCategoryCount(cat.slug);

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left px-5 py-3.5 flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-50/70 border-l-4 border-[#D7A94B] font-bold text-[#14263D] pl-4'
                    : 'bg-white hover:bg-slate-50 text-[#202A36] font-medium border-l-4 border-transparent'
                }`}
              >
                <span className="text-sm">{cat.name}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#D7A94B] text-[#0B1728]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Bottom Enquiry Card */}
      <div className="bg-[#F5F6F8] p-5 rounded-xl border border-[#E2E6EC] text-left space-y-3">
        <h3 className="font-extrabold text-sm text-[#14263D]">
          Can't find a product?
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed">
          Send us your requirement and we'll help confirm availability at our store.
        </p>
        <a
          href={getWhatsAppEnquiryUrl("custom requirement")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:underline pt-1"
        >
          <MessageSquare className="w-4 h-4 fill-current text-[#25D366]" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>

    </aside>
  );
};
