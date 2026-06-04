import { jest } from "@jest/globals";
import User from "../../models/User.js";
import { createTestUser } from "../units/factories.js"; // ✅ path fix: utils → units

describe("✅ User Model", () => {
  it("should create a user with valid data", async () => {
    const userData = {
      username: "johndoe",
      email: "john@example.com",
      password: "hashedpassword123",
      role: "user",
    };

    const user = await User.create(userData);

    expect(user._id).toBeDefined();
    expect(user.username).toBe("johndoe");
    expect(user.email).toBe("john@example.com");
    expect(user.role).toBe("user");
  });

  it("should enforce unique username", async () => {
    const userData = {
      username: "uniqueuser",
      email: "user1@example.com",
      password: "password123",
    };

    await User.create(userData);

    await expect(
      User.create({ ...userData, email: "user2@example.com" })
    ).rejects.toThrow();
  });

  it("should enforce unique email", async () => {
    const userData = {
      username: "user1",
      email: "sameemail@example.com",
      password: "password123",
    };

    await User.create(userData);

    await expect(
      User.create({ username: "user2", email: "sameemail@example.com", password: "password123" })
    ).rejects.toThrow();
  });

  it("should set default role as 'user'", async () => {
    const user = await createTestUser({ role: undefined });

    expect(user.role).toBe("user");
  });

  it("should find user by email", async () => {
    const testUser = await createTestUser();

    const foundUser = await User.findOne({ email: testUser.email });

    expect(foundUser).toBeDefined();
    expect(foundUser.email).toBe(testUser.email);
    expect(foundUser.username).toBe(testUser.username);
  });

  it("should find user by ID", async () => {
    const testUser = await createTestUser();

    const foundUser = await User.findById(testUser._id);

    expect(foundUser).toBeDefined();
    expect(foundUser._id.toString()).toBe(testUser._id.toString());
  });

  it("should update user data", async () => {
    const testUser = await createTestUser();

    const updatedUser = await User.findByIdAndUpdate(
      testUser._id,
      { role: "admin" },
      { new: true }
    );

    expect(updatedUser.role).toBe("admin");
  });

  it("should return null when finding non-existent user", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const foundUser = await User.findById(fakeId);

    expect(foundUser).toBeNull();
  });

  it("should delete a user", async () => {
    const testUser = await createTestUser();

    await User.deleteOne({ _id: testUser._id });

    const deletedUser = await User.findById(testUser._id);

    expect(deletedUser).toBeNull();
  });
});