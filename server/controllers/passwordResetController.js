// controllers/passwordResetController.js - SIMPLIFIED
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateOTP, sendOTPEmail } from "../utils/emailService.js";

// Simple in-memory storage for OTPs
const otpStore = new Map();

// Cleanup function to remove expired OTPs
const cleanupExpiredOTPs = () => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
};

// Run cleanup every minute
setInterval(cleanupExpiredOTPs, 60 * 1000);

// Request password reset (send OTP)
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User with this email not found"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        // Store OTP with email and expiry
        otpStore.set(email, {
            otp,
            expiresAt,
            verified: false
        });

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: "OTP sent to your email",
            email: email
        });
    } catch (err) {
        console.error('Password reset request error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: err.message
        });
    }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Get stored OTP data
        const storedData = otpStore.get(email);
        
        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found. Please request a new one."
            });
        }

        // Check if OTP is expired
        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Mark as verified
        storedData.verified = true;
        otpStore.set(email, storedData);

        res.json({
            success: true,
            message: "OTP verified successfully",
            email: email
        });
    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to verify OTP",
            error: err.message
        });
    }
};

// Reset password with OTP verification
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Get stored OTP data
        const storedData = otpStore.get(email);
        
        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: "Session expired. Please request a new OTP."
            });
        }

        // Check if OTP is verified
        if (!storedData.verified) {
            return res.status(400).json({
                success: false,
                message: "OTP not verified. Please verify OTP first."
            });
        }

        // Verify OTP again for security
        if (storedData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            otpStore.delete(email);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Clear OTP data
        otpStore.delete(email);

        res.json({
            success: true,
            message: "Password reset successful! You can now login with new password"
        });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: err.message
        });
    }
};