import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadImage } from "../controllers/uploadController.js";
import { requireSuperAdmin } from "../middleware/auth.js";
import { uploadsDir } from "../uploadsDir.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `prod-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  }
});

const router = Router();

router.post("/admin/upload", requireSuperAdmin, upload.single("image"), uploadImage);

export default router;
