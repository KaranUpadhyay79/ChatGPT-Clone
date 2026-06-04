import request from "supertest";
import express from "express";

/**
 * ✅ CREATE TEST SERVER — With all middleware
 */
export const createTestServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};

/**
 * ✅ API REQUEST HELPER — Simplifies testing API endpoints
 */
export const makeRequest = (
  app,
  method = "post",
  endpoint = "/api/auth/signup/send-otp",
  body = {},
  token = null
) => {
  let req = request(app)[method](endpoint);

  if (token) {
    req = req.set("Authorization", `Bearer ${token}`);
  }

  return req.send(body);
};

/**
 * ✅ TEST DATA BUILDERS
 */
export const testData = {
  validSignupPayload: () => ({
    username: "testuser_" + Math.random().toString(36).substring(7),
    email: `test_${Math.random().toString(36).substring(7)}@example.com`,
    password: "password123",
  }),

  validLoginPayload: (email = "test@example.com", password = "password123") => ({
    email,
    password,
  }),

  validOtpPayload: (email = "test@example.com", otp = "123456") => ({
    email,
    otp,
  }),

  validThreadPayload: (threadId = "thread_123", message = "Hello AI") => ({
    threadId,
    message,
  }),

  invalidSignupPayload: () => ({
    username: "testuser",
    // missing email — intentional
    password: "123", // too short — intentional
  }),
};

/**
 * ✅ COMMON TEST ASSERTIONS
 */
export const expectations = {
  isValidResponse: (res, status = 200) => {
    expect(res.status).toBe(status);
    expect(res.body).toBeDefined();
  },

  hasSuccessMessage: (res) => {
    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
  },

  hasToken: (res) => {
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  },

  hasUser: (res) => {
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).toHaveProperty("username");
  },

  hasErrorMessage: (res, status = 400) => {
    expect(res.status).toBe(status);
    expect(res.body).toHaveProperty("message");
  },
};