import jwt from "jsonwebtoken";

// ✅ Module-level assignment mat karo — ES modules mein import order
// ki wajah se env variable abhi loaded nahi hota
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
};

// ✅ AUTHENTICATE MIDDLEWARE
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <TOKEN>

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    jwt.verify(token, getJwtSecret(), (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(500).json({ message: "Authentication error" });
  }
};

// ✅ AUTHORIZE ADMIN ONLY
export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};