// utils/emailService.js - UPDATED (Fixed crypto methods)
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ KEEP THIS EXISTING FUNCTION
export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"KRISHIGNAN" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// ✅ UPDATED OTP FUNCTIONS WITH FIXED CRYPTO

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate key from JWT_SECRET
const getCryptoKey = () => {
    return crypto.createHash('sha256').update(process.env.JWT_SECRET).digest();
};

// Generate encrypted token containing OTP and expiry
export const generateOTPToken = (email, otp) => {
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    const data = `${email}:${otp}:${expiry}`;
    
    // Create initialization vector
    const iv = crypto.randomBytes(16);
    const key = getCryptoKey();
    
    // Encrypt the data using newer crypto methods
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data
    return iv.toString('hex') + ':' + encrypted;
};

// Decrypt and verify OTP token
export const verifyOTPToken = (token, email, otp) => {
    try {
        // Split IV and encrypted data
        const [ivHex, encrypted] = token.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const key = getCryptoKey();
        
        // Decrypt the token
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        // Parse the data
        const [storedEmail, storedOTP, expiry] = decrypted.split(':');
        
        // Verify
        if (storedEmail !== email || storedOTP !== otp) {
            return false;
        }
        
        // Check expiry
        if (Date.now() > parseInt(expiry)) {
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
};

// Send OTP Email using existing sendEmail function
// Update the OTP email template in utils/emailService.js
export const sendOTPEmail = async (email, otp) => {
    const subject = 'Password Reset OTP - KRISHIGNAN';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; margin: 0 auto 15px; border-radius: 50%; overflow: hidden;">
                    <img src="https://your-domain.com/src/assets/agri_logo.jpg" alt="KRISHIGNAN Logo" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h1 style="color: #2e7d32; margin: 0; font-size: 28px;">🌾 KRISHIGNAN</h1>
                <p style="color: #666; margin-top: 5px; font-weight: 500;">FARMING WISDOM</p>
            </div>
            
            <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
                <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                    You have requested to reset your password for your KRISHIGNAN account.
                    Please use the OTP below to verify your identity:
                </p>
                
                <div style="background-color: #f5f9f5; padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0; border: 2px dashed #2e7d32;">
                    <h1 style="color: #2e7d32; font-size: 40px; letter-spacing: 10px; margin: 0; font-weight: bold;">${otp}</h1>
                    <p style="color: #777; margin-top: 10px; font-size: 14px;">
                        ⏰ Valid for 10 minutes
                    </p>
                </div>
                
                <p style="color: #555; line-height: 1.6; font-size: 14px;">
                    <strong>Important:</strong> Do not share this OTP with anyone. 
                    If you didn't request this password reset, please ignore this email.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="color: #888; font-size: 12px;">
                        This is an automated message from KRISHIGNAN - Farming Wisdom Platform.<br>
                        © ${new Date().getFullYear()} KRISHIGNAN. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    try {
        await sendEmail(email, subject, html);
        console.log('OTP Email sent to:', email);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};