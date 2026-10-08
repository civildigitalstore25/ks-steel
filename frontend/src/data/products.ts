import type { Product, ProductCategory } from '../types';

export const BUSINESS_INFO = {
  name: "K.S. Steel Corporation",
  tagline: "Quality Building Materials for Every Construction Need",
  address: "Ayyampettai, Pasupathikoil, Tamil Nadu 614206, India",
  locationShort: "Ayyampettai, Pasupathikoil, Tamil Nadu",
  phone: "+91 98429 28278",
  phoneRaw: "919842928278",
  whatsappUrl: "https://wa.me/919842928278",
  mapsUrl: "https://maps.app.goo.gl/wGHRtXa9SZ2t1KVa6",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.423165243163!2d79.2335!3d10.8548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a554a9d70000001%3A0x1!2sPasupathikoil%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "plumbing-pipes",
    name: "Plumbing Pipes and Fittings",
    slug: "plumbing-pipes",
    description: "Plumbing pipe options, uPVC/CPVC systems and connectors for residential and building requirements.",
    image: "/images/pipes.jpg",
    iconName: "Pipette",
    featuredBrands: ["Astral", "Ashirvad"]
  },
  {
    id: "borewell-pipes",
    name: "Borewell Pipes",
    slug: "borewell-pipes",
    description: "Bore pipes and heavy-duty casing/column options for deep borewell water movement.",
    image: "/images/borewell.jpg",
    iconName: "Drill",
    featuredBrands: ["Unspecified"]
  },
  {
    id: "water-tanks",
    name: "Water Tanks",
    slug: "water-tanks",
    description: "Overhead water storage solutions. Contact the store for confirmed capacities and models.",
    image: "/images/water-tank.jpg",
    iconName: "Container",
    featuredBrands: ["Vectus"]
  },
  {
    id: "bathroom-taps",
    name: "Bathroom and Plumbing Taps",
    slug: "bathroom-taps",
    description: "CP taps and stainless steel tap options for bathroom and household water outlets.",
    image: "/images/taps.jpg",
    iconName: "Droplets",
    featuredBrands: ["CP Taps", "SS Taps"]
  },
  {
    id: "cement",
    name: "Cement",
    slug: "cement",
    description: "Construction cement for house building, foundation footings, and structural masonry.",
    image: "/images/cement.jpg",
    iconName: "Layers",
    featuredBrands: ["UltraTech Cement"]
  },
  {
    id: "steel-reinforcement",
    name: "Steel and Reinforcement Materials",
    slug: "steel-reinforcement",
    description: "Steel rebars and structural reinforcement materials for house construction enquiries.",
    image: "/images/steel.jpg",
    iconName: "Shield",
    featuredBrands: ["Pending verification"]
  },
  {
    id: "other-building-materials",
    name: "Other Building Materials",
    slug: "other-building-materials",
    description: "Expandable category for additional construction supplies confirmed by shop owner.",
    image: "/images/hero.jpg",
    iconName: "Package",
    featuredBrands: ["Expandable"]
  }
];

export const PRODUCTS: Product[] = [
  // 1. Astral Plumbing Pipes
  {
    id: "astral-plumbing-pipes",
    name: "Astral Plumbing Pipes",
    brand: "Astral",
    category: "Plumbing Pipes and Fittings",
    categoryId: "plumbing-pipes",
    image: "/images/pipes.jpg",
    shortDescription: "Plumbing pipe options for residential and construction requirements.",
    fullDescription: "Astral plumbing pipes engineered for hot and cold water supply lines, high thermal tolerance, and leak-proof jointing across residential apartments and commercial installations.",
    specifications: {
      "Brand": "Astral",
      "Material": "CPVC / uPVC",
      "Usage": "Hot & Cold Water Plumbing Systems",
      "Availability": "In Store - pasupathikoil"
    },
    isPopular: true
  },
  // 2. Ashirvad Pipes
  {
    id: "ashirvad-pipes",
    name: "Ashirvad Pipes",
    brand: "Ashirvad",
    category: "Plumbing Pipes and Fittings",
    categoryId: "plumbing-pipes",
    image: "/images/pipes.jpg",
    shortDescription: "Pipe options for household and building plumbing requirements.",
    fullDescription: "Ashirvad uPVC and CPVC piping solutions designed for durable domestic water supply lines with UV protection and lead-free composition.",
    specifications: {
      "Brand": "Ashirvad",
      "Material": "uPVC / CPVC",
      "Usage": "Household & Commercial Plumbing",
      "Availability": "In Store"
    },
    isPopular: true
  },
  // 3. Pipe Fittings and Connectors
  {
    id: "pipe-fittings-connectors",
    name: "Pipe Fittings and Connectors",
    brand: "Unspecified",
    category: "Plumbing Pipes and Fittings",
    categoryId: "plumbing-pipes",
    image: "/images/pipes.jpg",
    shortDescription: "Selected connectors, bends, and fittings for plumbing requirements.",
    fullDescription: "Selected elbows, tees, couplings, adaptors, and solvent cement fittings. Catalogue placeholder subject to specific model confirmation at store.",
    specifications: {
      "Brand": "Unspecified / Multi-Brand",
      "Items": "Bends, Elbows, Reducers, Couplers",
      "Status": "Placeholder / Confirmation Pending"
    },
    isPlaceholder: true,
    verificationNote: "Catalogue placeholder - model availability to be confirmed"
  },
  // 4. Bore Pipes
  {
    id: "bore-pipes",
    name: "Bore Pipes",
    brand: "Unspecified",
    category: "Borewell Pipes",
    categoryId: "borewell-pipes",
    image: "/images/borewell.jpg",
    shortDescription: "Pipe options for borewell and water movement requirements.",
    fullDescription: "Heavy-duty column and casing bore pipes designed to withstand subterranean pressure in deep borewells.",
    specifications: {
      "Application": "Submersible Pump & Borewell Casing",
      "Material": "High-Density uPVC",
      "Availability": "Direct Store Orders"
    },
    isPopular: true
  },
  // 5. Vectus Water Tank
  {
    id: "vectus-water-tank",
    name: "Vectus Water Tank",
    brand: "Vectus",
    category: "Water Tanks",
    categoryId: "water-tanks",
    image: "/images/water-tank.jpg",
    shortDescription: "Water storage solutions. Contact the shop to confirm available capacities and models.",
    fullDescription: "Vectus multi-layer overhead plastic water storage tanks with food-grade inner layer and UV-protective shell. Contact shop for exact 500L, 1000L, or 2000L capacity availability.",
    specifications: {
      "Brand": "Vectus",
      "Type": "Overhead Water Tank",
      "Layer Technology": "Multi-Layer UV Shield",
      "Capacities": "Contact store for stock dimensions"
    },
    isPopular: true
  },
  // 6. CP Taps
  {
    id: "cp-taps",
    name: "CP Taps",
    brand: "Unspecified",
    category: "Bathroom and Plumbing Taps",
    categoryId: "bathroom-taps",
    image: "/images/taps.jpg",
    shortDescription: "CP tap options for bathroom and household water outlets.",
    fullDescription: "Chrome-plated brass bib cocks, pillar taps, and mixer taps for sleek, splash-free water delivery in bathrooms and kitchens.",
    specifications: {
      "Finish": "Chrome Plated Mirror Gloss",
      "Material": "Solid Brass Body",
      "Usage": "Wash Basin, Bathroom Wall Mount"
    },
    isPopular: true
  },
  // 7. SS Taps
  {
    id: "ss-taps",
    name: "SS Taps",
    brand: "Unspecified",
    category: "Bathroom and Plumbing Taps",
    categoryId: "bathroom-taps",
    image: "/images/taps.jpg",
    shortDescription: "Stainless steel tap options for household plumbing needs.",
    fullDescription: "Rust-resistant stainless steel taps engineered for smooth handle operation and robust water control in washing areas.",
    specifications: {
      "Material": "Stainless Steel",
      "Usage": "Utility & Garden Taps",
      "Feature": "Corrosion Proof"
    }
  },
  // 8. UltraTech Cement
  {
    id: "ultratech-cement",
    name: "UltraTech Cement",
    brand: "UltraTech Cement",
    category: "Cement",
    categoryId: "cement",
    image: "/images/cement.jpg",
    shortDescription: "Cement for house construction and related building requirements.",
    fullDescription: "UltraTech Cement for foundation footings, concrete slabs, column casting, and brick masonry. High early strength formulation.",
    specifications: {
      "Brand": "UltraTech Cement",
      "Packaging": "50kg Bag",
      "Application": "Structural Concrete & Plastering"
    },
    isPopular: true
  },
  // 9. Construction Steel
  {
    id: "construction-steel",
    name: "Construction Steel",
    brand: "Pending verification",
    category: "Steel and Reinforcement Materials",
    categoryId: "steel-reinforcement",
    image: "/images/steel.jpg",
    shortDescription: "Steel products for house and general construction enquiries.",
    fullDescription: "TMT reinforcement steel rebars and structural steel rods for house foundations, beams, and columns. Exact brand spelling and product availability must be confirmed by the owner.",
    specifications: {
      "Brand": "Pending Owner Verification",
      "Product Type": "TMT Steel Rebars / Rods",
      "Verification Note": "Brand spelling & availability to be confirmed"
    },
    verificationNote: "Exact brand spelling and product availability must be confirmed by owner",
    isPopular: true
  }
];

export function getWhatsAppEnquiryUrl(productName?: string): string {
  const text = productName 
    ? `Hello, I would like to enquire about ${productName}. Please share the price and availability.`
    : `Hello, I would like to enquire about building materials at K.S. Steel Corporation.`;
  return `https://wa.me/919842928278?text=${encodeURIComponent(text)}`;
}
