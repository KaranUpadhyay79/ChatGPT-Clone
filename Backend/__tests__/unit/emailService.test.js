// import { jest } from "@jest/globals";

// // ✅ ESM mein mock PEHLE define karo, import baad mein
// const mockSend = jest.fn().mockResolvedValue({ id: "email-123" });

// await jest.unstable_mockModule("resend", () => ({
//   Resend: jest.fn().mockImplementation(() => ({
//     emails: {
//       send: mockSend,
//     },
//   })),
// }));

// // ✅ Mock ke BAAD dynamic import — ESM rule
// const emailService = await import("../../services/emailService.js");

// describe("✅ Email Service", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockSend.mockResolvedValue({ id: "email-123" });
//   });

//   // ─────────────────────────────────────────
//   // generateOTP
//   // ─────────────────────────────────────────
//   describe("generateOTP", () => {
//     it("should generate a 6-digit OTP", () => {
//       const otp = emailService.generateOTP();
//       expect(otp).toHaveLength(6);
//       expect(/^\d{6}$/.test(otp)).toBe(true);
//     });

//     it("should always return a string", () => {
//       const otp = emailService.generateOTP();
//       expect(typeof otp).toBe("string");
//     });

//     it("should generate OTP within valid range (100000-999999)", () => {
//       const otps = Array.from({ length: 20 }, () => emailService.generateOTP());
//       otps.forEach((otp) => {
//         const num = parseInt(otp);
//         expect(num).toBeGreaterThanOrEqual(100000);
//         expect(num).toBeLessThanOrEqual(999999);
//       });
//     });

//     it("should always return exactly 6 digits", () => {
//       const otp = emailService.generateOTP();
//       expect(otp).toMatch(/^\d{6}$/);
//     });

//     it("should generate different OTPs on multiple calls", () => {
//       const results = new Set(
//         Array.from({ length: 10 }, () => emailService.generateOTP())
//       );
//       expect(results.size).toBeGreaterThan(1);
//     });
//   });

//   // ─────────────────────────────────────────
//   // sendSignupOTP
//   // ─────────────────────────────────────────
//   describe("sendSignupOTP", () => {
//     it("should send signup OTP email successfully", async () => {
//       await expect(
//         emailService.sendSignupOTP("newuser@example.com", "123456", "johndoe")
//       ).resolves.toBeUndefined();
//       expect(mockSend).toHaveBeenCalledTimes(1);
//     });

//     it("should call resend with correct email address", async () => {
//       await emailService.sendSignupOTP("test@example.com", "654321", "alice");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({ to: "test@example.com" })
//       );
//     });

//     it("should call resend with correct subject", async () => {
//       await emailService.sendSignupOTP("test@example.com", "654321", "alice");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({
//           subject: expect.stringContaining("Verify Your Email"),
//         })
//       );
//     });

//     it("should include OTP in email html", async () => {
//       await emailService.sendSignupOTP("test@example.com", "999888", "bob");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({
//           html: expect.stringContaining("999888"),
//         })
//       );
//     });

//     it("should include username in email html", async () => {
//       await emailService.sendSignupOTP("test@example.com", "123456", "charlie");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({
//           html: expect.stringContaining("charlie"),
//         })
//       );
//     });

//     it("should throw error when resend fails", async () => {
//       mockSend.mockRejectedValueOnce(new Error("SMTP Error"));
//       await expect(
//         emailService.sendSignupOTP("fail@example.com", "123456", "testuser")
//       ).rejects.toThrow("Failed to send signup OTP: SMTP Error");
//     });

//     it("should throw error with meaningful message on network failure", async () => {
//       mockSend.mockRejectedValueOnce(new Error("Network timeout"));
//       await expect(
//         emailService.sendSignupOTP("fail@example.com", "123456", "testuser")
//       ).rejects.toThrow("Failed to send signup OTP");
//     });
//   });

//   // ─────────────────────────────────────────
//   // sendLoginOTP
//   // ─────────────────────────────────────────
//   describe("sendLoginOTP", () => {
//     it("should send login OTP email successfully", async () => {
//       await expect(
//         emailService.sendLoginOTP("user@example.com", "123456", "johndoe")
//       ).resolves.toBeUndefined();
//       expect(mockSend).toHaveBeenCalledTimes(1);
//     });

//     it("should call resend with correct email address", async () => {
//       await emailService.sendLoginOTP("login@example.com", "111222", "dave");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({ to: "login@example.com" })
//       );
//     });

//     it("should call resend with correct subject", async () => {
//       await emailService.sendLoginOTP("login@example.com", "111222", "dave");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({
//           subject: expect.stringContaining("Login OTP"),
//         })
//       );
//     });

//     it("should include OTP in email html", async () => {
//       await emailService.sendLoginOTP("test@example.com", "777666", "eve");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({
//           html: expect.stringContaining("777666"),
//         })
//       );
//     });

//     it("should include username in email html", async () => {
//       await emailService.sendLoginOTP("test@example.com", "123456", "frank");
//       expect(mockSend).toHaveBeenCalledWith(
//         expect.objectContaining({
//           html: expect.stringContaining("frank"),
//         })
//       );
//     });

//     it("should throw error when resend fails", async () => {
//       mockSend.mockRejectedValueOnce(new Error("Network Error"));
//       await expect(
//         emailService.sendLoginOTP("fail@example.com", "123456", "testuser")
//       ).rejects.toThrow("Failed to send login OTP: Network Error");
//     });

//     it("should throw error with meaningful message on API failure", async () => {
//       mockSend.mockRejectedValueOnce(new Error("API rate limit exceeded"));
//       await expect(
//         emailService.sendLoginOTP("fail@example.com", "123456", "testuser")
//       ).rejects.toThrow("Failed to send login OTP");
//     });
//   });
// });

import { jest } from "@jest/globals";

// ✅ Brevo ka mock — sendTransacEmail function mock karo
const mockSendTransacEmail = jest.fn().mockResolvedValue({ messageId: "email-123" });

await jest.unstable_mockModule("@sendinblue/client", () => ({
  default: {
    TransactionalEmailsApi: jest.fn().mockImplementation(() => ({
      setApiKey: jest.fn(),
      sendTransacEmail: mockSendTransacEmail,
    })),
    TransactionalEmailsApiApiKeys: {
      apiKey: "apiKey",
    },
    SendSmtpEmail: jest.fn().mockImplementation(() => ({
      sender: null,
      to: null,
      subject: null,
      htmlContent: null,
    })),
  },
}));

// ✅ Mock ke BAAD dynamic import — ESM rule
const emailService = await import("../../services/emailService.js");

describe("✅ Email Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendTransacEmail.mockResolvedValue({ messageId: "email-123" });
  });

  // ─────────────────────────────────────────
  // generateOTP
  // ─────────────────────────────────────────
  describe("generateOTP", () => {
    it("should generate a 6-digit OTP", () => {
      const otp = emailService.generateOTP();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it("should always return a string", () => {
      const otp = emailService.generateOTP();
      expect(typeof otp).toBe("string");
    });

    it("should generate OTP within valid range (100000-999999)", () => {
      const otps = Array.from({ length: 20 }, () => emailService.generateOTP());
      otps.forEach((otp) => {
        const num = parseInt(otp);
        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThanOrEqual(999999);
      });
    });

    it("should always return exactly 6 digits", () => {
      const otp = emailService.generateOTP();
      expect(otp).toMatch(/^\d{6}$/);
    });

    it("should generate different OTPs on multiple calls", () => {
      const results = new Set(
        Array.from({ length: 10 }, () => emailService.generateOTP())
      );
      expect(results.size).toBeGreaterThan(1);
    });
  });

  // ─────────────────────────────────────────
  // sendSignupOTP
  // ─────────────────────────────────────────
  describe("sendSignupOTP", () => {
    it("should send signup OTP email successfully", async () => {
      await expect(
        emailService.sendSignupOTP("newuser@example.com", "123456", "johndoe")
      ).resolves.toBeUndefined();
      expect(mockSendTransacEmail).toHaveBeenCalledTimes(1);
    });

    it("should call brevo with correct email address", async () => {
      await emailService.sendSignupOTP("test@example.com", "654321", "alice");
      expect(mockSendTransacEmail).toHaveBeenCalledTimes(1);
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.to).toEqual(expect.arrayContaining([
        expect.objectContaining({ email: "test@example.com" })
      ]));
    });

    it("should call brevo with correct subject", async () => {
      await emailService.sendSignupOTP("test@example.com", "654321", "alice");
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.subject).toContain("Verify Your Email");
    });

    it("should include OTP in email html", async () => {
      await emailService.sendSignupOTP("test@example.com", "999888", "bob");
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.htmlContent).toContain("999888");
    });

    it("should include username in email html", async () => {
      await emailService.sendSignupOTP("test@example.com", "123456", "charlie");
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.htmlContent).toContain("charlie");
    });

    it("should throw error when brevo fails", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("SMTP Error"));
      await expect(
        emailService.sendSignupOTP("fail@example.com", "123456", "testuser")
      ).rejects.toThrow("Failed to send signup OTP: SMTP Error");
    });

    it("should throw error with meaningful message on network failure", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Network timeout"));
      await expect(
        emailService.sendSignupOTP("fail@example.com", "123456", "testuser")
      ).rejects.toThrow("Failed to send signup OTP");
    });
  });

  // ─────────────────────────────────────────
  // sendLoginOTP
  // ─────────────────────────────────────────
  describe("sendLoginOTP", () => {
    it("should send login OTP email successfully", async () => {
      await expect(
        emailService.sendLoginOTP("user@example.com", "123456", "johndoe")
      ).resolves.toBeUndefined();
      expect(mockSendTransacEmail).toHaveBeenCalledTimes(1);
    });

    it("should call brevo with correct email address", async () => {
      await emailService.sendLoginOTP("login@example.com", "111222", "dave");
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.to).toEqual(expect.arrayContaining([
        expect.objectContaining({ email: "login@example.com" })
      ]));
    });

    it("should call brevo with correct subject", async () => {
      await emailService.sendLoginOTP("login@example.com", "111222", "dave");
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.subject).toContain("Login OTP");
    });

    it("should include OTP in email html", async () => {
      await emailService.sendLoginOTP("test@example.com", "777666", "eve");
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.htmlContent).toContain("777666");
    });

    it("should include username in email html", async () => {
      await emailService.sendLoginOTP("test@example.com", "123456", "frank");
      const callArg = mockSendTransacEmail.mock.calls[0][0];
      expect(callArg.htmlContent).toContain("frank");
    });

    it("should throw error when brevo fails", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("Network Error"));
      await expect(
        emailService.sendLoginOTP("fail@example.com", "123456", "testuser")
      ).rejects.toThrow("Failed to send login OTP: Network Error");
    });

    it("should throw error with meaningful message on API failure", async () => {
      mockSendTransacEmail.mockRejectedValueOnce(new Error("API rate limit exceeded"));
      await expect(
        emailService.sendLoginOTP("fail@example.com", "123456", "testuser")
      ).rejects.toThrow("Failed to send login OTP");
    });
  });
});