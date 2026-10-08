import "dotenv/config";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const portValue = process.env.PORT?.trim() || "4000";
const port = Number(portValue);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`PORT must be an integer between 1 and 65535. Received: ${portValue}`);
}

export const config = {
  port,
  mongodbUri: requiredEnv("MONGODB_URI"),
  mongodbDb: requiredEnv("MONGODB_DB"),
  frontendOrigin: process.env.FRONTEND_ORIGIN?.trim() || "http://localhost:5173",
} as const;
