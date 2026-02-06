import { ApiError } from "./ApiError.js";
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Generic function to send ANY email
 * @param {string} to - The recipient's email
 * @param {string} subject - The email subject
 * @param {string} htmlContent - The HTML body of the email
 */

export const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: `"CampusDiary" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent, 
        });
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Email sending failed");
    }
};