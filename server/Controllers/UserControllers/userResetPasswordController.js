const Models = require("../../Models/index.models");
const bcrypt = require('bcryptjs');

const sanitize = (str) => {
    return str?.trim().replace(/[<>"'\/]/g, '');
};

// Password validation function
const validatePassword = (password) => {
    const errors = [];
    
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter (A-Z)');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter (a-z)');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number (0-9)');
    }
    if (!/[@$!%*?#&]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?#&)');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and new password are required' 
            });
        }

        // Find user by email
        const user = await Models.UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'No user found with this email address' 
            });
        }

        // Validate password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ 
                success: false,
                message: 'Password does not meet security requirements: ' + passwordValidation.errors.join(', ')
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user's password
        user.password = hashedPassword;
        await user.save();

        console.log(`✅ Password reset successful for email: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Password reset successful! You can now login with your new password.'
        });

    } catch (error) {
        console.error('❌ Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password. Please try again.'
        });
    }
};

module.exports = resetPasswordController; 