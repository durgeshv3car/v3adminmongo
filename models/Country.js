const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true }
}, { _id: false });

const DistrictSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cities: [CitySchema]
}, { _id: false });

const StateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  districts: [DistrictSchema]
}, { _id: false });

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  states: [StateSchema]
});

module.exports = mongoose.model('Country', CountrySchema);
