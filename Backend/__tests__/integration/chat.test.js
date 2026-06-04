import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

// ✅ ESM mein mock PEHLE, import baad mein
await jest.unstable_mockModule("../../utils/openai.js", () => ({
  default: jest.fn().mockResolvedValue("This is a mocked AI response"),
}));

// ✅ Sab imports mock ke BAAD
const { default: chatRoutes } = await import("../../routes/chat.js");
const { default: Thread } = await import("../../models/Threads.js");
const { createTestUser, generateTestToken } = await import("../units/factories.js");
const { expectations, testData } = await import("../units/helpers.js");

const app = express();
app.use(express.json());
app.use("/api", chatRoutes);

describe("✅ Chat Routes - Integration Tests", () => {
  let testUser, token;

  beforeEach(async () => {
    testUser = await createTestUser();
    token = generateTestToken(testUser._id);
  });

  describe("POST /api/chat (Create/Send Message)", () => {
    it("should create new thread and send message", async () => {
      const payload = testData.validThreadPayload();

      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("reply");
      expect(res.body.reply).toMatch(/mocked AI response/i);
    });

    it("should return 401 without authentication token", async () => {
      const res = await request(app)
        .post("/api/chat")
        .send({ threadId: "thread_123", message: "Hello" });

      expect(res.status).toBe(401);
    });

    it("should return 400 when message is missing", async () => {
      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ threadId: "thread_123" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/missing required fields/i);
    });

    it("should return 400 when threadId is missing", async () => {
      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/missing required fields/i);
    });

    it("should save message to thread in database", async () => {
      const threadId = "thread_" + Date.now();
      const message = "What is AI?";

      await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ threadId, message });

      const thread = await Thread.findOne({ threadId, userId: testUser._id });

      expect(thread).toBeDefined();
      expect(thread.messages.length).toBeGreaterThan(0);
      expect(thread.messages[0].content).toBe(message);
      expect(thread.messages[0].role).toBe("user");
    });

    it("should append to existing thread", async () => {
      const threadId = "thread_" + Date.now();

      await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ threadId, message: "First message" });

      await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ threadId, message: "Second message" });

      const thread = await Thread.findOne({ threadId, userId: testUser._id });

      expect(thread.messages.length).toBe(4); // 2 user + 2 assistant
    });

    it("should associate thread with authenticated user", async () => {
      const threadId = "thread_" + Date.now();

      await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${token}`)
        .send({ threadId, message: "Test message" });

      const thread = await Thread.findOne({ threadId });

      expect(thread.userId.toString()).toBe(testUser._id.toString());
    });
  });

  describe("GET /api/thread (Fetch All Threads)", () => {
    it("should fetch all threads for authenticated user", async () => {
      await Thread.create({
        threadId: "thread_1",
        userId: testUser._id,
        title: "Thread 1",
        messages: [],
      });
      await Thread.create({
        threadId: "thread_2",
        userId: testUser._id,
        title: "Thread 2",
        messages: [],
      });

      const res = await request(app)
        .get("/api/thread")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it("should return 401 without authentication", async () => {
      const res = await request(app).get("/api/thread");

      expect(res.status).toBe(401);
    });

    it("should only fetch threads of authenticated user", async () => {
      const otherUser = await createTestUser();

      await Thread.create({
        threadId: "thread_user1",
        userId: testUser._id,
        title: "User 1 Thread",
        messages: [],
      });

      await Thread.create({
        threadId: "thread_user2",
        userId: otherUser._id,
        title: "User 2 Thread",
        messages: [],
      });

      const res = await request(app)
        .get("/api/thread")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.length).toBe(1);
      expect(res.body[0].userId.toString()).toBe(testUser._id.toString());
    });

    it("should sort threads by updatedAt descending", async () => {
      const thread1 = await Thread.create({
        threadId: "thread_sort_1",
        userId: testUser._id,
        title: "Thread 1",
        messages: [],
      });

      const thread2 = await Thread.create({
        threadId: "thread_sort_2",
        userId: testUser._id,
        title: "Thread 2",
        messages: [],
      });

      const res = await request(app)
        .get("/api/thread")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body[0]._id.toString()).toBe(thread2._id.toString());
      expect(res.body[1]._id.toString()).toBe(thread1._id.toString());
    });
  });

  describe("GET /api/thread/:threadId (Fetch Specific Thread)", () => {
    it("should fetch specific thread for authenticated user", async () => {
      const threadId = "thread_" + Date.now();

      await Thread.create({
        threadId,
        userId: testUser._id,
        title: "Test Thread",
        messages: [{ role: "user", content: "Hello" }],
      });

      const res = await request(app)
        .get(`/api/thread/${threadId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.threadId).toBe(threadId);
      expect(res.body.messages.length).toBe(1);
    });

    it("should return 404 for non-existent thread", async () => {
      const res = await request(app)
        .get("/api/thread/nonexistent_thread")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it("should return 404 if thread belongs to different user", async () => {
      const otherUser = await createTestUser();
      const threadId = "thread_other_" + Date.now();

      await Thread.create({
        threadId,
        userId: otherUser._id,
        title: "Other User Thread",
        messages: [],
      });

      const res = await request(app)
        .get(`/api/thread/${threadId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it("should return 401 without authentication", async () => {
      const res = await request(app).get("/api/thread/thread_123");

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/thread/:threadId", () => {
    it("should delete thread for authenticated user", async () => {
      const threadId = "thread_del_" + Date.now();

      await Thread.create({
        threadId,
        userId: testUser._id,
        title: "Thread to Delete",
        messages: [],
      });

      const res = await request(app)
        .delete(`/api/thread/${threadId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);

      const deletedThread = await Thread.findOne({ threadId });
      expect(deletedThread).toBeNull();
    });

    it("should return 404 when deleting non-existent thread", async () => {
      const res = await request(app)
        .delete("/api/thread/nonexistent")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it("should not delete thread of another user", async () => {
      const otherUser = await createTestUser();
      const threadId = "thread_other_del_" + Date.now();

      await Thread.create({
        threadId,
        userId: otherUser._id,
        title: "Other User Thread",
        messages: [],
      });

      const res = await request(app)
        .delete(`/api/thread/${threadId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);

      const existingThread = await Thread.findOne({ threadId });
      expect(existingThread).toBeDefined();
    });

    it("should return 401 without authentication", async () => {
      const res = await request(app).delete("/api/thread/thread_123");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/test (Test Endpoint)", () => {
    it("should create test thread with authenticated user", async () => {
      const res = await request(app)
        .post("/api/test")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.userId.toString()).toBe(testUser._id.toString());
    });

    it("should return 401 without authentication", async () => {
      const res = await request(app).post("/api/test").send();

      expect(res.status).toBe(401);
    });
  });
});