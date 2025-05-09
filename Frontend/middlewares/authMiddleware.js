const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

module.exports = async function (req, res, next) {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if account exists
        const account = await Account.findById(decoded.id);
        if (!account) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Set user info in request
        req.user = { id: account._id };
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 