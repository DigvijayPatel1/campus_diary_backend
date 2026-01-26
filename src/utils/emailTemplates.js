export const getPasswordResetTemplate = (userName, resetUrl) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #1e293b; text-align: center;">Password Reset Request</h2>
            <p style="color: #475569; font-size: 16px;">Hello ${userName},</p>
            <p style="color: #475569; font-size: 16px;">You requested a password reset for your NITConnect account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">This link expires in ${process.env.RESET_PASSWORD_EXPIRY_MINUTES || 10} minutes.</p>
            <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                Or copy and paste this link: <br>
                <a href="${resetUrl}" style="color: #059669;">${resetUrl}</a>
            </p>
        </div>
    `;
};

export const getVerificationTemplate = (verificationUrl) => {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h2>Welcome to NITConnect!</h2>
        <p>Please verify your email to access all features.</p>
        <a href="${verificationUrl}">Verify Email</a>
    </div>
    `
};