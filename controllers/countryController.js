const CarModel = require('../models/CarModel');
const Country = require('../models/Country');

exports.getCountryList = async (req, res) => {
  try {
    const countries = await CarModel.distinct('country');
    res.json({ countries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Create a new country with states, districts, and cities
exports.createCountry = async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get country by ID
exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json(country);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new state to a country
exports.addState = async (req, res) => {
  try {
    const { countryId } = req.params;
    const { name } = req.body;

    const country = await Country.findById(countryId);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    country.states.push({ name, districts: [] });
    await country.save();
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add a new district to a state
exports.addDistrict = async (req, res) => {
  try {
    const { countryId} = req.params;
    const { stateName,name } = req.body;

    const country = await Country.findById(countryId);
    const stateIndex = country.states.findIndex(state => state.name.toLowerCase() === stateName.toLowerCase());
    if (!country || !country.states[stateIndex]) {
      return res.status(404).json({ error: 'Country or State not found' });
    }

    country.states[stateIndex].districts.push({ name, cities: [] });
    await country.save();
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add a new city to a district
exports.addCity = async (req, res) => {
  try {
    const { countryId } = req.params;
    const { stateName,districtName,name } = req.body;

    const country = await Country.findById(countryId);
    const stateIndex = country.states.findIndex(state => state.name.toLowerCase() === stateName.toLowerCase());
    const districtIndex = country.states[stateIndex].districts.findIndex(district => district.name.toLowerCase() === districtName.toLowerCase());
    if (
      !country ||
      !country.states[stateIndex] ||
      !country.states[stateIndex].districts[districtIndex]
    ) {
      return res.status(404).json({ error: 'Country, State, or District not found' });
    }

    country.states[stateIndex].districts[districtIndex].cities.push({ name });
    await country.save();
    res.json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
