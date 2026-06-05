import cors from "cors";

// ✅ CORS Middleware - Production Ready Configuration
// यह file सभी CORS settings को handle करता है

// Allowed origins - Production aur Development dono ke liye
const allowedOrigins = [
  // Production URLs
  "https://sigmagpt-frontend-lmvt.onrender.com",
  "https://sigmagpt-frontend-lmvt.onrender.com/",
  
  // Local Development URLs
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  
  // Add your custom domain if you have one
  // "https://yourdomain.com",
];

// CORS Options Configuration
const corsOptions = {
  // Origin check
  origin: function (origin, callback) {
    // Log incoming request origin (helpful for debugging)
    if (process.env.NODE_ENV === "development") {
      console.log(`🔍 CORS Check - Request from origin: ${origin || "no-origin"}`);
    }

    // Allow requests with no origin (like mobile apps, curl, Postman, etc.)
    if (!origin) {
      console.log("✅ CORS: Request allowed (no origin)");
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Request allowed from ${origin}`);
      return callback(null, true);
    }

    // Origin not allowed
    console.warn(`⚠️ CORS: Request BLOCKED from ${origin}`);
    return callback(new Error(`CORS policy: origin "${origin}" is not allowed`));
  },

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Allowed HTTP methods
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],

  // Allowed headers in request
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],

  // Headers that can be exposed to client
  exposedHeaders: [
    "Content-Length",
    "X-Total-Count", // useful for pagination
    "X-Page-Number", // useful for pagination
  ],

  // Preflight request cache time (in seconds)
  // 86400 = 24 hours
  maxAge: 86400,

  // Pre-flight success status
  optionsSuccessStatus: 200,
};

// ✅ Create and export the middleware
const corsMiddleware = cors(corsOptions);

// ✅ Alternative: Custom middleware for more control (optional)
const customCorsMiddleware = (req, res, next) => {
  const origin = req.get("origin");

  // Set origin header if allowed
  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    );
    res.header("Access-Control-Max-Age", "86400");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
  } else {
    // Origin not allowed
    if (process.env.NODE_ENV === "development") {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
    }
  }

  next();
};

// ✅ Error handler middleware for CORS errors
const corsErrorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    res.status(403).json({
      error: "CORS Error",
      message: err.message,
      origin: req.get("origin"),
      allowedOrigins: process.env.NODE_ENV === "development" ? allowedOrigins : "***",
    });
  } else {
    next(err);
  }
};

// ✅ Dynamic origin updater (optional - for adding origins at runtime)
const updateAllowedOrigins = (newOrigins) => {
  if (Array.isArray(newOrigins)) {
    allowedOrigins.push(...newOrigins);
    console.log("✅ Allowed origins updated:", allowedOrigins);
  }
};

// ✅ Export all variations
export default corsMiddleware;
export { corsOptions, customCorsMiddleware, corsErrorHandler, updateAllowedOrigins };