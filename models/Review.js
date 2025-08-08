const mongoose = require("mongoose");



const reviewSchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
 type: { type: String, required: true },
 title: { type: String, required: true },
 image: { type: String, required: true },
 description:{ type: String, required: true },
});

module.exports = mongoose.model("review", reviewSchema);
