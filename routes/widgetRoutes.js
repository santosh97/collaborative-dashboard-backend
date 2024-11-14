const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');
const authenticateToken = require('../middleware/auth');

// CRUD Routes for widgets
router.get('/widgets', authenticateToken, widgetController.getWidgets);
router.post('/widgets', authenticateToken, widgetController.createWidget);
router.put('/widgets/:id', authenticateToken, widgetController.updateWidget);
router.delete('/widgets/:id', authenticateToken, widgetController.deleteWidget);

module.exports = router;
