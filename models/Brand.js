const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String }, // e.g., logo
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Brand', BrandSchema);
