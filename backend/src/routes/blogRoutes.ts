import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAdminBlogById,
  getAdminBlogs,
  getPublicBlogBySlug,
  getPublicBlogs,
  updateBlog
} from "../controllers/blogController.js";
import { requireSuperAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/blogs", getPublicBlogs);
router.get("/blogs/:slug", getPublicBlogBySlug);

router.get("/admin/blogs", requireSuperAdmin, getAdminBlogs);
router.post("/admin/blogs", requireSuperAdmin, createBlog);
router.get("/admin/blogs/:id", requireSuperAdmin, getAdminBlogById);
router.put("/admin/blogs/:id", requireSuperAdmin, updateBlog);
router.delete("/admin/blogs/:id", requireSuperAdmin, deleteBlog);

export default router;
