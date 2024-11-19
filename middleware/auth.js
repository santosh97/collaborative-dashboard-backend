'use strict';
/*******
 * auth.js: middleware for vaildation with jwt
 * 
 * 11/2024 Santosh Dubey
 *
 */

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization']; // Get the Authorization header

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is required' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
