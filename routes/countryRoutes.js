const express = require('express');
const router = express.Router();
const { getCountryList } = require('../controllers/countryController');
const countryController = require('../controllers/countryController');

router.post('/', countryController.createCountry);
router.get('/', countryController.getAllCountries);
router.get('/:id', countryController.getCountryById);
router.post('/:countryId/state', countryController.addState);
router.post('/:countryId/state/district', countryController.addDistrict);
router.post('/:countryId/state/district/city', countryController.addCity);


router.get('/', getCountryList);

module.exports = router;






