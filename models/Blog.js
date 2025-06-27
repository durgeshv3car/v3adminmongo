const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  category: { type: String, enum: ['News', 'Review', 'Guide', 'Update'], default: 'News' },
  tags: [{ type: String }],
  image: { type: String }, // Thumbnail or banner image path
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
