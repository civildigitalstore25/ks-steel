import { app } from "./app.js";
import { closeDatabase, connectToDatabase } from "./db/mongo.js";
import { config } from "./config.js";

async function startServer(): Promise<void> {
  await connectToDatabase();

  const server = app.listen(config.port, () => {
    console.log(`Backend listening on http://localhost:${config.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`Received ${signal}; shutting down`);
    server.close(async (error) => {
      if (error) {
        console.error("HTTP server shutdown failed:", error);
        process.exitCode = 1;
      }

      await closeDatabase();
    });
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

startServer().catch((error: unknown) => {
  console.error("Unable to start backend:", error);
  process.exitCode = 1;
});
