const express = require('express');
const getUploader = require("../middlewares/uploadMiddleware");
const uploadBrand = getUploader('brands');
const {
  createBrand,
  getBrandList,
  getBrandWithCars,
  deleteBrand,
  updateBrand
} = require('../controllers/brandController');

const router = express.Router();

router.post('/', uploadBrand.single('image'), createBrand); // with image upload
router.get('/', getBrandList);
router.get('/:slug', getBrandWithCars); // brand detail + cars
router.put('/:id', uploadBrand.single('image'), updateBrand); // update brand
router.delete('/:id', deleteBrand); // delete brand

module.exports = router;
