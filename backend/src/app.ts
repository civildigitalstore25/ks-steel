import cors from "cors";
import express from "express";

import { config } from "./config.js";
import { getDatabase } from "./db/mongo.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: config.frontendOrigin }));
app.use(express.json());

app.get("/api/health", async (_request, response) => {
  try {
    await getDatabase().command({ ping: 1 });
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    response.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});
