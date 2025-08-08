const express = require('express');
const router = express.Router();
const {
  createVariant,
  getVariantsByCar,
  getVariantById,
  updateVariant,
  deleteVariant
} = require('../controllers/variantController');


// router.post('/', protect, createVariant); // Add variant
// router.get('/car/:carId', getVariantsByCar); // Get all variants of a car
// router.get('/:id', getVariantById); // Get variant by ID
// router.put('/:id', protect, updateVariant); // Update variant
// router.delete('/:id', protect, deleteVariant); // Delete variant

module.exports = router;
