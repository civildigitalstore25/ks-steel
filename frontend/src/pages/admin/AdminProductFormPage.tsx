import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { 
  fetchAdminProductById, 
  createAdminProduct, 
  updateAdminProduct, 
  uploadProductImage 
} from '../../services/api';

const CATEGORY_OPTIONS = [
  "Plumbing Pipes and Fittings",
  "Borewell Pipes",
  "Water Tanks",
  "Bathroom and Plumbing Taps",
  "Cement",
  "Steel and Reinforcement Materials",
  "Other Building Materials"
];

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: CATEGORY_OPTIONS[0],
    shortDescription: '',
    description: '',
    image: '/images/pipes.jpg',
    isActive: true,
    isPopular: false,
    isPlaceholder: false,
    verificationNote: ''
  });

  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([
    { key: 'Material', value: '' },
    { key: 'Available Sizes', value: '' }
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('/images/pipes.jpg');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch product if editing
  useEffect(() => {
    if (!id) return;
    async function loadProduct() {
      try {
        const prod = await fetchAdminProductById(id!);
        setFormData({
          name: prod.name || '',
          brand: prod.brand || '',
          category: prod.category || CATEGORY_OPTIONS[0],
          shortDescription: prod.shortDescription || '',
          description: prod.fullDescription || prod.shortDescription || '',
          image: prod.image || '/images/pipes.jpg',
          isActive: prod.isActive !== false,
          isPopular: Boolean(prod.isPopular),
          isPlaceholder: Boolean(prod.isPlaceholder),
          verificationNote: prod.verificationNote || ''
        });
        setImagePreview(prod.image || '/images/pipes.jpg');

        if (prod.specifications) {
          const specsArr = Object.entries(prod.specifications).map(([key, value]) => ({
            key,
            value: String(value)
          }));
          if (specsArr.length > 0) setSpecifications(specsArr);
        }
      } catch (err: any) {
        setError('Failed to load product details for editing.');
      } finally {
        setFetching(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const addSpecRow = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Product Name is required.');
      return;
    }

    if (!formData.category.trim()) {
      setError('Category is required.');
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = formData.image;

      // Upload file if selected
      if (imageFile) {
        try {
          finalImageUrl = await uploadProductImage(imageFile);
        } catch (uploadErr) {
          console.warn('Image upload failed, using provided URL/fallback:', uploadErr);
        }
      }

      // Convert specs array to object
      const specsObj: Record<string, string> = {};
      specifications.forEach((s) => {
        if (s.key.trim() && s.value.trim()) {
          specsObj[s.key.trim()] = s.value.trim();
        }
      });

      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || 'Unspecified',
        category: formData.category,
        shortDescription: formData.shortDescription.trim() || formData.description.slice(0, 120),
        description: formData.description.trim() || formData.name,
        image: finalImageUrl,
        specifications: specsObj,
        isActive: formData.isActive,
        isPopular: formData.isPopular,
        isPlaceholder: formData.isPlaceholder,
        verificationNote: formData.verificationNote.trim() || undefined
      };

      if (isEditMode && id) {
        await updateAdminProduct(id, payload);
        setSuccess('Product updated successfully!');
      } else {
        await createAdminProduct(payload);
        setSuccess('Product created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm font-semibold">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      
      {/* Back Link */}
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#14263D] font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D7A94B]" />
          <span>Back to Products List</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#14263D]">
            {isEditMode ? 'Edit Product Entry' : 'Create New Product'}
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Fill in product specifications, image URL or file upload, and catalogue details.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Product Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D] border-b border-slate-100 pb-2">
            1. Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Astral CPVC Pro Pipe"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] font-medium focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                Brand (Optional)
              </label>
              <input
                type="text"
                name="brand"
                placeholder="e.g. Astral, Ashirvad, Vectus, UltraTech"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                Verification Note (Optional)
              </label>
              <input
                type="text"
                name="verificationNote"
                placeholder="e.g. Brand spelling & model to be confirmed"
                value={formData.verificationNote}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D] border-b border-slate-100 pb-2">
            2. Product Descriptions
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
              Short Description (Card Summary)
            </label>
            <input
              type="text"
              name="shortDescription"
              placeholder="Brief 1-2 sentence overview for catalogue cards"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
              Full Product Description *
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Detailed description of applications, temperature ratings, standards, etc."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
            />
          </div>
        </div>

        {/* Image Management */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D] border-b border-slate-100 pb-2">
            3. Product Image
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                  Image File Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#14263D] file:text-white hover:file:bg-[#0B1728] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                  OR Image URL Path
                </label>
                <input
                  type="text"
                  name="image"
                  placeholder="/images/pipes.jpg or http://..."
                  value={formData.image}
                  onChange={(e) => {
                    handleInputChange(e);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-2">Image Preview</span>
              <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={imagePreview || '/images/pipes.jpg'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D]">
              4. Key Specifications (Optional)
            </h3>
            <button
              type="button"
              onClick={addSpecRow}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#14263D] hover:text-[#D7A94B]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specification</span>
            </button>
          </div>

          <div className="space-y-2">
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Feature (e.g. Material)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-[#14263D]"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Heavy Duty uPVC)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#14263D]"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  className="p-2 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Options */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-[#14263D]">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#D7A94B] rounded focus:ring-[#D7A94B]"
              />
              <span>Publicly Active (Visible on Products page)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-[#14263D]">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#D7A94B] rounded focus:ring-[#D7A94B]"
              />
              <span>Feature on Homepage Popular Supplies</span>
            </label>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-extrabold text-sm py-3 px-7 rounded-xl shadow transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
