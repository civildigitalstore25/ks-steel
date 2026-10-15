import { app } from "./app.js";
import { config } from "./config.js";
import { closeDatabase } from "./db/mongo.js";

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
