import { Router } from "express";
import {
  getPublicProducts,
  getPublicProductByIdOrSlug,
  getCategories,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { requireSuperAdmin } from "../middleware/auth.js";

const router = Router();

// Public Product Routes
router.get("/products", getPublicProducts);
router.get("/products/categories", getCategories);
router.get("/products/:idOrSlug", getPublicProductByIdOrSlug);

// Admin Protected Product Routes
router.get("/admin/products", requireSuperAdmin, getAdminProducts);
router.post("/admin/products", requireSuperAdmin, createProduct);
router.get("/admin/products/:id", requireSuperAdmin, getAdminProductById);
router.put("/admin/products/:id", requireSuperAdmin, updateProduct);
router.delete("/admin/products/:id", requireSuperAdmin, deleteProduct);

export default router;
