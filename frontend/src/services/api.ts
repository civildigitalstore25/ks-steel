import type { Product } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Token storage key
const TOKEN_KEY = 'ks_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// --- PUBLIC API METHODS ---

export async function fetchPublicProducts(params?: {
  search?: string;
  category?: string;
  brand?: string;
}): Promise<Product[]> {
  const url = new URL(`${API_BASE_URL}/products`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.category && params.category !== 'all') url.searchParams.set('category', params.category);
  if (params?.brand && params.brand !== 'all') url.searchParams.set('brand', params.brand);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch public products from backend');
  }
  return response.json();
}

export async function fetchPublicProductByIdOrSlug(idOrSlug: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`);
  if (!response.ok) {
    throw new Error('Product not found');
  }
  return response.json();
}

// --- ADMIN AUTH API METHODS ---

export async function loginAdmin(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  if (data.token) {
    setAdminToken(data.token);
  }

  return data;
}

export async function checkAdminMe() {
  const response = await fetch(`${API_BASE_URL}/admin/auth/me`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });

  if (!response.ok) {
    removeAdminToken();
    throw new Error('Unauthorized');
  }

  return response.json();
}

export async function logoutAdmin() {
  try {
    await fetch(`${API_BASE_URL}/admin/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
  } catch (err) {
    console.error('Logout request failed:', err);
  } finally {
    removeAdminToken();
  }
}

// --- ADMIN PRODUCT CRUD API METHODS ---

export async function fetchAdminProducts(params?: { search?: string; category?: string }): Promise<Product[]> {
  const url = new URL(`${API_BASE_URL}/admin/products`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.category && params.category !== 'all') url.searchParams.set('category', params.category);

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admin products');
  }

  return response.json();
}

export async function fetchAdminProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }

  return response.json();
}

export async function createAdminProduct(productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
    credentials: 'include'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create product');
  }

  return data.product;
}

export async function updateAdminProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
    credentials: 'include'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update product');
  }

  return data.product;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete product');
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const token = getAdminToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include'
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload image');
  }

  // Format image URL
  if (data.url.startsWith('/uploads/')) {
    return `${API_BASE_URL.replace('/api', '')}${data.url}`;
  }
  return data.url;
}
