// const mongoose = require('mongoose');

// const Create_sliderSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     country: { type: String, required: true },
//     description: { type: String },
//     image: { type: String },
//     status: { type: Boolean, default: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Create_slider', Create_sliderSchema);




const mongoose = require('mongoose');

const Create_sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Create_slider', Create_sliderSchema);
