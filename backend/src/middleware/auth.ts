import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { getDatabase } from "../db/mongo.js";
import { User, UserDTO } from "../models/user.js";
import { ObjectId } from "mongodb";

export interface AuthenticatedRequest extends Request {
  user?: UserDTO;
}

export async function requireSuperAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    // Fallback: check cookie if cookieParser is enabled
    if (!token && req.cookies?.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      res.status(401).json({ error: "Authentication required. Please log in as admin." });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    
    if (decoded.role !== "superadmin") {
      res.status(403).json({ error: "Access denied. Superadmin privilege required." });
      return;
    }

    const db = getDatabase();
    const user = await db.collection<User>("users").findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (!user || user.role !== "superadmin") {
      res.status(401).json({ error: "User account no longer exists or lacks superadmin role." });
      return;
    }

    req.user = {
      id: user._id?.toString() || "",
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired authentication session." });
  }
}
