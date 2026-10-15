import type { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

// Storage keys
const STORAGE_KEY = 'ks_steel_mock_products';
const STORAGE_VERSION_KEY = 'ks_steel_mock_version';
const CURRENT_VERSION = '2.2.3';
const TOKEN_KEY = 'ks_admin_token';
const ADMIN_USER_KEY = 'ks_admin_user';

export const API_BASE_URL = 'frontend_mock_service';

// --- AUTH TOKEN HELPERS ---

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

// --- MOCK STORAGE & SEEDING ENGINE ---

/**
 * Normalizes a product ensuring all standard fields are populated
 */
function normalizeProduct(p: Partial<Product>, index: number = 0): Product {
  const baseSlug = (p.name || `product-${index + 1}`)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const id = p.id || p.slug || baseSlug || `ks-prod-${index + 1}`;
  const slug = p.slug || baseSlug;
  const category = p.category || 'Steel';
  const categoryId = p.categoryId || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const shortDesc = p.shortDescription || (p.description ? p.description.slice(0, 120) : (p.fullDescription ? p.fullDescription.slice(0, 120) : p.name || ''));
  const fullDesc = p.fullDescription || p.description || shortDesc;

  return {
    id,
    _id: p._id || id,
    slug,
    name: p.name || 'Unnamed Product',
    brand: p.brand || 'Unbranded / Generic',
    brandLogo: p.brandLogo || '',
    category,
    categoryId,
    image: p.image || '/images/products/steel-tmt-bars.jpg',
    imageAlt: p.imageAlt || `${p.name || 'Product'} photograph`,
    shortDescription: shortDesc,
    fullDescription: fullDesc,
    description: fullDesc,
    specifications: p.specifications || {
      'Availability': 'In Store - Pasupathi Kovil'
    },
    isActive: p.isActive !== false,
    isPopular: Boolean(p.isPopular),
    isPlaceholder: Boolean(p.isPlaceholder),
    verificationNote: p.verificationNote || '',
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString()
  };
}

/**
 * Get all products stored in localStorage, seeding if empty or outdated
 */
export function getStoredProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(STORAGE_VERSION_KEY);

    if (!stored || version !== CURRENT_VERSION) {
      return seedMockData();
    }

    const parsed: Product[] = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seedMockData();
    }

    return parsed;
  } catch (err) {
    console.error('Error reading stored products from localStorage:', err);
    return seedMockData();
  }
}

/**
 * Save products list into localStorage
 */
export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    // Dispatch event so tabs or listening components can synchronize
    window.dispatchEvent(new CustomEvent('ks_products_updated', { detail: { count: products.length } }));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
}

/**
 * Seed or re-seed the mock database from default catalog products
 */
export function seedMockData(_force: boolean = false): Product[] {
  console.info('[Mock DB] Seeding product catalogue in frontend localStorage...');
  const seeded = (DEFAULT_PRODUCTS as Partial<Product>[]).map((p, idx) => normalizeProduct(p, idx));
  saveStoredProducts(seeded);
  return seeded;
}

/**
 * Reset mock database to master default seed data
 */
export function resetMockData(): Product[] {
  return seedMockData(true);
}

/**
 * Get stats about stored products in mock database
 */
export function getMockProductsStats() {
  const products = getStoredProducts();
  return {
    total: products.length,
    active: products.filter((p) => p.isActive !== false).length,
    inactive: products.filter((p) => p.isActive === false).length,
    popular: products.filter((p) => p.isPopular).length
  };
}

// Small artificial delay to keep UI animations and loaders feeling smooth and realistic
function delay(ms = 60): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- PUBLIC API METHODS (Frontend Mock Data) ---

export async function fetchPublicProducts(params?: {
  search?: string;
  category?: string;
  brand?: string;
}): Promise<Product[]> {
  await delay(60);
  let products = getStoredProducts();

  // Public site only shows active products
  products = products.filter((p) => p.isActive !== false);

  if (params?.category && params.category !== 'all') {
    const catQuery = params.category.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.categoryId?.toLowerCase() === catQuery ||
        p.category?.toLowerCase() === catQuery
    );
  }

  if (params?.brand && params.brand !== 'all') {
    const brandQuery = params.brand.toLowerCase().trim();
    products = products.filter(
      (p) => p.brand && p.brand.toLowerCase().trim() === brandQuery
    );
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    products = products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const brandMatch = p.brand?.toLowerCase().includes(q);
      const categoryMatch = p.category?.toLowerCase().includes(q);
      const shortDescMatch = p.shortDescription?.toLowerCase().includes(q);
      const descMatch = (p.description || p.fullDescription || '')?.toLowerCase().includes(q);
      return nameMatch || brandMatch || categoryMatch || shortDescMatch || descMatch;
    });
  }

  return products;
}

export async function fetchPublicProductByIdOrSlug(idOrSlug: string): Promise<Product> {
  await delay(50);
  const products = getStoredProducts();
  const target = decodeURIComponent(idOrSlug).toLowerCase().trim();

  const found = products.find(
    (p) =>
      p.id?.toLowerCase() === target ||
      p.slug?.toLowerCase() === target ||
      (p as any)._id?.toString().toLowerCase() === target
  );

  if (!found) {
    throw new Error(`Product not found: ${idOrSlug}`);
  }

  return found;
}

// --- ADMIN AUTH API METHODS (Frontend Mock Data) ---

export async function loginAdmin(credentials: { email: string; password: string }) {
  const email = (credentials.email || '').trim().toLowerCase();
  const password = credentials.password || '';
  if (!email || !password) {
    throw new Error('Please enter both email and password.');
  }

  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Invalid superadmin credentials.');
  }

  setAdminToken(data.token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
  return { success: true, token: data.token, user: data.user };
}

export async function checkAdminMe() {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  const response = await fetch('/api/admin/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include'
  });
  if (!response.ok) {
    removeAdminToken();
    throw new Error('Unauthorized');
  }
  return response.json();
}

export async function logoutAdmin(): Promise<void> {
  await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => undefined);
  removeAdminToken();
}

// --- ADMIN PRODUCT CRUD API METHODS (Frontend Mock Data) ---

export async function fetchAdminProducts(params?: {
  search?: string;
  category?: string;
}): Promise<Product[]> {
  await delay(50);
  let products = getStoredProducts();

  if (params?.category && params.category !== 'all') {
    const catQuery = params.category.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.categoryId?.toLowerCase() === catQuery ||
        p.category?.toLowerCase() === catQuery
    );
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q)
    );
  }

  return products;
}

export async function fetchAdminProductById(id: string): Promise<Product> {
  await delay(40);
  const products = getStoredProducts();
  const target = decodeURIComponent(id).toLowerCase().trim();

  const found = products.find(
    (p) =>
      p.id?.toLowerCase() === target ||
      p.slug?.toLowerCase() === target ||
      (p as any)._id?.toString().toLowerCase() === target
  );

  if (!found) {
    throw new Error('Product not found in mock database');
  }

  return found;
}

export async function createAdminProduct(productData: Partial<Product>): Promise<Product> {
  await delay(80);
  const products = getStoredProducts();
  const newProduct = normalizeProduct(productData, products.length);

  newProduct.createdAt = new Date().toISOString();
  newProduct.updatedAt = new Date().toISOString();

  // Add to top of product list
  const updatedList = [newProduct, ...products];
  saveStoredProducts(updatedList);

  return newProduct;
}

export async function updateAdminProduct(id: string, productData: Partial<Product>): Promise<Product> {
  await delay(80);
  const products = getStoredProducts();
  const target = decodeURIComponent(id).toLowerCase().trim();

  const index = products.findIndex(
    (p) =>
      p.id?.toLowerCase() === target ||
      p.slug?.toLowerCase() === target ||
      (p as any)._id?.toString().toLowerCase() === target
  );

  if (index === -1) {
    throw new Error('Product not found to update');
  }

  const existing = products[index];
  const updated: Product = {
    ...existing,
    ...productData,
    id: existing.id,
    _id: existing._id,
    slug: productData.slug || existing.slug,
    name: productData.name ?? existing.name,
    brand: productData.brand ?? existing.brand,
    brandLogo: productData.brandLogo ?? existing.brandLogo,
    category: productData.category ?? existing.category,
    categoryId: productData.categoryId ?? (productData.category ? productData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : existing.categoryId),
    image: productData.image ?? existing.image,
    imageAlt: productData.imageAlt ?? existing.imageAlt,
    shortDescription: productData.shortDescription ?? existing.shortDescription,
    fullDescription: productData.description ?? productData.fullDescription ?? existing.fullDescription,
    description: productData.description ?? productData.fullDescription ?? existing.description,
    specifications: productData.specifications ?? existing.specifications,
    isActive: productData.isActive !== undefined ? productData.isActive : existing.isActive,
    isPopular: productData.isPopular !== undefined ? productData.isPopular : existing.isPopular,
    isPlaceholder: productData.isPlaceholder !== undefined ? productData.isPlaceholder : existing.isPlaceholder,
    verificationNote: productData.verificationNote ?? existing.verificationNote,
    updatedAt: new Date().toISOString()
  };

  products[index] = updated;
  saveStoredProducts(products);

  return updated;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await delay(70);
  const products = getStoredProducts();
  const target = decodeURIComponent(id).toLowerCase().trim();

  const filtered = products.filter(
    (p) =>
      p.id?.toLowerCase() !== target &&
      p.slug?.toLowerCase() !== target &&
      (p as any)._id?.toString().toLowerCase() !== target
  );

  if (filtered.length === products.length) {
    throw new Error('Product not found to delete');
  }

  saveStoredProducts(filtered);
}

export async function uploadProductImage(file: File): Promise<string> {
  await delay(100);
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          resolve(URL.createObjectURL(file));
        }
      };
      reader.onerror = () => {
        resolve(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } catch {
      resolve('/images/products/steel-tmt-bars.jpg');
    }
  });
}
