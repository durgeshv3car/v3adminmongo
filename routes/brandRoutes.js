const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const {
  createBrand,
  getBrandList,
  getBrandWithCars
} = require('../controllers/brandController');

const router = express.Router();

// router.post('/', upload.single('image'), createBrand); // with image upload
router.get('/', getBrandList);
router.get('/:slug', getBrandWithCars); // brand detail + cars

module.exports = router;
