import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import Otp from "../../models/Otp.js";
import Thread from "../../models/Threads.js";

/**
 * ✅ USER FACTORY — Create test users
 */
export const createTestUser = async (overrides = {}) => {
  const defaults = {
    username: "testuser_" + Math.random().toString(36).substring(7),
    email: `test_${Math.random().toString(36).substring(7)}@example.com`,
    password: await bcrypt.hash("password123", 12),
    role: "user",
  };

  return User.create({ ...defaults, ...overrides });
};

/**
 * ✅ OTP FACTORY — Create test OTP records
 */
export const createTestOtp = async (overrides = {}) => {
  const defaults = {
    email: `test_${Math.random().toString(36).substring(7)}@example.com`,
    otp: await bcrypt.hash("123456", 10),
    purpose: "signup",
    attempts: 0,
    pendingUser: {
      username: "testuser_" + Math.random().toString(36).substring(7),
      password: await bcrypt.hash("password123", 12),
    },
  };

  return Otp.create({ ...defaults, ...overrides });
};

/**
 * ✅ THREAD FACTORY — Create test threads
 */
export const createTestThread = async (userId, overrides = {}) => {
  const defaults = {
    threadId: "thread_" + Math.random().toString(36).substring(7),
    userId,
    title: "Test Thread",
    messages: [{ role: "user", content: "Hello!" }],
  };

  return Thread.create({ ...defaults, ...overrides });
};

/**
 * ✅ JWT TOKEN GENERATOR — ESM compatible (require nahi, import use karo)
 */
export const generateTestToken = (userId, role = "user") => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "test-secret",
    { expiresIn: "7d" }
  );
};

/**
 * ✅ MOCK EMAIL SERVICE
 */
export const mockEmailService = () => {
  return {
    generateOTP: jest.fn(() => "123456"),
    sendSignupOTP: jest.fn().mockResolvedValue(undefined),
    sendLoginOTP: jest.fn().mockResolvedValue(undefined),
  };
};

/**
 * ✅ MOCK OPENAI SERVICE
 */
export const mockOpenAIService = () => {
  return jest.fn().mockResolvedValue("This is a mocked AI response");
};

/**
 * ✅ MOCK RESEND EMAIL SERVICE
 */
export const mockResendEmail = () => {
  return {
    emails: {
      send: jest.fn().mockResolvedValue({ id: "mocked-email-id" }),
    },
  };
};