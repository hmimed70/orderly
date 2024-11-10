const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
module.exports = Category;
