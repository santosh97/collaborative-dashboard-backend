'use strict';
/*******
 * models/Widget.js: Widget schema
 * 
 * 11/2024 Santosh Dubey
 *
 */
const mongoose = require('mongoose');
const widgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  // lastUpdatedBy: { type: String, required: true },
  createdBY: { type: String, required: true },
}, {
  timestamps: true
});

const Widget = mongoose.model('Widget', widgetSchema);
module.exports = Widget;
