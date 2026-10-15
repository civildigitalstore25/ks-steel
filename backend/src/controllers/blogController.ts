import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "../db/mongo.js";
import { BlogDocument, BlogStatus } from "../models/blog.js";

const COLLECTION = "blogs";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function clean(value: unknown, max = 20000): string {
  return String(value ?? "").trim().slice(0, max);
}

async function blogs() {
  const collection = getDatabase().collection<BlogDocument>(COLLECTION);
  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ status: 1, publishedAt: -1 });
  return collection;
}

async function uniqueSlug(base: string, ignoreId?: ObjectId): Promise<string> {
  const collection = await blogs();
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 2;
  while (await collection.findOne({
    slug: candidate,
    ...(ignoreId ? { _id: { $ne: ignoreId } } : {})
  })) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

function readPayload(body: Record<string, unknown>, slug: string, existing?: BlogDocument) {
  const title = clean(body.title, 160);
  const excerpt = clean(body.excerpt, 320);
  const content = clean(body.content, 50000);
  const status: BlogStatus = body.status === "published" ? "published" : "draft";
  const now = new Date();
  const publishedAt = status === "published"
    ? existing?.publishedAt || now
    : existing?.publishedAt || null;

  return {
    title,
    slug,
    excerpt,
    content,
    coverImage: clean(body.coverImage, 500),
    coverImageAlt: clean(body.coverImageAlt, 180),
    metaTitle: clean(body.metaTitle, 70),
    metaDescription: clean(body.metaDescription, 200),
    status,
    authorName: clean(body.authorName, 80) || "K.S. Steel Corporation",
    publishedAt,
    updatedAt: now
  };
}

function validate(post: { title: string; excerpt: string; content: string }): string | null {
  if (post.title.length < 8) return "Title should be at least 8 characters.";
  if (post.excerpt.length < 40) return "Excerpt should be at least 40 characters so search results have a useful description.";
  const articleLength = post.content.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;
  if (articleLength < 80) return "Write a longer article. Aim for a few short paragraphs.";
  return null;
}

export async function getPublicBlogs(_req: Request, res: Response): Promise<void> {
  try {
    const collection = await blogs();
    const posts = await collection
      .find({ status: "published" })
      .sort({ publishedAt: -1 })
      .toArray();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blog posts." });
  }
}

export async function getPublicBlogBySlug(req: Request, res: Response): Promise<void> {
  try {
    const slug = clean(req.params.slug, 120);
    const post = await (await blogs()).findOne({ slug, status: "published" });
    if (!post) {
      res.status(404).json({ error: "Blog post not found." });
      return;
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Failed to fetch blog post." });
  }
}

export async function getAdminBlogs(_req: Request, res: Response): Promise<void> {
  try {
    const posts = await (await blogs()).find({}).sort({ updatedAt: -1 }).toArray();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    res.status(500).json({ error: "Failed to fetch blog posts." });
  }
}

export async function getAdminBlogById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id || "");
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid blog id." });
      return;
    }
    const post = await (await blogs()).findOne({ _id: new ObjectId(id) });
    if (!post) {
      res.status(404).json({ error: "Blog post not found." });
      return;
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching admin blog:", error);
    res.status(500).json({ error: "Failed to fetch blog post." });
  }
}

export async function createBlog(req: Request, res: Response): Promise<void> {
  try {
    const body = (req.body || {}) as Record<string, unknown>;
    const slug = await uniqueSlug(clean(body.slug, 80) || clean(body.title, 160));
    const post = readPayload(body, slug);
    const error = validate(post);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    const doc: BlogDocument = { ...post, createdAt: new Date() };
    const result = await (await blogs()).insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Failed to create blog post." });
  }
}

export async function updateBlog(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id || "");
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid blog id." });
      return;
    }
    const objectId = new ObjectId(id);
    const collection = await blogs();
    const existing = await collection.findOne({ _id: objectId });
    if (!existing) {
      res.status(404).json({ error: "Blog post not found." });
      return;
    }
    const body = (req.body || {}) as Record<string, unknown>;
    const slug = await uniqueSlug(clean(body.slug, 80) || clean(body.title, 160), objectId);
    const post = readPayload(body, slug, existing);
    const error = validate(post);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    await collection.updateOne({ _id: objectId }, { $set: post });
    res.json({ ...existing, ...post, _id: objectId });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog post." });
  }
}

export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id || "");
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid blog id." });
      return;
    }
    const result = await (await blogs()).deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) {
      res.status(404).json({ error: "Blog post not found." });
      return;
    }
    res.json({ message: "Blog post deleted." });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog post." });
  }
}
