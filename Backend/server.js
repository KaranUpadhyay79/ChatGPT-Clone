// // ✅ STEP 1: dotenv SABSE PEHLE — koi bhi import se upar
// import "dotenv/config";

// // ✅ STEP 2: Startup pe hi critical env vars validate karo
// const REQUIRED_ENV_VARS = ["JWT_SECRET", "MONGODB_URI"];
// const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
// if (missing.length > 0) {
//   console.error(`❌ FATAL: Missing environment variables: ${missing.join(", ")}`);
//   console.error("📄 Make sure .env file exists in Backend/ folder");
//   process.exit(1);
// }

// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import authRoutes from "./routes/auth.js";
// import chatRoutes from "./routes/chat.js";
// import knowledgeRoutes from "./routes/knowledge.js";

// const app = express();
// const PORT = process.env.PORT || 8080;

// app.use(express.json());
// app.use(cors());

// // ✅ Health check — Playwright is endpoint ka wait karta hai
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
// });

// app.use("/api", chatRoutes);
// app.use("/api/knowledge", knowledgeRoutes);
// app.use("/api/auth", authRoutes);

// // ✅ Pehle DB connect karo, phir server start
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ Connected with Database!");

//     app.listen(PORT, () => {
//       console.log(`✅ Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Failed to connect with DB:", err.message);
//     process.exit(1);
//   }
// };

// connectDB();

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
import mongoose from "mongoose";
import corsMiddleware from "./middleware/cors.js"; // ✅ Import CORS from separate file
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import knowledgeRoutes from "./routes/knowledge.js";

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware - Order matters!
// 1. CORS first
app.use(corsMiddleware);

// 2. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request logging (optional but helpful)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📨 [${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ✅ Health check endpoint — Playwright is endpoint ka wait karta hai
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    server: "SigmaGPT Backend"
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);
app.use("/api/knowledge", knowledgeRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  
  // CORS related error
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Policy Violation",
      message: err.message,
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// ✅ Database connection aur server start
const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected with Database!");

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     🚀 SigmaGPT Backend Started 🚀    ║
╠════════════════════════════════════════╣
║ Port: ${PORT.toString().padEnd(34)} ║
║ Environment: ${(process.env.NODE_ENV || "development").padEnd(26)} ║
║ API Health: /api/health ${" ".repeat(20)} ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error("❌ Failed to connect with MongoDB:", err.message);
    console.error("💡 Make sure:");
    console.error("   1. MongoDB URI is correct in .env file");
    console.error("   2. MongoDB server is running");
    console.error("   3. Network connection is working");
    process.exit(1);
  }
};

// Start the server
connectDB();