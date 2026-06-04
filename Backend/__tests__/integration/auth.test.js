import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import bcrypt from "bcryptjs";

// ✅ ESM mein mock PEHLE, import baad mein
await jest.unstable_mockModule("../../services/emailService.js", () => ({
  generateOTP: jest.fn(() => "123456"),
  sendSignupOTP: jest.fn().mockResolvedValue(undefined),
  sendLoginOTP: jest.fn().mockResolvedValue(undefined),
}));

// ✅ Sab imports mock ke BAAD
const { default: authRoutes } = await import("../../routes/auth.js");
const { default: User } = await import("../../models/User.js");
const { default: Otp } = await import("../../models/Otp.js");
const { createTestUser, generateTestToken } = await import("../units/factories.js");
const { expectations, testData } = await import("../units/helpers.js");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("✅ Auth Routes - Integration Tests", () => {
  describe("POST /api/auth/signup/send-otp", () => {
    it("should send OTP for signup with valid credentials", async () => {
      const payload = testData.validSignupPayload();

      const res = await request(app).post("/api/auth/signup/send-otp").send(payload);

      expectations.isValidResponse(res, 200);
      expectations.hasSuccessMessage(res);
      expect(res.body.email).toBe(payload.email);
    });

    it("should return 400 when username is missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup/send-otp")
        .send({ email: "test@example.com", password: "password123" });

      expectations.hasErrorMessage(res, 400);
      expect(res.body.message).toMatch(/required/i);
    });

    it("should return 400 when password is too short", async () => {
      const res = await request(app)
        .post("/api/auth/signup/send-otp")
        .send({ username: "testuser", email: "test@example.com", password: "123" });

      expectations.hasErrorMessage(res, 400);
      expect(res.body.message).toMatch(/at least 6/i);
    });

    it("should return 400 when email already exists", async () => {
      const existingUser = await createTestUser();

      const res = await request(app)
        .post("/api/auth/signup/send-otp")
        .send({ username: "newuser", email: existingUser.email, password: "password123" });

      expectations.hasErrorMessage(res, 400);
      expect(res.body.message).toMatch(/already taken/i);
    });

    it("should return 400 when username already exists", async () => {
      const existingUser = await createTestUser();

      const res = await request(app)
        .post("/api/auth/signup/send-otp")
        .send({ username: existingUser.username, email: "newemail@example.com", password: "password123" });

      expectations.hasErrorMessage(res, 400);
      expect(res.body.message).toMatch(/already taken/i);
    });

    it("should create OTP record in database", async () => {
      const payload = testData.validSignupPayload();

      await request(app).post("/api/auth/signup/send-otp").send(payload);

      const otpRecord = await Otp.findOne({ email: payload.email, purpose: "signup" });

      expect(otpRecord).toBeDefined();
      expect(otpRecord.pendingUser.username).toBe(payload.username);
      expect(otpRecord.attempts).toBe(0);
    });
  });

  describe("POST /api/auth/signup/verify-otp", () => {
    let email, otp, password, username;

    beforeEach(async () => {
      email = `user_${Date.now()}@example.com`;
      username = "testuser_" + Math.random().toString(36).substring(7);
      password = "password123";
      otp = "123456";

      const hashedPassword = await bcrypt.hash(password, 12);
      const hashedOtp = await bcrypt.hash(otp, 10);

      await Otp.create({
        email,
        otp: hashedOtp,
        purpose: "signup",
        pendingUser: { username, password: hashedPassword },
        attempts: 0,
      });
    });

    it("should create user and return token with correct OTP", async () => {
      const res = await request(app)
        .post("/api/auth/signup/verify-otp")
        .send({ email, otp });

      expectations.isValidResponse(res, 201);
      expectations.hasSuccessMessage(res);
      expectations.hasToken(res);
      expectations.hasUser(res);
      expect(res.body.user.username).toBe(username);
      expect(res.body.user.email).toBe(email);
    });

    it("should delete OTP record after successful verification", async () => {
      await request(app).post("/api/auth/signup/verify-otp").send({ email, otp });

      const deletedOtp = await Otp.findOne({ email, purpose: "signup" });
      expect(deletedOtp).toBeNull();
    });

    it("should return 400 with wrong OTP", async () => {
      const res = await request(app)
        .post("/api/auth/signup/verify-otp")
        .send({ email, otp: "999999" });

      expectations.hasErrorMessage(res, 400);
      expect(res.body.message).toMatch(/Wrong OTP/i);
    });

    it("should increment attempts on wrong OTP", async () => {
      await request(app)
        .post("/api/auth/signup/verify-otp")
        .send({ email, otp: "999999" });

      const otpRecord = await Otp.findOne({ email, purpose: "signup" });
      expect(otpRecord.attempts).toBe(1);
    });

    it("should block after 5 wrong attempts", async () => {
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/api/auth/signup/verify-otp")
          .send({ email, otp: "999999" });
      }

      const res = await request(app)
        .post("/api/auth/signup/verify-otp")
        .send({ email, otp: "999999" });

      expect(res.status).toBe(429);
      expect(res.body.message).toMatch(/Too many/i);
    });

    it("should return 400 when email and OTP are missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup/verify-otp")
        .send({});

      expectations.hasErrorMessage(res, 400);
    });
  });

  describe("POST /api/auth/login/send-otp", () => {
    let testUser;

    beforeEach(async () => {
      testUser = await createTestUser();
    });

    it("should send OTP for login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login/send-otp")
        .send({ email: testUser.email, password: "password123" });

      expectations.isValidResponse(res, 200);
      expectations.hasSuccessMessage(res);
      expect(res.body.email).toBe(testUser.email);
    });

    it("should return 404 when user not found", async () => {
      const res = await request(app)
        .post("/api/auth/login/send-otp")
        .send({ email: "nonexistent@example.com", password: "password123" });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/No account found/i);
    });

    it("should return 400 with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login/send-otp")
        .send({ email: testUser.email, password: "wrongpassword" });

      expectations.hasErrorMessage(res, 400);
      expect(res.body.message).toMatch(/Invalid password/i);
    });

    it("should create OTP record for login", async () => {
      await request(app)
        .post("/api/auth/login/send-otp")
        .send({ email: testUser.email, password: "password123" });

      const otpRecord = await Otp.findOne({ email: testUser.email, purpose: "login" });
      expect(otpRecord).toBeDefined();
      expect(otpRecord.purpose).toBe("login");
    });
  });

  describe("POST /api/auth/login/verify-otp", () => {
    let testUser, otp, email;

    beforeEach(async () => {
      testUser = await createTestUser();
      email = testUser.email;
      otp = "123456";

      const hashedOtp = await bcrypt.hash(otp, 10);

      await Otp.create({
        email,
        otp: hashedOtp,
        purpose: "login",
        attempts: 0,
      });
    });

    it("should return token with correct OTP", async () => {
      const res = await request(app)
        .post("/api/auth/login/verify-otp")
        .send({ email, otp });

      expectations.isValidResponse(res, 200);
      expectations.hasSuccessMessage(res);
      expectations.hasToken(res);
      expectations.hasUser(res);
    });

    it("should delete OTP after successful login", async () => {
      await request(app)
        .post("/api/auth/login/verify-otp")
        .send({ email, otp });

      const deletedOtp = await Otp.findOne({ email, purpose: "login" });
      expect(deletedOtp).toBeNull();
    });

    it("should return 400 with wrong OTP", async () => {
      const res = await request(app)
        .post("/api/auth/login/verify-otp")
        .send({ email, otp: "999999" });

      expectations.hasErrorMessage(res, 400);
      expect(res.body.message).toMatch(/Wrong OTP/i);
    });
  });

  describe("GET /api/auth/me (Protected)", () => {
    it("should return current user with valid token", async () => {
      const testUser = await createTestUser();
      const token = generateTestToken(testUser._id);

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expectations.isValidResponse(res, 200);
      expect(res.body.username).toBe(testUser.username);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body).not.toHaveProperty("password");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Token required/i);
    });

    it("should return 403 with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid_token");

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Invalid or expired/i);
    });
  });

  describe("POST /api/auth/resend-otp", () => {
    let email;

    beforeEach(async () => {
      email = `test_${Date.now()}@example.com`;
      const hashedOtp = await bcrypt.hash("123456", 10);

      await Otp.create({
        email,
        otp: hashedOtp,
        purpose: "signup",
        pendingUser: { username: "testuser", password: "hashedpass" },
        attempts: 3,
      });
    });

    it("should resend OTP and reset attempts", async () => {
      const res = await request(app)
        .post("/api/auth/resend-otp")
        .send({ email, purpose: "signup" });

      expectations.isValidResponse(res, 200);
      expectations.hasSuccessMessage(res);

      const updatedOtp = await Otp.findOne({ email, purpose: "signup" });
      expect(updatedOtp.attempts).toBe(0);
    });

    it("should return 400 when purpose is missing", async () => {
      const res = await request(app)
        .post("/api/auth/resend-otp")
        .send({ email });

      expectations.hasErrorMessage(res, 400);
    });
  });
});