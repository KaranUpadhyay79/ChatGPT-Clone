// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import Otp from "../models/Otp.js";
// import { authenticateToken } from "../middleware/auth.js";
// import {
//   generateOTP,
//   sendSignupOTP,
//   sendLoginOTP,
// } from "../services/emailService.js";

// const router = express.Router();

// const getJwtSecret = () => {
//   const secret = process.env.JWT_SECRET;
//   if (!secret) throw new Error("JWT_SECRET is not configured");
//   return secret;
// };

// // ─────────────────────────────────────────────
// // SIGNUP — STEP 1: Details lo, OTP bhejo
// // POST /api/auth/signup/send-otp
// // ─────────────────────────────────────────────
// router.post("/signup/send-otp", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     // Check duplicate
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email or username already taken" });
//     }

//     // Password hash karke OTP ke saath store karo
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const otp = generateOTP();
//     const hashedOtp = await bcrypt.hash(otp, 10);

//     // Purana OTP replace karo (upsert)
//     await Otp.findOneAndUpdate(
//       { email, purpose: "signup" },
//       {
//         email,
//         otp: hashedOtp,
//         purpose: "signup",
//         pendingUser: { username, password: hashedPassword },
//         attempts: 0,
//         createdAt: new Date(),
//       },
//       { upsert: true, new: true }
//     );

//     await sendSignupOTP(email, otp, username);

//     res.status(200).json({
//       message: `OTP sent to ${email}. Valid for 10 minutes.`,
//       email, // Frontend ko wapas bhejo taaki verify step mein use ho
//     });
//   } catch (err) {
//     console.error("Signup OTP error:", err.message);
//     res.status(500).json({ message: "Failed to send OTP. Try again." });
//   }
// });

// // ─────────────────────────────────────────────
// // SIGNUP — STEP 2: OTP verify karo, user banao
// // POST /api/auth/signup/verify-otp
// // ─────────────────────────────────────────────
// router.post("/signup/verify-otp", async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP required" });
//     }

//     const otpRecord = await Otp.findOne({ email, purpose: "signup" });

//     if (!otpRecord) {
//       return res.status(400).json({ message: "OTP expired or not found. Request a new one." });
//     }

//     // Brute force protection
//     if (otpRecord.attempts >= 5) {
//       await Otp.deleteOne({ email, purpose: "signup" });
//       return res.status(429).json({ message: "Too many wrong attempts. Request a new OTP." });
//     }

//     const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);

//     if (!isOtpValid) {
//       await Otp.updateOne({ email, purpose: "signup" }, { $inc: { attempts: 1 } });
//       const remaining = 4 - otpRecord.attempts;
//       return res.status(400).json({ message: `Wrong OTP. ${remaining} attempts left.` });
//     }

//     // ✅ OTP sahi — user create karo
//     const { username, password } = otpRecord.pendingUser;

//     const newUser = await User.create({ username, email, password });

//     // OTP delete karo
//     await Otp.deleteOne({ email, purpose: "signup" });

//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role },
//       getJwtSecret(),
//       { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
//     );

//     res.status(201).json({
//       message: "Account created successfully! 🎉",
//       token,
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (err) {
//     console.error("Signup verify error:", err.message);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // ─────────────────────────────────────────────
// // LOGIN — STEP 1: Email + Password check karo, OTP bhejo
// // POST /api/auth/login/send-otp
// // ─────────────────────────────────────────────
// router.post("/login/send-otp", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "No account found with this email" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     // Password sahi — ab OTP bhejo
//     const otp = generateOTP();
//     const hashedOtp = await bcrypt.hash(otp, 10);

//     await Otp.findOneAndUpdate(
//       { email, purpose: "login" },
//       {
//         email,
//         otp: hashedOtp,
//         purpose: "login",
//         attempts: 0,
//         createdAt: new Date(),
//       },
//       { upsert: true, new: true }
//     );

//     await sendLoginOTP(email, otp, user.username);

//     res.status(200).json({
//       message: `OTP sent to ${email}`,
//       email,
//     });
//   } catch (err) {
//     console.error("Login OTP error:", err.message);
//     res.status(500).json({ message: "Failed to send OTP. Try again." });
//   }
// });

// // ─────────────────────────────────────────────
// // LOGIN — STEP 2: OTP verify karo, token do
// // POST /api/auth/login/verify-otp
// // ─────────────────────────────────────────────
// router.post("/login/verify-otp", async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP required" });
//     }

//     const otpRecord = await Otp.findOne({ email, purpose: "login" });

//     if (!otpRecord) {
//       return res.status(400).json({ message: "OTP expired or not found. Request a new one." });
//     }

//     if (otpRecord.attempts >= 5) {
//       await Otp.deleteOne({ email, purpose: "login" });
//       return res.status(429).json({ message: "Too many wrong attempts. Request a new OTP." });
//     }

//     const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);

//     if (!isOtpValid) {
//       await Otp.updateOne({ email, purpose: "login" }, { $inc: { attempts: 1 } });
//       const remaining = 4 - otpRecord.attempts;
//       return res.status(400).json({ message: `Wrong OTP. ${remaining} attempts left.` });
//     }

//     // ✅ OTP sahi — login karo
//     const user = await User.findOne({ email });
//     await Otp.deleteOne({ email, purpose: "login" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       getJwtSecret(),
//       { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
//     );

//     res.status(200).json({
//       message: "Login successful! ✅",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login verify error:", err.message);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // ─────────────────────────────────────────────
// // OTP RESEND (dono ke liye)
// // POST /api/auth/resend-otp
// // ─────────────────────────────────────────────
// router.post("/resend-otp", async (req, res) => {
//   try {
//     const { email, purpose } = req.body; // purpose: "signup" | "login"

//     if (!email || !purpose) {
//       return res.status(400).json({ message: "Email and purpose required" });
//     }

//     if (purpose === "signup") {
//       const existingOtp = await Otp.findOne({ email, purpose: "signup" });
//       if (!existingOtp?.pendingUser) {
//         return res.status(400).json({ message: "No pending signup. Start again." });
//       }

//       const otp = generateOTP();
//       const hashedOtp = await bcrypt.hash(otp, 10);
//       await Otp.findOneAndUpdate(
//         { email, purpose: "signup" },
//         { otp: hashedOtp, attempts: 0, createdAt: new Date() }
//       );
//       await sendSignupOTP(email, otp, existingOtp.pendingUser.username);
//     }

//     if (purpose === "login") {
//       const user = await User.findOne({ email });
//       if (!user) return res.status(404).json({ message: "User not found" });

//       const otp = generateOTP();
//       const hashedOtp = await bcrypt.hash(otp, 10);
//       await Otp.findOneAndUpdate(
//         { email, purpose: "login" },
//         { otp: hashedOtp, attempts: 0, createdAt: new Date() },
//         { upsert: true }
//       );
//       await sendLoginOTP(email, otp, user.username);
//     }

//     res.status(200).json({ message: "New OTP sent successfully" });
//   } catch (err) {
//     console.error("Resend OTP error:", err.message);
//     res.status(500).json({ message: "Failed to resend OTP" });
//   }
// });

// // ─────────────────────────────────────────────
// // GET CURRENT USER (Protected)
// // GET /api/auth/me
// // ─────────────────────────────────────────────
// router.get("/me", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user" });
//   }
// });

// export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  generateOTP,
  sendSignupOTP,
  sendLoginOTP,
} from "../services/emailService.js";

const router = express.Router();

// ✅ TEST_MODE mein fixed OTP use hota hai — real email nahi jati
const IS_TEST_MODE = process.env.NODE_ENV === "test" || process.env.TEST_MODE === "true";
const TEST_OTP = "123456";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
};

// ─────────────────────────────────────────────
// SIGNUP — STEP 1: Details lo, OTP bhejo
// POST /api/auth/signup/send-otp
// ─────────────────────────────────────────────
router.post("/signup/send-otp", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already taken" });
    }

    // Around line 42, after the existingUser check, ADD THIS:
   const existingOtp = await Otp.findOne({ email, purpose: "signup" });
    if (existingOtp) {
     return res.status(400).json({ message: "Email already taken or OTP already sent" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ TEST_MODE mein fixed OTP, production mein random
    const otp = IS_TEST_MODE ? TEST_OTP : generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { email, purpose: "signup" },
      {
        email,
        otp: hashedOtp,
        purpose: "signup",
        pendingUser: { username, password: hashedPassword },
        attempts: 0,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // ✅ TEST_MODE mein email mat bhejo
    if (!IS_TEST_MODE) {
      await sendSignupOTP(email, otp, username);
    }

    res.status(200).json({
      message: `OTP sent to ${email}. Valid for 10 minutes.`,
      email,
    });
  } catch (err) {
    console.error("Signup OTP error:", err.message);
    res.status(500).json({ message: "Failed to send OTP. Try again." });
  }
});

// ─────────────────────────────────────────────
// SIGNUP — STEP 2: OTP verify karo, user banao
// POST /api/auth/signup/verify-otp
// ─────────────────────────────────────────────
router.post("/signup/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const otpRecord = await Otp.findOne({ email, purpose: "signup" });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found. Request a new one." });
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ email, purpose: "signup" });
      return res.status(429).json({ message: "Too many wrong attempts. Request a new OTP." });
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isOtpValid) {
      await Otp.updateOne({ email, purpose: "signup" }, { $inc: { attempts: 1 } });
      const remaining = 4 - otpRecord.attempts;
      return res.status(400).json({ message: `Wrong OTP. ${remaining} attempts left.` });
    }

    const { username, password } = otpRecord.pendingUser;
    const newUser = await User.create({ username, email, password });

    await Otp.deleteOne({ email, purpose: "signup" });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({
      message: "Account created successfully! 🎉",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup verify error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ─────────────────────────────────────────────
// LOGIN — STEP 1: Email + Password check karo, OTP bhejo
// POST /api/auth/login/send-otp
// ─────────────────────────────────────────────
router.post("/login/send-otp", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const otp = IS_TEST_MODE ? TEST_OTP : generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
      { email, purpose: "login" },
      {
        email,
        otp: hashedOtp,
        purpose: "login",
        attempts: 0,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    if (!IS_TEST_MODE) {
      await sendLoginOTP(email, otp, user.username);
    }

    res.status(200).json({
      message: `OTP sent to ${email}`,
      email,
    });
  } catch (err) {
    console.error("Login OTP error:", err.message);
    res.status(500).json({ message: "Failed to send OTP. Try again." });
  }
});

// ─────────────────────────────────────────────
// LOGIN — STEP 2: OTP verify karo, token do
// POST /api/auth/login/verify-otp
// ─────────────────────────────────────────────
router.post("/login/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const otpRecord = await Otp.findOne({ email, purpose: "login" });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found. Request a new one." });
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ email, purpose: "login" });
      return res.status(429).json({ message: "Too many wrong attempts. Request a new OTP." });
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);

    if (!isOtpValid) {
      await Otp.updateOne({ email, purpose: "login" }, { $inc: { attempts: 1 } });
      const remaining = 4 - otpRecord.attempts;
      return res.status(400).json({ message: `Wrong OTP. ${remaining} attempts left.` });
    }

    const user = await User.findOne({ email });
    await Otp.deleteOne({ email, purpose: "login" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Login successful! ✅",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login verify error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ─────────────────────────────────────────────
// OTP RESEND
// POST /api/auth/resend-otp
// ─────────────────────────────────────────────
router.post("/resend-otp", async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return res.status(400).json({ message: "Email and purpose required" });
    }

    if (purpose === "signup") {
      const existingOtp = await Otp.findOne({ email, purpose: "signup" });
      if (!existingOtp?.pendingUser) {
        return res.status(400).json({ message: "No pending signup. Start again." });
      }

      const otp = IS_TEST_MODE ? TEST_OTP : generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      await Otp.findOneAndUpdate(
        { email, purpose: "signup" },
        { otp: hashedOtp, attempts: 0, createdAt: new Date() }
      );

      if (!IS_TEST_MODE) {
        await sendSignupOTP(email, otp, existingOtp.pendingUser.username);
      }
    }

    if (purpose === "login") {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const otp = IS_TEST_MODE ? TEST_OTP : generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      await Otp.findOneAndUpdate(
        { email, purpose: "login" },
        { otp: hashedOtp, attempts: 0, createdAt: new Date() },
        { upsert: true }
      );

      if (!IS_TEST_MODE) {
        await sendLoginOTP(email, otp, user.username);
      }
    }

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});

// ─────────────────────────────────────────────
// GET CURRENT USER (Protected)
// GET /api/auth/me
// ─────────────────────────────────────────────
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

export default router;