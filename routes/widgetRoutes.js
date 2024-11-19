'use strict';
/*******
 * widgetRoutes.js: api for widgets
 * 
 * 11/2024 Santosh Dubey
 *
 */
const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');
const authenticateToken = require('../middleware/auth');

// CRUD Routes for widgets
router.get('/', authenticateToken, widgetController.getWidgets);
router.post('/', authenticateToken, widgetController.createWidget);
router.put('/:id', authenticateToken, widgetController.updateWidget);
router.delete('/:id', authenticateToken, widgetController.deleteWidget);

module.exports = router;
