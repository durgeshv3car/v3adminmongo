const mongoose = require('mongoose');

const CarVariantSchema = new mongoose.Schema({
  carModel: { type: mongoose.Schema.Types.ObjectId, ref: 'CarModel', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  enum: ['FWD', 'RWD', 'AWD', '4WD'],
  description: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('CarVariant', CarVariantSchema);
