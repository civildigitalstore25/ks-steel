import type { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { getDatabase } from "../db/mongo.js";
import { User } from "../models/user.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const db = getDatabase();
    const user = await db.collection<User>("users").findOne({
      email: String(email).trim().toLowerCase()
    });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    if (user.role !== "superadmin") {
      res.status(403).json({ error: "Access denied. Admin privileges required." });
      return;
    }

    // Sign JWT Token
    const token = jwt.sign(
      { userId: user._id?.toString(), role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    // Set HTTP-only Cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id?.toString(),
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error during login." });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ user: req.user });
}

export async function logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
  res.clearCookie("admin_token");
  res.json({ message: "Logged out successfully" });
}
