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
import { BRAND_LOGOS } from '../../data/products';
import { RichTextEditor } from '../../components/RichTextEditor';
import { plainTextFromHtml } from '../../components/RichText';

const CATEGORY_OPTIONS = [
  "Steel",
  "Cement",
  "MS Pipe",
  "Paint",
  "Power Tools",
  "Roofing Sheets",
  "Motor Pumps",
  "Bathware and Fittings",
  "Electrical",
  "Hardware",
  "AAC Blocks",
  "Kadappa Stone",
  "Fencing"
];

const CATEGORY_BRAND_OPTIONS: Record<string, string[]> = {
  "Steel": ["Amman Try Steel", "Viki TMT"],
  "Cement": ["UltraTech Cement", "UltraTech Building Solutions"],
  "MS Pipe": ["Square Pipes", "Round Pipes", "Flat Sections", "L-Angles", "Unbranded / Generic"],
  "Paint": ["Birla Opus", "Asian Paints", "I Max Paint"],
  "Power Tools": ["Bosch", "Makita", "Ferm", "Caltex"],
  "Roofing Sheets": ["Everest", "Tata", "JSW"],
  "Motor Pumps": ["CG", "V-Guard", "Laxmi"],
  "Bathware and Fittings": ["Neycer", "Johnson Pedder", "Parryware"],
  "Electrical": ["Fybros", "Kundan", "HiFi", "Eveready", "Sturlite"],
  "Hardware": ["Unbranded / Generic"],
  "AAC Blocks": ["Cubecrete"],
  "Kadappa Stone": ["Unbranded / Generic"],
  "Fencing": ["Tata", "Other manufacturers"]
};

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORY_OPTIONS[0],
    brand: 'Unbranded / Generic',
    brandLogo: '',
    shortDescription: '',
    description: '',
    image: '/images/products/steel-tmt-bars.jpg',
    imageAlt: '',
    isActive: true,
    isPopular: false,
    isPlaceholder: false,
    verificationNote: ''
  });

  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('');

  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([
    { key: 'Material', value: '' },
    { key: 'Availability', value: 'In Store - Pasupathi Kovil' }
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('/images/products/steel-tmt-bars.jpg');
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
        const cat = prod.category || CATEGORY_OPTIONS[0];
        const knownBrands = CATEGORY_BRAND_OPTIONS[cat] || [];
        const isGeneric = !prod.brand || prod.brand === 'Unspecified' || prod.brand === 'Unbranded / Generic';
        const isKnown = knownBrands.includes(prod.brand || '');

        setFormData({
          name: prod.name || '',
          category: cat,
          brand: isGeneric ? 'Unbranded / Generic' : (prod.brand || 'Unbranded / Generic'),
          brandLogo: prod.brandLogo || (prod.brand ? BRAND_LOGOS[prod.brand] : '') || '',
          shortDescription: prod.shortDescription || '',
          description: prod.fullDescription || prod.description || prod.shortDescription || '',
          image: prod.image || '/images/products/steel-tmt-bars.jpg',
          imageAlt: prod.imageAlt || '',
          isActive: prod.isActive !== false,
          isPopular: Boolean(prod.isPopular),
          isPlaceholder: Boolean(prod.isPlaceholder),
          verificationNote: prod.verificationNote || ''
        });

        if (!isGeneric && !isKnown) {
          setIsCustomBrand(true);
          setCustomBrandName(prod.brand || '');
        }

        setImagePreview(prod.image || '/images/products/steel-tmt-bars.jpg');

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

  // When category changes, update suggested brands
  const handleCategoryChange = (newCategory: string) => {
    const brandOptions = CATEGORY_BRAND_OPTIONS[newCategory] || ["Unbranded / Generic"];
    const defaultBrand = brandOptions[0] || "Unbranded / Generic";
    setFormData(prev => ({
      ...prev,
      category: newCategory,
      brand: defaultBrand,
      brandLogo: BRAND_LOGOS[defaultBrand] || ''
    }));
    setIsCustomBrand(false);
    setCustomBrandName('');
  };

  const handleBrandSelectChange = (val: string) => {
    if (val === '__custom__') {
      setIsCustomBrand(true);
      setFormData(prev => ({ ...prev, brand: customBrandName || 'Custom Brand', brandLogo: '' }));
    } else {
      setIsCustomBrand(false);
      setFormData(prev => ({
        ...prev,
        brand: val,
        brandLogo: BRAND_LOGOS[val] || prev.brandLogo || ''
      }));
    }
  };

  const handleCustomBrandNameChange = (val: string) => {
    setCustomBrandName(val);
    setFormData(prev => ({
      ...prev,
      brand: val.trim() || 'Custom Brand'
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const descriptionText = plainTextFromHtml(formData.description);
    if (descriptionText.length < 20) {
      setError('Add a fuller product description in the editor.');
      return;
    }
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const isActive = submitter?.value === 'draft'
      ? false
      : submitter?.value === 'published'
        ? true
        : formData.isActive;

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

      const effectiveBrand = isCustomBrand
        ? (customBrandName.trim() || 'Unbranded / Generic')
        : formData.brand;

      const payload = {
        name: formData.name.trim(),
        brand: effectiveBrand,
        brandLogo: formData.brandLogo.trim() || (BRAND_LOGOS[effectiveBrand] || undefined),
        category: formData.category,
        shortDescription: formData.shortDescription.trim() || descriptionText.slice(0, 160),
        description: formData.description.trim() || formData.name,
        image: finalImageUrl,
        imageAlt: formData.imageAlt.trim() || `${formData.name} product photograph`,
        specifications: specsObj,
        isActive,
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
        Loading product details from database...
      </div>
    );
  }

  const currentCategoryBrands = CATEGORY_BRAND_OPTIONS[formData.category] || ["Unbranded / Generic"];
  const currentLogo = formData.brandLogo || BRAND_LOGOS[formData.brand];

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
            Manage product catalogue information across all 13 official categories with authentic brand logos.
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
            1. Basic Information & Categorisation
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
                placeholder="e.g. Amman Try Fe 550D TMT Rebars"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                Category (13 Categories) *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
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
                Brand Selection ({formData.category})
              </label>
              <select
                value={isCustomBrand ? '__custom__' : formData.brand}
                onChange={(e) => handleBrandSelectChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] font-medium focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
              >
                <option value="Unbranded / Generic">Unbranded / Not specified</option>
                {currentCategoryBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="__custom__">+ Enter Custom / Unlisted Brand</option>
              </select>
            </div>

            {isCustomBrand ? (
              <div>
                <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                  Custom Brand Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter supplier or manufacturer name"
                  value={customBrandName}
                  onChange={(e) => handleCustomBrandNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                  Brand Logo Reference / URL
                </label>
                <input
                  type="text"
                  name="brandLogo"
                  placeholder="e.g. /images/logos/amman-try.svg"
                  value={formData.brandLogo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
              </div>
            )}
          </div>

          {/* Brand Logo Visual Preview */}
          {currentLogo && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand Logo:</span>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 inline-flex items-center">
                <img
                  src={currentLogo}
                  alt="Brand Logo Preview"
                  className="h-6 max-w-[120px] object-contain"
                />
              </div>
              <span className="text-xs text-slate-500">{formData.brand} verified logo</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
              Verification Note (Optional)
            </label>
            <input
              type="text"
              name="verificationNote"
              placeholder="e.g. Verified official supplier / Brand model to be confirmed"
              value={formData.verificationNote}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
            />
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
            <RichTextEditor
              value={formData.description}
              onChange={(html) => setFormData((current) => ({ ...current, description: html }))}
              placeholder="Describe the material, where it is used, and what the customer should check."
            />
          </div>
        </div>

        {/* Image Management */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D] border-b border-slate-100 pb-2">
            3. Product Image & Accessibility
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
                  placeholder="/images/products/steel-tmt-bars.jpg"
                  value={formData.image}
                  onChange={(e) => {
                    handleInputChange(e);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  placeholder="e.g. Amman Try Fe 550D TMT reinforcement rebars bundle"
                  value={formData.imageAlt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-2">Image Preview</span>
              <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={imagePreview || '/images/products/steel-tmt-bars.jpg'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D]">
              4. Product Specifications
            </h3>
            <button
              type="button"
              onClick={addSpecRow}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#14263D] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>

          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Field (e.g. Grade, Size, Packaging)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Fe 550D, 50kg Bag)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(index)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove Specification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Options */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#14263D]">
            5. Visibility & Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">Visibility</label>
              <select
                value={formData.isActive ? 'published' : 'draft'}
                onChange={(e) => setFormData((current) => ({ ...current, isActive: e.target.value === 'published' }))}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-[#14263D] font-semibold focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
              >
                <option value="draft">Draft — hidden from the website</option>
                <option value="published">Published — visible in the catalogue</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#14263D] rounded border-slate-300 focus:ring-[#D7A94B]"
              />
              <div>
                <span className="font-bold text-xs text-[#14263D] block">Featured on Home Page</span>
                <span className="text-[11px] text-slate-500">Display this product in popular building materials</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            value="draft"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            type="submit"
            value="published"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-extrabold text-sm py-2.5 px-6 rounded-xl shadow transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEditMode ? 'Publish update' : 'Publish product'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
