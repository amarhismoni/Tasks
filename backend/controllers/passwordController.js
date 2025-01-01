const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { Users } = require("../models/model");
const { Op } = require("sequelize");

// Forgot Password Endpoint
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the database
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email not found." });
        }

        // Generate a token with an expiration date (e.g., 1 hour)
        const token = jwt.sign({ userId: user.id }, "your-secret-key", { expiresIn: "1h" });

        // Save the token and expiration date in the database
        user.resetToken = token;
        user.resetTokenExpire = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Send an email with the reset password link
        const transporter = nodemailer.createTransport({
            host: "localhost", // Use your system's SMTP server
            port: 25, // Default SMTP port
            secure: false, // Set to true if using SSL/TLS
        });

        const mailOptions = {
            from: "amarhismoni223@gmail.com", // Sender address
            to: email, // Recipient address
            subject: "Password Reset", // Subject line
            text: `Click the link to reset your password: http://localhost:3000/reset-password/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Failed to send email." });
            }
            res.json({ success: true, message: "Password reset link sent to your email." });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
});

module.exports = router;
