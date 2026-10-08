import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Edit, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import type { Product } from '../../types';
import { fetchAdminProducts, deleteAdminProduct } from '../../services/api';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../../data/products';

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.warn('Backend offline or error, falling back to local dataset:', err);
      setProducts(FALLBACK_PRODUCTS as Product[]);
      setError('Using local cached product data. Ensure backend server is connected to MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteAdminProduct(id);
      setProducts(products.filter((p) => p.id !== id && (p as any)._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive !== false).length;
  const inactiveCount = products.filter((p) => p.isActive === false).length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#D7A94B] font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D7A94B]" />
            <span>K.S. STEEL CORPORATION ADMIN</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14263D] mt-1">
            Product Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-[#14263D] shadow-sm transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold text-sm py-2.5 px-5 rounded-xl shadow transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          {error}
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Products</span>
            <h2 className="text-3xl font-extrabold text-[#14263D] mt-1">{totalCount}</h2>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-[#D7A94B] rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Public Items</span>
            <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">{activeCount}</h2>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Draft / Inactive</span>
            <h2 className="text-3xl font-extrabold text-slate-500 mt-1">{inactiveCount}</h2>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Product Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-[#14263D]">
              Product Catalogue Listing
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Create, edit, toggle active status, or delete catalogue items.
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-[#14263D] hover:text-[#D7A94B] flex items-center gap-1"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-200">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    No products found. Click "Add New Product" to create your first entry.
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
                            <span className="text-xs text-slate-400 font-mono">slug: {p.slug || p.id}</span>
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
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
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
