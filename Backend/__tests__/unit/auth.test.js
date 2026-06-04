import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { authenticateToken, authorizeAdmin } from "../../middleware/auth.js";

describe("✅ Auth Middleware - authenticateToken", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should attach user to req when valid token is provided", () => {
    const token = jwt.sign(
      { id: "user123", role: "user" },
      process.env.JWT_SECRET || "test-secret"
    );

    req.headers.authorization = `Bearer ${token}`;

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe("user123");
  });

  it("should return 401 when no token is provided", () => {
    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Token required" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 when invalid token is provided", () => {
    req.headers.authorization = "Bearer invalid_token_xyz";

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid or expired token" })
    );
  });

  it("should extract token from Authorization header correctly", () => {
    const token = jwt.sign(
      { id: "user456", role: "admin" },
      process.env.JWT_SECRET || "test-secret"
    );

    req.headers.authorization = `Bearer ${token}`;

    authenticateToken(req, res, next);

    expect(req.user.id).toBe("user456");
    expect(req.user.role).toBe("admin");
  });
});

describe("✅ Auth Middleware - authorizeAdmin", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should allow admin users to proceed", () => {
    req.user = { id: "admin123", role: "admin" };

    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should deny non-admin users", () => {
    req.user = { id: "user123", role: "user" };

    authorizeAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Admin access required" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should deny when user is not authenticated", () => {
    req.user = null;

    authorizeAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});