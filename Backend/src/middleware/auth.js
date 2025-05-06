const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Auth Header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Token:', token);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        // Find user
        const user = await Account.findById(decoded.id);
        console.log('Found user:', user);

        if (!user) {
            throw new Error('User not found');
        }

        // Add user to request
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token. Authentication failed.'
        });
    }
};

module.exports = auth; 