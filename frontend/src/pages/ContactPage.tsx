import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { BUSINESS_INFO, PRODUCT_CATEGORIES, getWhatsAppEnquiryUrl } from '../data/products';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: PRODUCT_CATEGORIES[0].name,
    requirement: '',
    quantity: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (formStatus !== 'idle') setFormStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormStatus('error');
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormStatus('error');
      setErrorMessage('Please enter your phone number.');
      return;
    }

    // Compose formatted enquiry message for WhatsApp trigger or confirmation
    const messageText = `Hello K.S. Steel Corporation,

Enquiry Details:
• Name: ${formData.name}
• Phone: ${formData.phone}
• Category: ${formData.category}
• Requirement: ${formData.requirement || 'General Enquiry'}
• Quantity: ${formData.quantity || 'Not specified'}
• Message: ${formData.message || 'None'}

Please share pricing and stock availability.`;

    const waUrl = `https://wa.me/919842928278?text=${encodeURIComponent(messageText)}`;
    
    // Open WhatsApp with prefilled message
    window.open(waUrl, '_blank');
    setFormStatus('submitted');
  };

  return (
    <div className="font-sans bg-[#F5F6F8] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div>
          <span className="text-[#D7A94B] font-bold text-xs uppercase tracking-widest">
            GET IN TOUCH WITH US
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14263D] mt-1">
            Contact K.S. Steel Corporation
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base">
            Have a question about pipe dimensions, tank sizes, cement availability, or TMT steel prices? Call or send us an enquiry directly.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Phone */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-amber-50 text-[#D7A94B] rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#14263D]">Call Us Directly</h3>
              <p className="text-slate-600 text-sm mt-1">Speak directly with our store team for instant product pricing.</p>
              <p className="font-extrabold text-lg text-[#14263D] mt-4">{BUSINESS_INFO.phone}</p>
            </div>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#14263D] hover:bg-[#0B1728] text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm"
            >
              <Phone className="w-4 h-4 text-[#D7A94B]" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-[#25D366] rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#14263D]">WhatsApp Enquiry</h3>
              <p className="text-slate-600 text-sm mt-1">Send product photos or item lists for quick estimates.</p>
              <p className="font-extrabold text-lg text-[#25D366] mt-4">+91 98429 28278</p>
            </div>
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Enquiry</span>
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-amber-50 text-[#D7A94B] rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#14263D]">Store Address</h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                {BUSINESS_INFO.address}
              </p>
            </div>
            <a
              href={BUSINESS_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-[#14263D] hover:text-white text-[#14263D] font-bold py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              <Navigation className="w-4 h-4 text-[#D7A94B]" />
              <span>Get Directions</span>
            </a>
          </div>

        </div>

        {/* Contact Form & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-[#14263D] mb-2">
              Send a Product Requirement Enquiry
            </h2>
            <p className="text-slate-600 text-sm mb-6">
              Fill out the form below to receive pricing details. Your requirement will open directly in WhatsApp for instant assistance.
            </p>

            {formStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {formStatus === 'submitted' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#25D366]" />
                <span>Enquiry prepared! Opening WhatsApp with your details.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98429 28278"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                    Product Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                    Estimated Quantity (Optional)
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    placeholder="e.g. 50 bags, 20 pipes, 2 tanks"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                  Specific Product Requirement
                </label>
                <input
                  type="text"
                  name="requirement"
                  placeholder="e.g. Astral 1 inch CPVC pipe or UltraTech cement"
                  value={formData.requirement}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider mb-1.5">
                  Additional Message / Project Details
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Mention site location, delivery timing, or any specific questions..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#14263D] focus:outline-none focus:ring-2 focus:ring-[#D7A94B]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-bold text-base py-3.5 px-6 rounded-lg shadow-md transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Submit Enquiry via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg text-[#14263D] mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D7A94B]" />
                <span>Google Maps Location</span>
              </h3>
              <div className="rounded-xl overflow-hidden h-96 border border-slate-200">
                <iframe
                  title="Store Location Map"
                  src={BUSINESS_INFO.googleMapsEmbedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
