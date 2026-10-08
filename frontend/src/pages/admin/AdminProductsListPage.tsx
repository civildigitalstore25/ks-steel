import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  X,
  Package
} from 'lucide-react';
import type { Product } from '../../types';
import { fetchAdminProducts, deleteAdminProduct } from '../../services/api';
import { PRODUCT_CATEGORIES, PRODUCTS as FALLBACK_PRODUCTS } from '../../data/products';

export const AdminProductsListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts({ search, category: selectedCategory });
      setProducts(data);
    } catch (err) {
      console.warn('Fallback to local products list:', err);
      let list = FALLBACK_PRODUCTS as Product[];
      if (selectedCategory !== 'all') {
        list = list.filter((p) => p.categoryId === selectedCategory || p.category === selectedCategory);
      }
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            p.category.toLowerCase().includes(q)
        );
      }
      setProducts(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, selectedCategory]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteAdminProduct(id);
      setProducts(products.filter((p) => p.id !== id && (p as any)._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14263D]">
            All Products Catalogue
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage public visibility, update product descriptions, or add new items.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold text-sm py-2.5 px-5 rounded-xl shadow transition-all transform active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name, brand, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Selector */}
        <div className="md:col-span-5 flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-200">
                <th className="py-3.5 px-6">Product Image & Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    Fetching products catalogue...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Package className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-600">No matching products found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search or category filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const pid = (p as any)._id || p.id;
                  const isActive = p.isActive !== false;
                  return (
                    <tr key={pid} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || '/images/pipes.jpg'}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <span className="font-extrabold text-[#14263D] block">{p.name}</span>
                            <span className="text-xs text-slate-400 font-mono">id: {pid}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                        {p.brand || 'Unspecified'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        <Link
                          to={`/admin/products/edit/${pid}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#14263D] bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-lg transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(pid)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg transition-colors border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
