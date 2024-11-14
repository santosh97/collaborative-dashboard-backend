const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  updatedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Widget = mongoose.model('Widget', widgetSchema);
module.exports = Widget;
