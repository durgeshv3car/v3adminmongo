// const mongoose = require('mongoose');

// const CarModelSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true }, // 👈 make it unique
//   brand: { type: String, required: true },
//   brandSlug: { type: String, required: true }, 
//   fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'EV'], required: true },
//   isUpcoming: { type: Boolean, default: false },
//   isPopular: { type: Boolean, default: false },
//   isLatest: { type: Boolean, default: false },
//   isElectric: { type: Boolean, default: false },
//   country: { type: String, required: true },
//   description: { type: String },
//   image: { type: String }
// }, { timestamps: true });



// module.exports = mongoose.model('CarModel', CarModelSchema);






const mongoose = require('mongoose');

const CarModelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'EV'], required: true },
  isUpcoming: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isLatest: { type: Boolean, default: false },
  isElectric: { type: Boolean, default: false },
  country: { type: String, required: true },
  description: { type: String },
  powertrain: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CarModel', CarModelSchema);
