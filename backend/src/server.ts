import { app } from "./app.js";
import { closeDatabase, connectToDatabase } from "./db/mongo.js";
import { seedDatabase } from "./db/seed.js";
import { config } from "./config.js";

async function startServer(): Promise<void> {
  try {
    await connectToDatabase();
    console.log(`[Database] Connected to MongoDB: ${config.mongodbDb}`);
    
    // Seed default superadmin and initial product catalogue
    await seedDatabase();
  } catch (dbError) {
    console.warn(`[Database] MongoDB connection warning:`, dbError);
    console.warn(`[Database] Backend starting in ready mode. Ensure MongoDB server is running on ${config.mongodbUri}`);
  }

  const server = app.listen(config.port, () => {
    console.log(`[Server] K.S. Steel Corporation Backend listening on http://localhost:${config.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`Received ${signal}; shutting down gracefully`);
    server.close(async (error) => {
      if (error) {
        console.error("HTTP server shutdown error:", error);
        process.exitCode = 1;
      }
      await closeDatabase();
    });
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

startServer().catch((error: unknown) => {
  console.error("Fatal startup error:", error);
  process.exitCode = 1;
});
