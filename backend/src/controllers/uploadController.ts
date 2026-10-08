import type { Request, Response } from "express";

export async function uploadImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided." });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: "Image uploaded successfully",
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
}
