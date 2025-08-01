const sendMail = require('../Utils/sendMail');

/**
 * Send OTP via email using Nodemailer
 * @param {string} email - User's email address
 * @param {string} otp - The OTP code to send
 * @returns {Promise<Object>} - Success status and message
 */
const sendEmailOTP = async (email, otp) => {
    try {
        // Validate email
        if (!email || !otp) {
            return {
                success: false,
                error: 'Email and OTP are required'
            };
        }

        // Email subject
        const subject = 'Vipreshana - Email Verification OTP';

        // Email content (HTML format)
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Vipreshana</h1>
                    <p style="color: white; margin: 10px 0 0 0;">Email Verification</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
                    
                    <div style="background: #fff; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6;">
                        Please enter this verification code in the Vipreshana app to complete your registration.
                        This code will expire in <strong>10 minutes</strong>.
                    </p>
                    
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            <strong>Security Notice:</strong> Never share this code with anyone. 
                            Vipreshana will never ask for this code via phone or email.
                        </p>
                    </div>
                    
                    <p style="color: #999; font-size: 14px; margin-top: 30px;">
                        If you didn't request this verification code, please ignore this email.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                    <p>© 2024 Vipreshana. All rights reserved.</p>
                </div>
            </div>
        `;

        // Plain text version (fallback)
        const textContent = `
            Vipreshana - Email Verification
            
            Your verification code is: ${otp}
            
            Please enter this code in the Vipreshana app to complete your registration.
            This code will expire in 10 minutes.
            
            Security Notice: Never share this code with anyone.
            
            If you didn't request this verification code, please ignore this email.
        `;

        // Send email using existing sendMail utility
        await new Promise((resolve, reject) => {
            sendMail({
                to: email,
                subject: subject,
                html: htmlContent
            }, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        console.log(`✅ Email OTP sent successfully to: ${email}`);

        return {
            success: true,
            message: 'Email OTP sent successfully'
        };

    } catch (error) {
        console.error('❌ Error sending email OTP:', error);
        return {
            success: false,
            error: 'Failed to send email OTP',
            details: error.message
        };
    }
};

/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateEmailOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    sendEmailOTP,
    generateEmailOTP
}; 