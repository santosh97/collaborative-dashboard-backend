'use strict';
/*******
 * auth.js: middleware for vaildation with jwt
 * 
 * 11/2024 Santosh Dubey
 *
 */

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    return next(); //temp patch  
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token required' });
//   }

//   jwt.verify(token, 'your-secret-key', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   });
};

module.exports = authenticateToken;
