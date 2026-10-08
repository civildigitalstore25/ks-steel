import type { Request, Response } from "express";
import { getDatabase } from "../db/mongo.js";
import { ProductDocument, slugify, categoryToSlug } from "../models/product.js";
import { ObjectId, type Filter } from "mongodb";

// --- PUBLIC ENDPOINTS ---

export async function getPublicProducts(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const search = req.query.search ? String(req.query.search).trim() : "";
    const category = req.query.category ? String(req.query.category).trim() : "";
    const brand = req.query.brand ? String(req.query.brand).trim() : "";

    const query: Filter<ProductDocument> = { isActive: true };

    if (category && category !== "all") {
      query.$or = [
        { category: category },
        { categoryId: category }
      ];
    }

    if (brand && brand !== "all") {
      query.brand = { $regex: new RegExp(`^${brand}$`, "i") } as unknown as string;
    }

    if (search !== "") {
      const searchRegex = new RegExp(search, "i");
      query.$and = [
        {
          $or: [
            { name: searchRegex as unknown as string },
            { brand: searchRegex as unknown as string },
            { category: searchRegex as unknown as string },
            { shortDescription: searchRegex as unknown as string },
            { description: searchRegex as unknown as string }
          ]
        }
      ];
    }

    const products = await db
      .collection<ProductDocument>("products")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(products);
  } catch (error) {
    console.error("Error fetching public products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

export async function getPublicProductByIdOrSlug(req: Request, res: Response): Promise<void> {
  try {
    const idOrSlug = String(req.params.idOrSlug || "");
    const db = getDatabase();

    const orConditions: Filter<ProductDocument>[] = [
      { id: idOrSlug },
      { slug: idOrSlug }
    ];

    if (ObjectId.isValid(idOrSlug)) {
      orConditions.push({ _id: new ObjectId(idOrSlug) });
    }

    const product = await db.collection<ProductDocument>("products").findOne({
      $or: orConditions
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
}

export async function getCategories(_req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const products = await db
      .collection<ProductDocument>("products")
      .find({ isActive: true })
      .toArray();

    const categoryMap: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || "Other Building Materials";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    res.json(categoryMap);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

// --- ADMIN PROTECTED ENDPOINTS ---

export async function getAdminProducts(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const search = req.query.search ? String(req.query.search).trim() : "";
    const category = req.query.category ? String(req.query.category).trim() : "";

    const query: Filter<ProductDocument> = {};

    if (category && category !== "all") {
      query.$or = [
        { category: category },
        { categoryId: category }
      ];
    }

    if (search !== "") {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex as unknown as string },
        { brand: searchRegex as unknown as string },
        { category: searchRegex as unknown as string }
      ];
    }

    const products = await db
      .collection<ProductDocument>("products")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(products);
  } catch (error) {
    console.error("Error fetching admin products:", error);
    res.status(500).json({ error: "Failed to fetch admin products" });
  }
}

export async function getAdminProductById(req: Request, res: Response): Promise<void> {
  try {
    const idParam = String(req.params.id || "");
    const db = getDatabase();

    const orConditions: Filter<ProductDocument>[] = [
      { id: idParam },
      { slug: idParam }
    ];

    if (ObjectId.isValid(idParam)) {
      orConditions.push({ _id: new ObjectId(idParam) });
    }

    const product = await db.collection<ProductDocument>("products").findOne({
      $or: orConditions
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching admin product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      brand,
      category,
      shortDescription,
      description,
      image,
      gallery,
      specifications,
      isActive,
      isPopular,
      isPlaceholder,
      verificationNote
    } = req.body || {};

    if (!name || !String(name).trim()) {
      res.status(400).json({ error: "Product name is required." });
      return;
    }

    if (!category || !String(category).trim()) {
      res.status(400).json({ error: "Category is required." });
      return;
    }

    const db = getDatabase();
    const collection = db.collection<ProductDocument>("products");

    let slug = slugify(String(name));
    // Ensure slug uniqueness
    const existingSlug = await collection.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const newProduct: Omit<ProductDocument, "_id"> = {
      id: slug,
      slug,
      name: String(name).trim(),
      brand: brand ? String(brand).trim() : "Unspecified",
      category: String(category).trim(),
      categoryId: categoryToSlug(String(category).trim()),
      shortDescription: shortDescription ? String(shortDescription).trim() : String(description || "").slice(0, 120),
      description: description ? String(description).trim() : String(shortDescription || name).trim(),
      image: image ? String(image).trim() : "/images/pipes.jpg",
      gallery: Array.isArray(gallery) ? gallery : [],
      specifications: typeof specifications === "object" && specifications !== null ? specifications : {},
      isActive: typeof isActive === "boolean" ? isActive : true,
      isPopular: Boolean(isPopular),
      isPlaceholder: Boolean(isPlaceholder),
      verificationNote: verificationNote ? String(verificationNote).trim() : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newProduct as ProductDocument);
    res.status(201).json({
      message: "Product created successfully",
      product: { ...newProduct, _id: result.insertedId }
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const idParam = String(req.params.id || "");
    const db = getDatabase();
    const collection = db.collection<ProductDocument>("products");

    const orConditions: Filter<ProductDocument>[] = [
      { id: idParam },
      { slug: idParam }
    ];

    if (ObjectId.isValid(idParam)) {
      orConditions.push({ _id: new ObjectId(idParam) });
    }

    const existing = await collection.findOne({ $or: orConditions });
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const {
      name,
      brand,
      category,
      shortDescription,
      description,
      image,
      gallery,
      specifications,
      isActive,
      isPopular,
      isPlaceholder,
      verificationNote
    } = req.body || {};

    const updates: Partial<ProductDocument> = {
      updatedAt: new Date()
    };

    if (name && String(name).trim()) {
      updates.name = String(name).trim();
    }
    if (brand !== undefined) {
      updates.brand = String(brand).trim();
    }
    if (category && String(category).trim()) {
      updates.category = String(category).trim();
      updates.categoryId = categoryToSlug(String(category).trim());
    }
    if (shortDescription !== undefined) {
      updates.shortDescription = String(shortDescription).trim();
    }
    if (description !== undefined) {
      updates.description = String(description).trim();
    }
    if (image !== undefined) {
      updates.image = String(image).trim();
    }
    if (Array.isArray(gallery)) {
      updates.gallery = gallery;
    }
    if (typeof specifications === "object" && specifications !== null) {
      updates.specifications = specifications;
    }
    if (typeof isActive === "boolean") {
      updates.isActive = isActive;
    }
    if (typeof isPopular === "boolean") {
      updates.isPopular = isPopular;
    }
    if (typeof isPlaceholder === "boolean") {
      updates.isPlaceholder = isPlaceholder;
    }
    if (verificationNote !== undefined) {
      updates.verificationNote = String(verificationNote).trim();
    }

    await collection.updateOne({ _id: existing._id }, { $set: updates });

    const updatedProduct = await collection.findOne({ _id: existing._id });
    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const idParam = String(req.params.id || "");
    const db = getDatabase();
    const collection = db.collection<ProductDocument>("products");

    const orConditions: Filter<ProductDocument>[] = [
      { id: idParam },
      { slug: idParam }
    ];

    if (ObjectId.isValid(idParam)) {
      orConditions.push({ _id: new ObjectId(idParam) });
    }

    const result = await collection.deleteOne({ $or: orConditions });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
}
