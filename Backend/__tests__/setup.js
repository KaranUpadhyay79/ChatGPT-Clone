import "dotenv/config";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { jest } from "@jest/globals";

let mongoServer;

// ✅ Before all tests — start in-memory MongoDB
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

// ✅ After each test — clean up all collections
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ✅ After all tests — stop server and disconnect
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ✅ ESM mein jest explicitly import karna padta hai
global.console.log = jest.fn();
global.console.error = jest.fn();