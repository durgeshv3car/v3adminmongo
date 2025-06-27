const express = require('express');
const router = express.Router();
const { getCountryList } = require('../controllers/countryController');

router.get('/', getCountryList);

module.exports = router;
