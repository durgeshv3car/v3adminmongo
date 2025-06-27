const CarModel = require('../models/CarModel');

exports.getCountryList = async (req, res) => {
  try {
    const countries = await CarModel.distinct('country');
    res.json({ countries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
