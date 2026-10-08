import "dotenv/config";

const portValue = process.env.PORT?.trim() || "4000";
const port = Number(portValue);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`PORT must be an integer between 1 and 65535. Received: ${portValue}`);
}

export const config = {
  port,
  mongodbUri: process.env.MONGODB_URI?.trim() || "mongodb://127.0.0.1:27017/ks_steel",
  mongodbDb: process.env.MONGODB_DB?.trim() || "ks_steel",
  jwtSecret: process.env.JWT_SECRET?.trim() || "ks_steel_superadmin_secret_key_change_in_production_2026",
  superadminEmail: process.env.SUPERADMIN_EMAIL?.trim() || "superadmin@kssteel.com",
  superadminPassword: process.env.SUPERADMIN_PASSWORD?.trim() || "SuperAdmin@123",
  frontendOrigin: process.env.FRONTEND_ORIGIN?.trim() || process.env.FRONTEND_URL?.trim() || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV?.trim() || "development",
} as const;
