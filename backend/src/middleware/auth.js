const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');
const User = require('../models/User')(sequelize);

// ✅ Protect routes - verifies JWT token
const protect = async (req, res, next) => {
    let token;

    // ✅ Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('🔑 Token received:', token.substring(0, 20) + '...');
    }

    if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        console.log('✅ Token verified for user ID:', decoded.id);

        // ✅ Find user
        const user = await User.findByPk(decoded.id);
        if (!user) {
            console.log('❌ User not found for ID:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        console.log('✅ User authenticated:', user.email);
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// ✅ Authorize roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };