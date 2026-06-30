const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// Generate JWT Token
const generateToken = (id) => {
    // Make sure JWT_SECRET exists
    const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production';
    
    // Hardcode expiresIn to '7d' - this ALWAYS works
    return jwt.sign(
        { id: id.toString() }, 
        secret, 
        { expiresIn: '7d' }  // ✅ MUST be a string like '7d', '1h', '30d'
    );
};


// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'staff'
        });

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('📝 Login attempt:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('✅ User found:', user.email);

        // Compare password
        let isPasswordMatch = false;
        try {
            if (typeof user.comparePassword === 'function') {
                isPasswordMatch = await user.comparePassword(password);
            } else {
                isPasswordMatch = await bcrypt.compare(password, user.password);
            }
        } catch (error) {
            console.error('❌ Password comparison error:', error);
            isPasswordMatch = await bcrypt.compare(password, user.password);
        }

        console.log('🔐 Password match:', isPasswordMatch);

        if (!isPasswordMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ✅ Generate token
        console.log('🔑 Generating token for user:', user.id);
        const token = generateToken(user.id);
        console.log('✅ Token generated successfully');

        console.log('✅ Login successful for:', email);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        // Send more detailed error for debugging
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};