'use strict';
/*******
 * routes/authRoutes.js: api for auth
 * 
 * 11/2024 Santosh Dubey
 *
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// CRUD Routes for widgets
router.post('/register', authController.userRegister);
router.post('/login', authController.userLogin);


module.exports = router;
