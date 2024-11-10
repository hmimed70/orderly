const mongoose = require('mongoose');

// Category Schema
const attemptSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

const Attempt = mongoose.model('Attempt', attemptSchema);
module.exports = Attempt;
