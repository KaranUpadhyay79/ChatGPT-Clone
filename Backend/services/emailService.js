// // import { Resend } from "resend";

// // // ✅ Resend client
// // const resend = new Resend(process.env.RESEND_API_KEY);

// // // ✅ 6-digit OTP generate
// // export const generateOTP = () => {
// //   return Math.floor(100000 + Math.random() * 900000).toString();
// // };

// // // ✅ Signup OTP Email
// // export const sendSignupOTP = async (email, otp, username) => {
// //   await resend.emails.send({
// //     from: "onboarding@resend.dev", // Free plan mein yahi use hoga
// //     to: email,
// //     subject: "SigmaGPT — Verify Your Email",
// //     html: `
// //       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
// //         <h2 style="color: #111827; margin-bottom: 8px;">Welcome to SigmaGPT, ${username}! 👋</h2>
// //         <p style="color: #6b7280;">Use the OTP below to verify your email and complete signup.</p>

// //         <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
// //           <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP</p>
// //           <h1 style="margin: 8px 0; color: #111827; font-size: 42px; letter-spacing: 8px;">${otp}</h1>
// //           <p style="margin: 0; color: #9ca3af; font-size: 12px;">Valid for 10 minutes</p>
// //         </div>

// //         <p style="color: #6b7280; font-size: 13px;">If you didn't request this, ignore this email.</p>
// //       </div>
// //     `,
// //   });
// // };

// // // ✅ Login OTP Email
// // export const sendLoginOTP = async (email, otp, username) => {
// //   await resend.emails.send({
// //     from: "onboarding@resend.dev", // Free plan mein yahi use hoga
// //     to: email,
// //     subject: "SigmaGPT — Login OTP",
// //     html: `
// //       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
// //         <h2 style="color: #111827; margin-bottom: 8px;">Login Request</h2>
// //         <p style="color: #6b7280;">Hi ${username}, use this OTP to log in to SigmaGPT.</p>

// //         <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
// //           <p style="margin: 0; color: #6b7280; font-size: 14px;">Your Login OTP</p>
// //           <h1 style="margin: 8px 0; color: #111827; font-size: 42px; letter-spacing: 8px;">${otp}</h1>
// //           <p style="margin: 0; color: #9ca3af; font-size: 12px;">Valid for 10 minutes</p>
// //         </div>

// //         <p style="color: #ef4444; font-size: 13px;">⚠️ Never share this OTP with anyone.</p>
// //       </div>
// //     `,
// //   });



// import { Resend } from "resend";

// // ✅ Resend client
// const resend = new Resend(process.env.RESEND_API_KEY);

// const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
// const APP_NAME = "SigmaGPT";

// // ✅ 6-digit OTP generate
// export const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // ✅ Signup OTP Email
// export const sendSignupOTP = async (email, otp, username) => {
//   try {
//     await resend.emails.send({
//       from: FROM_EMAIL,
//       to: email,
//       subject: `${APP_NAME} — Verify Your Email`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
//           <h2 style="color: #111827; margin-bottom: 8px;">Welcome to ${APP_NAME}, ${username}! 👋</h2>
//           <p style="color: #6b7280;">Use the OTP below to verify your email and complete signup.</p>

//           <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
//             <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP</p>
//             <h1 style="margin: 8px 0; color: #111827; font-size: 42px; letter-spacing: 8px;">${otp}</h1>
//             <p style="margin: 0; color: #9ca3af; font-size: 12px;">Valid for 10 minutes</p>
//           </div>

//           <p style="color: #6b7280; font-size: 13px;">If you didn't request this, ignore this email.</p>
//         </div>
//       `,
//     });
//   } catch (error) {
//     console.error(`[EmailService] Failed to send signup OTP to ${email}:`, error.message);
//     throw new Error(`Failed to send signup OTP: ${error.message}`);
//   }
// };

// // ✅ Login OTP Email
// export const sendLoginOTP = async (email, otp, username) => {
//   try {
//     await resend.emails.send({
//       from: FROM_EMAIL,
//       to: email,
//       subject: `${APP_NAME} — Login OTP`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
//           <h2 style="color: #111827; margin-bottom: 8px;">Login Request</h2>
//           <p style="color: #6b7280;">Hi ${username}, use this OTP to log in to ${APP_NAME}.</p>

//           <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
//             <p style="margin: 0; color: #6b7280; font-size: 14px;">Your Login OTP</p>
//             <h1 style="margin: 8px 0; color: #111827; font-size: 42px; letter-spacing: 8px;">${otp}</h1>
//             <p style="margin: 0; color: #9ca3af; font-size: 12px;">Valid for 10 minutes</p>
//           </div>

//           <p style="color: #ef4444; font-size: 13px;">⚠️ Never share this OTP with anyone.</p>
//         </div>
//       `,
//     });
//   } catch (error) {
//     console.error(`[EmailService] Failed to send login OTP to ${email}:`, error.message);
//     throw new Error(`Failed to send login OTP: ${error.message}`);
//   }
// };


import SibApiV3Sdk from "@sendinblue/client";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const SENDER = {
  name: "SigmaGPT",
  email: process.env.BREVO_SENDER_EMAIL,
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendSignupOTP = async (email, otp, username) => {
  try {
    const mail = new SibApiV3Sdk.SendSmtpEmail();
    mail.sender = SENDER;
    mail.to = [{ email }];
    mail.subject = "SigmaGPT — Verify Your Email";
    mail.htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#111827;">Welcome to SigmaGPT, ${username}! 👋</h2>
        <p style="color:#6b7280;">Use the OTP below to verify your email.</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
          <p style="margin:0;color:#6b7280;font-size:14px;">Your OTP</p>
          <h1 style="margin:8px 0;color:#111827;font-size:42px;letter-spacing:8px;">${otp}</h1>
          <p style="margin:0;color:#9ca3af;font-size:12px;">Valid for 10 minutes</p>
        </div>
        <p style="color:#6b7280;font-size:13px;">If you didn't request this, ignore this email.</p>
      </div>
    `;
    await apiInstance.sendTransacEmail(mail);
  } catch (error) {
    throw new Error(`Failed to send signup OTP: ${error.message}`);
  }
};

export const sendLoginOTP = async (email, otp, username) => {
  try {
    const mail = new SibApiV3Sdk.SendSmtpEmail();
    mail.sender = SENDER;
    mail.to = [{ email }];
    mail.subject = "SigmaGPT — Login OTP";
    mail.htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#111827;">Login Request</h2>
        <p style="color:#6b7280;">Hi ${username}, use this OTP to log in.</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
          <p style="margin:0;color:#6b7280;font-size:14px;">Your Login OTP</p>
          <h1 style="margin:8px 0;color:#111827;font-size:42px;letter-spacing:8px;">${otp}</h1>
          <p style="margin:0;color:#9ca3af;font-size:12px;">Valid for 10 minutes</p>
        </div>
        <p style="color:#ef4444;font-size:13px;">⚠️ Never share this OTP with anyone.</p>
      </div>
    `;
    await apiInstance.sendTransacEmail(mail);
  } catch (error) {
    throw new Error(`Failed to send login OTP: ${error.message}`);
  }
};