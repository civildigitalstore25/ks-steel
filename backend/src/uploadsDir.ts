import fs from "fs";
import path from "path";

export const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(process.cwd(), "uploads");

try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (error) {
  console.error("Could not create the uploads directory:", error);
}
