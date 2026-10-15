import type { BlogPost } from '../types';
import { apiUrl, getAdminToken } from './api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(apiUrl(path), { ...options, headers, credentials: 'include' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'The blog request failed.');
  }
  return data as T;
}

export function fetchPublishedBlogs(): Promise<BlogPost[]> {
  return request<BlogPost[]>('/api/blogs');
}

export function fetchPublishedBlog(slug: string): Promise<BlogPost> {
  return request<BlogPost>(`/api/blogs/${encodeURIComponent(slug)}`);
}

export function fetchAdminBlogs(): Promise<BlogPost[]> {
  return request<BlogPost[]>('/api/admin/blogs');
}

export function fetchAdminBlog(id: string): Promise<BlogPost> {
  return request<BlogPost>(`/api/admin/blogs/${id}`);
}

export function createBlog(post: Partial<BlogPost>): Promise<BlogPost> {
  return request<BlogPost>('/api/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(post)
  });
}

export function updateBlog(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  return request<BlogPost>(`/api/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post)
  });
}

export function deleteBlog(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/admin/blogs/${id}`, { method: 'DELETE' });
}
