import { ObjectId } from "mongodb";

export const ALLOWED_CATEGORIES = [
  "Plumbing Pipes and Fittings",
  "Borewell Pipes",
  "Water Tanks",
  "Bathroom and Plumbing Taps",
  "Cement",
  "Steel and Reinforcement Materials",
  "Other Building Materials"
] as const;

export type CategoryName = typeof ALLOWED_CATEGORIES[number];

export interface ProductDocument {
  _id?: ObjectId;
  id: string; // URL-friendly string ID or slug
  name: string;
  slug: string;
  brand?: string;
  category: CategoryName | string;
  categoryId: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery?: string[];
  specifications?: Record<string, string>;
  isActive: boolean;
  isPopular?: boolean;
  isPlaceholder?: boolean;
  verificationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryToSlug(category: string): string {
  const map: Record<string, string> = {
    "Plumbing Pipes and Fittings": "plumbing-pipes",
    "Borewell Pipes": "borewell-pipes",
    "Water Tanks": "water-tanks",
    "Bathroom and Plumbing Taps": "bathroom-taps",
    "Cement": "cement",
    "Steel and Reinforcement Materials": "steel-reinforcement",
    "Other Building Materials": "other-building-materials"
  };
  return map[category] || slugify(category);
}
