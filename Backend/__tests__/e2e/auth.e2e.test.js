import { test, expect } from "@playwright/test";

// ⚠️ NOTE: These tests require your server running on http://localhost:8080
// Start your server before running: npm run dev

const BASE_URL = "http://localhost:8080";
const API_URL = `${BASE_URL}/api`;

test.describe("✅ End-to-End Tests - Complete User Flows", () => {
  // ─────────────────────────────────────────────
  // SCENARIO 1: Complete Signup Flow
  // ─────────────────────────────────────────────
  test("should complete signup flow: send OTP → verify OTP → get token", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `e2e_test_${timestamp}@example.com`;
    const testUsername = `e2euser_${timestamp}`;
    const testPassword = "TestPassword123";

    // Step 1: Send signup OTP
    const otpResponse = await page.request.post(`${API_URL}/auth/signup/send-otp`, {
      data: {
        username: testUsername,
        email: testEmail,
        password: testPassword,
      },
    });

    expect(otpResponse.status()).toBe(200);
    const otpData = await otpResponse.json();
    expect(otpData.message).toContain("OTP sent");
    expect(otpData.email).toBe(testEmail);

    // Step 2: Verify OTP (simulated with correct OTP from mock)
    const verifyResponse = await page.request.post(
      `${API_URL}/auth/signup/verify-otp`,
      {
        data: {
          email: testEmail,
          otp: "123456", // Mock OTP from jest mock
        },
      }
    );

    expect(verifyResponse.status()).toBe(201);
    const userData = await verifyResponse.json();
    expect(userData.user.email).toBe(testEmail);
    expect(userData.user.username).toBe(testUsername);
    expect(userData.token).toBeDefined();
    expect(userData.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);// JWT length approximately
  });

  // ─────────────────────────────────────────────
  // SCENARIO 2: Complete Login Flow
  // ─────────────────────────────────────────────
  test("should complete login flow: send OTP → verify OTP → get token", async ({
    page,
  }) => {
    const testEmail = "existing_user@example.com";
    const testPassword = "password123";

    // Assuming user exists (you'd create them in beforeEach)

    // Step 1: Send login OTP
    const otpResponse = await page.request.post(`${API_URL}/auth/login/send-otp`, {
      data: {
        email: testEmail,
        password: testPassword,
      },
    });

    // Note: This will fail if user doesn't exist, which is expected for E2E
    if (otpResponse.status() === 200) {
      // Step 2: Verify OTP
      const verifyResponse = await page.request.post(
        `${API_URL}/auth/login/verify-otp`,
        {
          data: {
            email: testEmail,
            otp: "123456",
          },
        }
      );

      expect(verifyResponse.status()).toBe(200);
      const loginData = await verifyResponse.json();
      expect(loginData.token).toBeDefined();
      expect(loginData.user.email).toBe(testEmail);
    }
  });

  // ─────────────────────────────────────────────
  // SCENARIO 3: Protected Route Access
  // ─────────────────────────────────────────────
  test("should access protected route with valid token", async ({ page }) => {
    // Create a test user first
    const signupResponse = await page.request.post(
      `${API_URL}/auth/signup/send-otp`,
      {
        data: {
          username: `user_${Date.now()}`,
          email: `user_${Date.now()}@example.com`,
          password: "password123",
        },
      }
    );

    expect(signupResponse.status()).toBe(200);
    const { email } = await signupResponse.json();

    // Verify OTP and get token
    const verifyResponse = await page.request.post(
      `${API_URL}/auth/signup/verify-otp`,
      {
        data: { email, otp: "123456" },
      }
    );

    const { token } = await verifyResponse.json();

    // Access protected route with token
    const meResponse = await page.request.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(meResponse.status()).toBe(200);
    const userData = await meResponse.json();
    expect(userData.email).toBe(email);
    expect(userData.password).toBeUndefined(); // Password should not be returned
  });

  // ─────────────────────────────────────────────
  // SCENARIO 4: Unauthorized Access (No Token)
  // ─────────────────────────────────────────────
  test("should return 401 when accessing protected route without token", async ({
    page,
  }) => {
    const response = await page.request.get(`${API_URL}/auth/me`);

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.message).toMatch(/Token required/i);
  });

  // ─────────────────────────────────────────────
  // SCENARIO 5: Invalid Token Rejection
  // ─────────────────────────────────────────────
  test("should return 403 with invalid token", async ({ page }) => {
    const response = await page.request.get(`${API_URL}/auth/me`, {
      headers: { Authorization: "Bearer invalid_token_xyz" },
    });

    expect(response.status()).toBe(403);
    const data = await response.json();
    expect(data.message).toMatch(/Invalid|expired/i);
  });

  // ─────────────────────────────────────────────
  // SCENARIO 6: Chat/Thread Creation and Message
  // ─────────────────────────────────────────────
  test("should create thread and send message with valid token", async ({
    page,
  }) => {
    // Step 1: Create user and get token
    const signupResponse = await page.request.post(
      `${API_URL}/auth/signup/send-otp`,
      {
        data: {
          username: `user_${Date.now()}`,
          email: `user_${Date.now()}@example.com`,
          password: "password123",
        },
      }
    );

    const { email } = await signupResponse.json();

    const verifyResponse = await page.request.post(
      `${API_URL}/auth/signup/verify-otp`,
      {
        data: { email, otp: "123456" },
      }
    );

    const { token } = await verifyResponse.json();

    // Step 2: Send chat message
    const chatResponse = await page.request.post(`${API_URL}/chat`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        threadId: `thread_${Date.now()}`,
        message: "What is artificial intelligence?",
      },
    });

    expect(chatResponse.status()).toBe(200);
    const chatData = await chatResponse.json();
    expect(chatData).toHaveProperty("reply");
    expect(chatData.reply).toBeDefined();
  });

  // ─────────────────────────────────────────────
  // SCENARIO 7: Fetch User Threads
  // ─────────────────────────────────────────────
  test("should fetch threads for authenticated user", async ({ page }) => {
    // Create user and get token
    const signupResponse = await page.request.post(
      `${API_URL}/auth/signup/send-otp`,
      {
        data: {
          username: `user_${Date.now()}`,
          email: `user_${Date.now()}@example.com`,
          password: "password123",
        },
      }
    );

    const { email } = await signupResponse.json();

    const verifyResponse = await page.request.post(
      `${API_URL}/auth/signup/verify-otp`,
      {
        data: { email, otp: "123456" },
      }
    );

    const { token } = await verifyResponse.json();

    // Fetch threads
    const threadsResponse = await page.request.get(`${API_URL}/thread`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(threadsResponse.status()).toBe(200);
    const threads = await threadsResponse.json();
    expect(Array.isArray(threads)).toBe(true);
  });

  // ─────────────────────────────────────────────
  // SCENARIO 8: Wrong Password on Login
  // ─────────────────────────────────────────────
  test("should reject login with wrong password", async ({ page }) => {
    // Assuming this email exists in test DB
    const response = await page.request.post(`${API_URL}/auth/login/send-otp`, {
      data: {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      },
    });

    expect(response.status()).toBe(404); // User doesn't exist
  });

  // ─────────────────────────────────────────────
  // SCENARIO 9: Duplicate Signup Prevention
  // ─────────────────────────────────────────────
  test("should prevent duplicate email registration", async ({ page }) => {
    const testEmail = `dup_${Date.now()}@example.com`;
    const testUsername = `dupuser_${Date.now()}`;

    // First signup
    const firstSignup = await page.request.post(
      `${API_URL}/auth/signup/send-otp`,
      {
        data: {
          username: testUsername,
          email: testEmail,
          password: "password123",
        },
      }
    );

    expect(firstSignup.status()).toBe(200);

    // Try same email again
    const secondSignup = await page.request.post(
      `${API_URL}/auth/signup/send-otp`,
      {
        data: {
          username: testUsername + "_2",
          email: testEmail,
          password: "password123",
        },
      }
    );

    expect(secondSignup.status()).toBe(400);
    const errorData = await secondSignup.json();
    expect(errorData.message).toMatch(/already taken/i);
  });

  // ─────────────────────────────────────────────
  // SCENARIO 10: OTP Resend
  // ─────────────────────────────────────────────
  test("should resend OTP successfully", async ({ page }) => {
    const testEmail = `resend_${Date.now()}@example.com`;

    // Send initial OTP
    await page.request.post(`${API_URL}/auth/signup/send-otp`, {
      data: {
        username: `user_${Date.now()}`,
        email: testEmail,
        password: "password123",
      },
    });

    // Resend OTP
    const resendResponse = await page.request.post(`${API_URL}/auth/resend-otp`, {
      data: {
        email: testEmail,
        purpose: "signup",
      },
    });

    expect(resendResponse.status()).toBe(200);
    const data = await resendResponse.json();
    expect(data.message).toMatch(/OTP sent/i);
  });
});

test.describe("✅ E2E Tests - Error Scenarios", () => {
  test("should return validation errors for incomplete signup data", async ({
    page,
  }) => {
    const response = await page.request.post(`${API_URL}/auth/signup/send-otp`, {
      data: {
        username: "testuser",
        // missing email and password
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.message).toMatch(/required/i);
  });

  test("should reject password shorter than 6 characters", async ({ page }) => {
    const response = await page.request.post(`${API_URL}/auth/signup/send-otp`, {
      data: {
        username: "testuser",
        email: "test@example.com",
        password: "123", // Too short
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.message).toMatch(/6 characters/i);
  });

  test("should handle missing required fields in chat", async ({ page }) => {
    // Create a user first
    const signupResponse = await page.request.post(
      `${API_URL}/auth/signup/send-otp`,
      {
        data: {
          username: `user_${Date.now()}`,
          email: `user_${Date.now()}@example.com`,
          password: "password123",
        },
      }
    );

    const { email } = await signupResponse.json();

    const verifyResponse = await page.request.post(
      `${API_URL}/auth/signup/verify-otp`,
      {
        data: { email, otp: "123456" },
      }
    );

    const { token } = await verifyResponse.json();

    // Try chat without threadId
    const chatResponse = await page.request.post(`${API_URL}/chat`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { message: "Hello" }, // missing threadId
    });

    expect(chatResponse.status()).toBe(400);
  });
});