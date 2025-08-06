const mongoose = require("mongoose");



const VariantOptionSchema = new mongoose.Schema({
  fuel: { type: String, required: true },
  mileage: { type:Object, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  specifications: {type: String },
});

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: [VariantOptionSchema],
});

const CarSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: String, required: true },
  pageType:{ type: String, required: true },
  bodyType: {
    type: String,
    enum: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible"],
    required: true,
  },
  fuelType: {
    type: [String],
    enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"],
    required: true,
  },
  mileage: { type: Number, required: true },
  engine: { type: String, required: true },
  transmissions: { type: [String], enum: ["Manual", "Automatic"], required: true },
  seatCapacity: { type: Number, required: true },
  priceRange: {type: String, required: true},
  description: { type: String, required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    wheelbase: { type: Number, required: true },
  },
  image:{type: String},
  variants: [VariantSchema],
});

module.exports = mongoose.model("carData", CarSchema);
