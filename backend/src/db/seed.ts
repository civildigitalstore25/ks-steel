import bcrypt from "bcryptjs";
import { getDatabase } from "./mongo.js";
import { config } from "../config.js";
import { User } from "../models/user.js";
import { ProductDocument, categoryToSlug } from "../models/product.js";

export async function seedDatabase(): Promise<void> {
  const db = getDatabase();

  // 1. Idempotent Superadmin Seeding
  const usersCollection = db.collection<User>("users");
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  const existingAdmin = await usersCollection.findOne({
    email: config.superadminEmail.toLowerCase()
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(config.superadminPassword, 10);
    await usersCollection.insertOne({
      email: config.superadminEmail.toLowerCase(),
      passwordHash,
      role: "superadmin",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`[Seed] Superadmin account initialized (${config.superadminEmail})`);
  }

  // 2. Initial Product Catalogue Seeding if Collection is empty
  const productsCollection = db.collection<ProductDocument>("products");
  await productsCollection.createIndex({ slug: 1 }, { unique: true });
  await productsCollection.createIndex({ id: 1 }, { unique: true });

  const count = await productsCollection.countDocuments();
  if (count === 0) {
    const initialProducts: Omit<ProductDocument, "_id">[] = [
      {
        id: "astral-plumbing-pipes",
        name: "Astral Plumbing Pipes",
        slug: "astral-plumbing-pipes",
        brand: "Astral",
        category: "Plumbing Pipes and Fittings",
        categoryId: "plumbing-pipes",
        image: "/images/pipes.jpg",
        shortDescription: "Plumbing pipe options for residential and construction requirements.",
        description: "Astral plumbing pipes engineered for hot and cold water supply lines, high thermal tolerance, and leak-proof jointing across residential apartments and commercial installations.",
        specifications: {
          "Brand": "Astral",
          "Material": "CPVC / uPVC",
          "Usage": "Hot & Cold Water Plumbing Systems",
          "Availability": "In Store - pasupathikoil"
        },
        isActive: true,
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "ashirvad-pipes",
        name: "Ashirvad Pipes",
        slug: "ashirvad-pipes",
        brand: "Ashirvad",
        category: "Plumbing Pipes and Fittings",
        categoryId: "plumbing-pipes",
        image: "/images/pipes.jpg",
        shortDescription: "Pipe options for household and building plumbing requirements.",
        description: "Ashirvad uPVC and CPVC piping solutions designed for durable domestic water supply lines with UV protection and lead-free composition.",
        specifications: {
          "Brand": "Ashirvad",
          "Material": "uPVC / CPVC",
          "Usage": "Household & Commercial Plumbing",
          "Availability": "In Store"
        },
        isActive: true,
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pipe-fittings-connectors",
        name: "Pipe Fittings and Connectors",
        slug: "pipe-fittings-connectors",
        brand: "Unspecified",
        category: "Plumbing Pipes and Fittings",
        categoryId: "plumbing-pipes",
        image: "/images/pipes.jpg",
        shortDescription: "Selected connectors, bends, and fittings for plumbing requirements.",
        description: "Selected elbows, tees, couplings, adaptors, and solvent cement fittings. Catalogue placeholder subject to specific model confirmation at store.",
        specifications: {
          "Brand": "Unspecified / Multi-Brand",
          "Items": "Bends, Elbows, Reducers, Couplers",
          "Status": "Placeholder / Confirmation Pending"
        },
        isActive: true,
        isPlaceholder: true,
        verificationNote: "Catalogue placeholder - model availability to be confirmed",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "bore-pipes",
        name: "Bore Pipes",
        slug: "bore-pipes",
        brand: "Unspecified",
        category: "Borewell Pipes",
        categoryId: "borewell-pipes",
        image: "/images/borewell.jpg",
        shortDescription: "Pipe options for borewell and water movement requirements.",
        description: "Heavy-duty column and casing bore pipes designed to withstand subterranean pressure in deep borewells.",
        specifications: {
          "Application": "Submersible Pump & Borewell Casing",
          "Material": "High-Density uPVC",
          "Availability": "Direct Store Orders"
        },
        isActive: true,
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "vectus-water-tank",
        name: "Vectus Water Tank",
        slug: "vectus-water-tank",
        brand: "Vectus",
        category: "Water Tanks",
        categoryId: "water-tanks",
        image: "/images/water-tank.jpg",
        shortDescription: "Water storage solutions. Contact the shop to confirm available capacities and models.",
        description: "Vectus multi-layer overhead plastic water storage tanks with food-grade inner layer and UV-protective shell. Contact shop for exact 500L, 1000L, or 2000L capacity availability.",
        specifications: {
          "Brand": "Vectus",
          "Type": "Overhead Water Tank",
          "Layer Technology": "Multi-Layer UV Shield",
          "Capacities": "Contact store for stock dimensions"
        },
        isActive: true,
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "cp-taps",
        name: "CP Taps",
        slug: "cp-taps",
        brand: "Unspecified",
        category: "Bathroom and Plumbing Taps",
        categoryId: "bathroom-taps",
        image: "/images/taps.jpg",
        shortDescription: "CP tap options for bathroom and household water outlets.",
        description: "Chrome-plated brass bib cocks, pillar taps, and mixer taps for sleek, splash-free water delivery in bathrooms and kitchens.",
        specifications: {
          "Finish": "Chrome Plated Mirror Gloss",
          "Material": "Solid Brass Body",
          "Usage": "Wash Basin, Bathroom Wall Mount"
        },
        isActive: true,
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "ss-taps",
        name: "SS Taps",
        slug: "ss-taps",
        brand: "Unspecified",
        category: "Bathroom and Plumbing Taps",
        categoryId: "bathroom-taps",
        image: "/images/taps.jpg",
        shortDescription: "Stainless steel tap options for household plumbing needs.",
        description: "Rust-resistant stainless steel taps engineered for smooth handle operation and robust water control in washing areas.",
        specifications: {
          "Material": "Stainless Steel",
          "Usage": "Utility & Garden Taps",
          "Feature": "Corrosion Proof"
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "ultratech-cement",
        name: "UltraTech Cement",
        slug: "ultratech-cement",
        brand: "UltraTech Cement",
        category: "Cement",
        categoryId: "cement",
        image: "/images/cement.jpg",
        shortDescription: "Cement for house construction and related building requirements.",
        description: "UltraTech Cement for foundation footings, concrete slabs, column casting, and brick masonry. High early strength formulation.",
        specifications: {
          "Brand": "UltraTech Cement",
          "Packaging": "50kg Bag",
          "Application": "Structural Concrete & Plastering"
        },
        isActive: true,
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "construction-steel",
        name: "Construction Steel",
        slug: "construction-steel",
        brand: "Pending verification",
        category: "Steel and Reinforcement Materials",
        categoryId: "steel-reinforcement",
        image: "/images/steel.jpg",
        shortDescription: "Steel products for house and general construction enquiries.",
        description: "TMT reinforcement steel rebars and structural steel rods for house foundations, beams, and columns. Exact brand spelling and product availability must be confirmed by the owner.",
        specifications: {
          "Brand": "Pending Owner Verification",
          "Product Type": "TMT Steel Rebars / Rods",
          "Verification Note": "Brand spelling & availability to be confirmed"
        },
        verificationNote: "Exact brand spelling and product availability must be confirmed by owner",
        isActive: true,
        isPopular: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await productsCollection.insertMany(initialProducts as ProductDocument[]);
    console.log(`[Seed] Initial 9 catalogue products initialized in database`);
  }
}
