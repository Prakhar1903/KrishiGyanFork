// routes/passwordResetRoutes.js
import express from "express";
import {
  requestPasswordReset,
  verifyOTP,
  resetPassword
} from "../controllers/passwordResetController.js";

const router = express.Router();

// Request password reset (send OTP)
router.post("/request", requestPasswordReset);

// Verify OTP
router.post("/verify", verifyOTP);

// Reset password with OTP
router.post("/reset", resetPassword);

export default router;