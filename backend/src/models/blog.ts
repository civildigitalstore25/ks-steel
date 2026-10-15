import { ObjectId } from "mongodb";

export type BlogStatus = "draft" | "published";

export interface BlogDocument {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  coverImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: BlogStatus;
  authorName: string;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
