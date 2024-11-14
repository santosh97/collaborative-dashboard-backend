'use strict';
/*******
 * widgetController.js: controller for widgets
 * 
 * 11/2024 Santosh Dubey
 *
 */
const Widget = require('../models/Widget');
const jwt = require('jsonwebtoken');

// Create a new widget
exports.createWidget = async (req, res) => {
    try {
        const { title, description, type } = req.body;
        const widget = new Widget({ title, description, type, updatedBy: req.user?.username || 'defaultUser' });
        await widget.save();
        res.status(201).json(widget);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create widget', error: error.message });
    }
};

// Get all widgets
exports.getWidgets = async (req, res) => {
    try {
        const widgets = await Widget.find();
        res.status(200).json(widgets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch widgets', error: error.message });
    }
};

// Update a widget
exports.updateWidget = async (req, res) => {
    try {
        const widget = await Widget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!widget) return res.status(404).json({ message: 'Widget not found' });

        res.status(200).json(widget);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update widget', error: error.message });
    }
};

// Delete a widget
exports.deleteWidget = async (req, res) => {
    try {
        const widget = await Widget.findByIdAndDelete(req.params.id);
        if (!widget) return res.status(404).json({ message: 'Widget not found' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete widget', error: error.message });
    }
};
