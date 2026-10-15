export interface Product {
  id: string;
  _id?: string;
  slug?: string;
  name: string;
  brand?: string;
  brandLogo?: string;
  category: string;
  categoryId: string;
  image: string;
  imageAlt?: string;
  gallery?: string[];
  shortDescription: string;
  fullDescription?: string;
  description?: string;
  specifications?: Record<string, string>;
  isActive?: boolean;
  isPopular?: boolean;
  verificationNote?: string;
  isPlaceholder?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  coverImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published';
  authorName: string;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
