// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";

// // const AuthPage = () => {
// //   const [isLogin, setIsLogin] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [status, setStatus] = useState({ type: "", message: "" });

// //   const navigate = useNavigate();

// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (loading) return;

// //     setLoading(true);
// //     setStatus({});

// //     const baseUrl = "http://localhost:8080/api/auth";
// //     const endpoint = isLogin ? "/login" : "/signup";

// //     try {
// //       const res = await axios.post(baseUrl + endpoint, formData);

// //       if (isLogin) {
// //         localStorage.setItem("token", res.data.token);
// //         localStorage.setItem("user", JSON.stringify(res.data.user));

// //         setStatus({ type: "success", message: "Login Successful!" });

// //         setTimeout(() => navigate("/dashboard"), 1500);
// //       } else {
// //         setStatus({ type: "success", message: "Account Created!" });
// //         setIsLogin(true);
// //       }
// //     } catch (err) {
// //       setStatus({
// //         type: "error",
// //         message:
// //           err.response?.data?.message || "Server connection failed",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-[#0b1220] p-6">

// //       {/* MAIN CARD */}
// //       <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl">

// //         {/* LEFT AI PANEL */}
// //         <div className="hidden md:flex w-1/2 bg-[#020617] items-center justify-center p-10">
// //           <img
// //             src="/ai.png"
// //             alt="AI"
// //             className="w-full object-contain"
// //           />
// //         </div>

// //         {/* RIGHT FORM PANEL */}
// //         <div className="w-full md:w-1/2 bg-gray-200 p-10">

// //           {/* Tabs */}
// //           <div className="flex bg-gray-300 rounded-full p-1 mb-6">
// //             <button
// //               onClick={() => setIsLogin(true)}
// //               className={`flex-1 py-2 rounded-full font-semibold ${
// //                 isLogin ? "bg-black text-white" : ""
// //               }`}
// //             >
// //               Sign In
// //             </button>

// //             <button
// //               onClick={() => setIsLogin(false)}
// //               className={`flex-1 py-2 rounded-full font-semibold ${
// //                 !isLogin ? "bg-black text-white" : ""
// //               }`}
// //             >
// //               Sign Up
// //             </button>
// //           </div>

// //           {/* Status */}
// //           {status.message && (
// //             <div
// //               className={`mb-4 text-center text-sm ${
// //                 status.type === "success"
// //                   ? "text-green-600"
// //                   : "text-red-600"
// //               }`}
// //             >
// //               {status.message}
// //             </div>
// //           )}

// //           {/* FORM */}
// //           <form onSubmit={handleSubmit} className="space-y-4">

// //             {!isLogin && (
// //               <input
// //                 name="username"
// //                 placeholder="Username"
// //                 required
// //                 value={formData.username}
// //                 onChange={handleChange}
// //                 className="w-full p-3 rounded-lg border"
// //               />
// //             )}

// //             <input
// //               name="email"
// //               type="email"
// //               placeholder="Email Address"
// //               required
// //               value={formData.email}
// //               onChange={handleChange}
// //               className="w-full p-3 rounded-lg border"
// //             />

// //             <input
// //               name="password"
// //               type="password"
// //               placeholder="Password"
// //               required
// //               value={formData.password}
// //               onChange={handleChange}
// //               className="w-full p-3 rounded-lg border"
// //             />

// //             <button
// //               disabled={loading}
// //               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
// //             >
// //               {loading
// //                 ? "Processing..."
// //                 : isLogin
// //                 ? "SIGN IN"
// //                 : "SIGN UP"}
// //             </button>
// //           </form>

// //           {/* Social */}
// //           <div className="text-center my-4 text-gray-500">OR</div>

// //           <div className="flex gap-3">
// //             <button className="flex-1 border p-3 rounded-lg">
// //               Google
// //             </button>
// //             <button className="flex-1 border p-3 rounded-lg">
// //               Github
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthPage;

// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import aiImage from "./assets/blacklogo.png";

// // const AuthPage = () => {
// //   const [isLogin, setIsLogin] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [status, setStatus] = useState({ type: "", message: "" });

// //   const navigate = useNavigate();

// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (loading) return;

// //     setLoading(true);
// //     setStatus({});

// //     const baseUrl = "http://localhost:8080/api/auth";
// //     const endpoint = isLogin ? "/login" : "/signup";

// //     try {
// //       const res = await axios.post(baseUrl + endpoint, formData);

// //       if (isLogin) {
// //         localStorage.setItem("token", res.data.token);
// //         localStorage.setItem("user", JSON.stringify(res.data.user));

// //         setStatus({ type: "success", message: "Login Successful!" });

// //         setTimeout(() => navigate("/dashboard"), 1500);
// //       } else {
// //         setStatus({ type: "success", message: "Account Created!" });
// //         setIsLogin(true);
// //       }
// //     } catch (err) {
// //       setStatus({
// //         type: "error",
// //         message:
// //           err.response?.data?.message || "Server connection failed",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen w-full flex bg-[#020d26]">

// //       {/* MAIN CARD */}
// //       <div className="w-full max-w-5xl flex shadow-2xl rounded-3xl overflow-hidden m-auto">

// //         {/* LEFT SIDE (AI Image) */}
// //         <div className="w-1/2 flex items-center justify-center bg-[#020617] p-10">
// //           <img src={aiImage} alt="AI" className="max-w-md w-full object-contain" />
// //         </div>

// //         {/* RIGHT SIDE (Form) */}
// //         <div className="w-1/2 flex items-center justify-center bg-gray-100 rounded-l-3xl p-10">
// //           <div className="w-full">

// //             {/* Tabs */}
// //             <div className="flex bg-gray-300 rounded-full p-1 mb-6">
// //               <button
// //                 onClick={() => setIsLogin(true)}
// //                 className={`flex-1 py-2 rounded-full font-semibold ${
// //                   isLogin ? "bg-black text-white" : ""
// //                 }`}
// //               >
// //                 Sign In
// //               </button>

// //               <button
// //                 onClick={() => setIsLogin(false)}
// //                 className={`flex-1 py-2 rounded-full font-semibold ${
// //                   !isLogin ? "bg-black text-white" : ""
// //                 }`}
// //               >
// //                 Sign Up
// //               </button>
// //             </div>

// //             {/* Status */}
// //             {status.message && (
// //               <div
// //                 className={`mb-4 text-center text-sm ${
// //                   status.type === "success"
// //                     ? "text-green-600"
// //                     : "text-red-600"
// //                 }`}
// //               >
// //                 {status.message}
// //               </div>
// //             )}

// //             {/* FORM */}
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               {!isLogin && (
// //                 <input
// //                   name="username"
// //                   placeholder="Username"
// //                   required
// //                   value={formData.username}
// //                   onChange={handleChange}
// //                   className="w-full p-3 rounded-lg border"
// //                 />
// //               )}

// //               <input
// //                 name="email"
// //                 type="email"
// //                 placeholder="Email Address"
// //                 required
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 className="w-full p-3 rounded-lg border"
// //               />

// //               <input
// //                 name="password"
// //                 type="password"
// //                 placeholder="Password"
// //                 required
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 className="w-full p-3 rounded-lg border"
// //               />

// //               <button
// //                 disabled={loading}
// //                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
// //               >
// //                 {loading
// //                   ? "Processing..."
// //                   : isLogin
// //                   ? "SIGN IN"
// //                   : "SIGN UP"}
// //               </button>
// //             </form>

// //             {/* Social */}
// //             <div className="text-center my-4 text-gray-500">OR</div>

// //             <div className="flex gap-3">
// //               <button className="flex-1 border p-3 rounded-lg">
// //                 Google
// //               </button>
// //               <button className="flex-1 border p-3 rounded-lg">
// //                 Github
// //               </button>
// //             </div>

// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthPage;


// // import React, { useState } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import axios from "axios";
// // import aiImage from "./assets/blacklogo.png";

// // const AuthPage = () => {
// //   const [isLogin, setIsLogin] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [status, setStatus] = useState({ type: "", message: "" });
  
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const alertMsg = location.state?.alert;

// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (loading) return;
// //     setLoading(true);
// //     setStatus({});

// //     const baseUrl = "http://localhost:8080/api/auth";
// //     const endpoint = isLogin ? "/login" : "/signup";

// //     try {
// //       const res = await axios.post(baseUrl + endpoint, formData);
// //       if (isLogin) {
// //         localStorage.setItem("token", res.data.token);
// //         localStorage.setItem("user", JSON.stringify(res.data.user));
// //         setStatus({ type: "success", message: "Login Successful!" });
// //         setTimeout(() => navigate("/dashboard"), 1500);
// //       } else {
// //         setStatus({ type: "success", message: "Account Created! Please Login." });
// //         setIsLogin(true);
// //       }
// //     } catch (err) {
// //       setStatus({
// //         type: "error",
// //         message: err.response?.data?.message || "Server connection failed",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen w-full flex bg-[#020d26] p-4 relative overflow-hidden">
      
// //       {/* Access Denied Alert */}
// //       {alertMsg && (
// //         <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce font-bold">
// //           🛑 {alertMsg}
// //         </div>
// //       )}

// //       {/* MAIN CARD */}
// //       <div className="w-full max-w-5xl flex bg-[#0f172a]/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[40px] overflow-hidden m-auto min-h-[600px]">

// //         {/* LEFT SIDE (AI Image) */}
// //         <div className="hidden md:flex w-1/2 items-center justify-center bg-[#020617]/80 p-10">
// //           <img src={aiImage} alt="AI" className="max-w-md w-full object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
// //         </div>

// //         {/* RIGHT SIDE (Form) */}
// //         <div className="w-full md:w-1/2 flex items-center justify-center bg-white rounded-[35px] m-2 md:m-4 p-8 md:p-12">
// //           <div className="w-full max-w-sm">

// //             {/* Tabs */}
// //             <div className="flex bg-gray-100 rounded-full p-1.5 mb-8 border border-gray-200">
// //               <button
// //                 onClick={() => setIsLogin(true)}
// //                 className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${
// //                   isLogin ? "bg-black text-white shadow-lg" : "text-gray-500 hover:text-black"
// //                 }`}
// //               >
// //                 Sign In
// //               </button>
// //               <button
// //                 onClick={() => setIsLogin(false)}
// //                 className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${
// //                   !isLogin ? "bg-black text-white shadow-lg" : "text-gray-500 hover:text-black"
// //                 }`}
// //               >
// //                 Sign Up
// //               </button>
// //             </div>

// //             {/* Status Messages */}
// //             {status.message && (
// //               <div className={`mb-6 p-3 rounded-xl text-center text-xs font-bold ${
// //                 status.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
// //               }`}>
// //                 {status.message}
// //               </div>
// //             )}

// //             {/* FORM */}
// //             <form onSubmit={handleSubmit} className="space-y-5">
// //               {!isLogin && (
// //                 <div className="space-y-1">
// //                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
// //                   <input
// //                     name="username"
// //                     placeholder="johndoe_123"
// //                     required
// //                     value={formData.username}
// //                     onChange={handleChange}
// //                     className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
// //                   />
// //                 </div>
// //               )}

// //               <div className="space-y-1">
// //                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
// //                 <input
// //                   name="email"
// //                   type="email"
// //                   placeholder="name@example.com"
// //                   required
// //                   value={formData.email}
// //                   onChange={handleChange}
// //                   className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
// //                 />
// //               </div>

// //               <div className="space-y-1">
// //                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
// //                 <input
// //                   name="password"
// //                   type="password"
// //                   placeholder="••••••••"
// //                   required
// //                   value={formData.password}
// //                   onChange={handleChange}
// //                   className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
// //                 />
// //               </div>

// //               <button
// //                 disabled={loading}
// //                 className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl ${
// //                   loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-[1.01]"
// //                 }`}
// //               >
// //                 {loading ? "PROCESSING..." : isLogin ? "SIGN IN" : "GET STARTED"}
// //               </button>
// //             </form>

// //             <div className="relative flex py-6 items-center">
// //               <div className="flex-grow border-t border-gray-200"></div>
// //               <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-tighter">OR</span>
// //               <div className="flex-grow border-t border-gray-200"></div>
// //             </div>

// //             <div className="flex gap-4">
// //               <button className="flex-1 border border-gray-200 p-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-xs">
// //                 <span className="text-lg">G</span> Google
// //               </button>
// //               <button className="flex-1 border border-gray-200 p-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-xs">
// //                 <span className="text-lg">P</span> Github
// //               </button>
// //             </div>

// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthPage;

// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import aiImage from "./assets/blacklogo.png";
// import "./AuthPage.css";

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({});

//   const navigate = useNavigate();
//   const location = useLocation();
//   const alertMsg = location.state?.alert;

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);
//     setStatus({});

//     const baseUrl = "http://localhost:8080/api/auth";
//     const endpoint = isLogin ? "/login" : "/signup";

//     try {
//       const res = await axios.post(baseUrl + endpoint, formData);

//       if (isLogin) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("user", JSON.stringify(res.data.user));

//         setStatus({ type: "success", message: "Login Successful!" });

//         setTimeout(() => navigate("/dashboard"), 1500);
//       } else {
//         setStatus({
//           type: "success",
//           message: "Account Created! Please Login.",
//         });
//         setIsLogin(true);
//       }
//     } catch (err) {
//       setStatus({
//         type: "error",
//         message:
//           err.response?.data?.message || "Server connection failed",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">

//       {alertMsg && (
//         <div className="alert-msg">🛑 {alertMsg}</div>
//       )}

//       <div className="auth-card">

//         {/* LEFT IMAGE */}
//         <div className="auth-left">
//           <img src={aiImage} alt="AI" />
//         </div>

//         {/* RIGHT FORM */}
//         <div className="auth-right">
//           <div className="auth-right-inner">

//             {/* Tabs */}
//             <div className="auth-tabs">
//               <div
//                 onClick={() => setIsLogin(true)}
//                 className={`auth-tab ${isLogin ? "active" : "inactive"}`}
//               >
//                 Sign In
//               </div>

//               <div
//                 onClick={() => setIsLogin(false)}
//                 className={`auth-tab ${!isLogin ? "active" : "inactive"}`}
//               >
//                 Sign Up
//               </div>
//             </div>

//             {/* Status */}
//             {status.message && (
//               <div
//                 className={`status-message ${
//                   status.type === "success"
//                     ? "status-success"
//                     : "status-error"
//                 }`}
//               >
//                 {status.message}
//               </div>
//             )}

//             {/* FORM */}
//             <form onSubmit={handleSubmit}>

//               {!isLogin && (
//                 <div className="input-group">
//                   <label className="input-label">Full Name</label>
//                   <input
//                     type="text"
//                     name="username"
//                     placeholder=" "
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="auth-input"
//                     required
//                   />
//                 </div>
//               )}

//               <div className="input-group">
//                 <label className="input-label">Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder=" "
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="auth-input"
//                   required
//                 />
//               </div>

//               <div className="input-group">
//                 <label className="input-label">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder=" "
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="auth-input"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`auth-button ${
//                   loading ? "disabled" : "active"
//                 }`}
//               >
//                 {loading
//                   ? "PROCESSING..."
//                   : isLogin
//                   ? "SIGN IN"
//                   : "GET STARTED"}
//               </button>
//             </form>

//             {/* OR */}
//             <div className="auth-or">
//               <div></div>
//               <span>OR</span>
//               <div></div>
//             </div>

//             {/* SOCIAL */}
//             <div className="auth-socials">
//               <button>G Google</button>
//               <button>P Github</button>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AuthPage;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import aiImage from "./assets/blacklogo.png";
import "./AuthPage.css";

// const BASE_URL = "http://localhost:8080/api/auth";

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : "http://localhost:8080/api/auth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [showAlert, setShowAlert] = useState(true);

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const alertMsg = location.state?.alert;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (alertMsg) {
      const t = setTimeout(() => setShowAlert(false), 4000);
      return () => clearTimeout(t);
    }
  }, [alertMsg]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({});
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const switchTab = (loginMode) => {
    setIsLogin(loginMode);
    setStatus({});
    setFormData({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus({});
    const endpoint = isLogin ? "/login/send-otp" : "/signup/send-otp";
    try {
      await axios.post(BASE_URL + endpoint, formData);
      setPendingEmail(formData.email);
      setStatus({ type: "success", message: `OTP sent to ${formData.email}` });
      setStep(2);
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Server se connect nahi ho paya",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setStatus({ type: "error", message: "Please enter all 6 digits" });
      return;
    }
    if (loading) return;
    setLoading(true);
    setStatus({});
    const endpoint = isLogin ? "/login/verify-otp" : "/signup/verify-otp";
    try {
      const res = await axios.post(BASE_URL + endpoint, {
        email: pendingEmail,
        otp: otpString,
      });
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setStatus({ type: "success", message: "Login successful! Redirecting..." });
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setStatus({ type: "success", message: "Account created! Please sign in." });
        setTimeout(() => {
          setStep(1);
          setIsLogin(true);
          setOtp(["", "", "", "", "", ""]);
          setFormData({ username: "", email: "", password: "" });
          setStatus({});
        }, 1500);
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Invalid OTP",
      });
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    setStatus({});
    try {
      await axios.post(BASE_URL + "/resend-otp", {
        email: pendingEmail,
        purpose: isLogin ? "login" : "signup",
      });
      setStatus({ type: "success", message: "New OTP sent!" });
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setStatus({});
  };

  const otpStyle = {
    color: "#000000",
    WebkitTextFillColor: "#000000",
    opacity: 1,
    fontSize: "26px",
    fontWeight: "800",
  };

  return (
    <div className="auth-page">
      {alertMsg && showAlert && (
        <div className="auth-alert">
          <span className="auth-alert-icon">⚠</span>
          {alertMsg}
        </div>
      )}

      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-left-content">
            <img src={aiImage} alt="SigmaGPT AI" className="auth-logo" />
            <div className="auth-left-text">
              <h1>SigmaGPT</h1>
              <p>Your intelligent AI assistant. Secure, fast, and always ready.</p>
            </div>
            <div className="auth-left-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-right-inner">

            {step === 1 ? (
              <>
                <div className="auth-tabs">
                  <button type="button" onClick={() => switchTab(true)} className={`auth-tab ${isLogin ? "active" : ""}`}>
                    Sign In
                  </button>
                  <button type="button" onClick={() => switchTab(false)} className={`auth-tab ${!isLogin ? "active" : ""}`}>
                    Sign Up
                  </button>
                </div>

                <div className="auth-heading">
                  <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
                  <p>{isLogin ? "Sign in to continue to SigmaGPT" : "Join SigmaGPT for free"}</p>
                </div>

                {status.message && (
                  <div className={`auth-status ${status.type}`}>
                    <span className="status-icon">{status.type === "success" ? "✓" : "✕"}</span>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                  {!isLogin && (
                    <div className="input-wrap">
                      <input type="text" name="username" placeholder=" " value={formData.username} onChange={handleChange} className="auth-input" autoComplete="name" required />
                      <label className="auth-label">Full Name</label>
                    </div>
                  )}
                  <div className="input-wrap">
                    <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} className="auth-input" autoComplete="email" required />
                    <label className="auth-label">Email Address</label>
                  </div>
                  <div className="input-wrap">
                    <input type="password" name="password" placeholder=" " value={formData.password} onChange={handleChange} className="auth-input" autoComplete={isLogin ? "current-password" : "new-password"} required />
                    <label className="auth-label">Password</label>
                  </div>
                  <button type="submit" disabled={loading} className="auth-btn">
                    {loading ? <span className="btn-spinner"></span> : (isLogin ? "Send OTP to Sign In" : "Send OTP to Register")}
                  </button>
                </form>

                
                </>
            ) : (
              <div className="otp-section">
                <button type="button" onClick={goBack} className="otp-back-btn">← Back</button>

                <div className="otp-header">
                  <div className="otp-icon">✉</div>
                  <h2>Check your email</h2>
                  <p>We sent a 6-digit code to<br /><strong>{pendingEmail}</strong></p>
                </div>

                {status.message && (
                  <div className={`auth-status ${status.type}`}>
                    <span className="status-icon">{status.type === "success" ? "✓" : "✕"}</span>
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="auth-form">
                  <div className="otp-boxes" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`otp-box ${digit ? "filled" : ""}`}
                        style={otpStyle}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className={`auth-btn ${otp.join("").length < 6 ? "muted" : ""}`}
                  >
                    {loading ? <span className="btn-spinner"></span> : "Verify OTP"}
                  </button>
                </form>

                <div className="otp-resend">
                  {resendTimer > 0 ? (
                    <span className="resend-timer">Resend in {resendTimer}s</span>
                  ) : (
                    <button type="button" onClick={handleResend} disabled={loading} className="resend-btn">
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;