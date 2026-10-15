import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { uploadsDir } from "./uploadsDir.js";
import { connectToDatabase, getDatabase } from "./db/mongo.js";
import { seedDatabase } from "./db/seed.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

export const app = express();

app.disable("x-powered-by");

// CORS Configuration with Credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or matching origins
      if (!origin || origin === config.frontendOrigin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive local dev fallback
      }
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(uploadsDir));

app.get("/", (_request, response) => {
  response.json({ status: "ok", service: "K.S. Steel Corporation API" });
});

let databaseReady: Promise<void> | null = null;

function ensureDatabase(): Promise<void> {
  if (!databaseReady) {
    databaseReady = connectToDatabase()
      .then(() => seedDatabase())
      .catch((error: unknown) => {
        databaseReady = null;
        throw error;
      });
  }
  return databaseReady;
}

app.use((request, response, next) => {
  if (request.path === "/") {
    next();
    return;
  }
  ensureDatabase()
    .then(() => next())
    .catch((error: unknown) => {
      console.error("Database startup failed:", error);
      if (!response.headersSent) {
        response.status(503).json({ error: "Database unavailable" });
      }
    });
});

// Health Check API
app.get("/api/health", async (_request, response) => {
  try {
    await getDatabase().command({ ping: 1 });
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    response.status(503).json({ status: "error", database: "unavailable" });
  }
});

// API Routes Registration
app.use("/api/admin/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", blogRoutes);
app.use("/api", uploadRoutes);

// 404 Route Fallback
app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (!response.headersSent) {
    response.status(500).json({ error: "Internal server error" });
  }
});

export default app;
