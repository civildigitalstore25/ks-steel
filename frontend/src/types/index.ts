export interface Product {
  id: string;
  _id?: string;
  slug?: string;
  name: string;
  brand?: string;
  category: string;
  categoryId: string;
  image: string;
  gallery?: string[];
  shortDescription: string;
  fullDescription: string;
  specifications?: Record<string, string>;
  isActive?: boolean;
  isPopular?: boolean;
  verificationNote?: string;
  isPlaceholder?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  featuredBrands: string[];
}

export interface ContactFormInput {
  name: string;
  phone: string;
  category: string;
  requirement: string;
  quantity?: string;
  message?: string;
}
