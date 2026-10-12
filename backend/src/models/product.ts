import { ObjectId } from "mongodb";

export const ALLOWED_CATEGORIES = [
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
] as const;

export type CategoryName = typeof ALLOWED_CATEGORIES[number];

export interface ProductDocument {
  _id?: ObjectId;
  id: string; // URL-friendly string ID or slug
  name: string;
  slug: string;
  brand?: string;
  brandLogo?: string;
  category: CategoryName | string;
  categoryId: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt?: string;
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
    "Steel": "steel",
    "Cement": "cement",
    "MS Pipe": "ms-pipe",
    "Paint": "paint",
    "Power Tools": "power-tools",
    "Roofing Sheets": "roofing-sheets",
    "Motor Pumps": "motor-pumps",
    "Bathware and Fittings": "bathware-fittings",
    "Electrical": "electrical",
    "Hardware": "hardware",
    "AAC Blocks": "aac-blocks",
    "Kadappa Stone": "kadappa-stone",
    "Fencing": "fencing"
  };
  return map[category] || slugify(category);
}
