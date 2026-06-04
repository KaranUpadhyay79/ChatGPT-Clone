// ✅ STEP 1: dotenv SABSE PEHLE — koi bhi import se upar
import "dotenv/config";

// ✅ STEP 2: Startup pe hi critical env vars validate karo
const REQUIRED_ENV_VARS = ["JWT_SECRET", "MONGODB_URI"];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ FATAL: Missing environment variables: ${missing.join(", ")}`);
  console.error("📄 Make sure .env file exists in Backend/ folder");
  process.exit(1);
}

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import knowledgeRoutes from "./routes/knowledge.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// ✅ Health check — Playwright is endpoint ka wait karta hai
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", chatRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/auth", authRoutes);

// ✅ Pehle DB connect karo, phir server start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected with Database!");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect with DB:", err.message);
    process.exit(1);
  }
};

connectDB();