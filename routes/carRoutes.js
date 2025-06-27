const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createCar,
  getAllCars,
  getCarById,
  deleteCar,
  getCarsByBrand,
  getUpcomingCars,
  getPopularCars,
  getLatestCars,
  getElectricCars
} = require('../controllers/carController');

router.post('/', protect, createCar);
router.get('/', getAllCars);
// router.get('/:id', getCarById);
router.delete('/:id', protect, deleteCar);
// router.get('/brand/:brandName', getCarsByBrand);
// router.get('/upcoming', getUpcomingCars);

router.get('/upcoming', getUpcomingCars);
router.get('/popular', getPopularCars);
router.get('/latest', getLatestCars);
router.get('/electric', getElectricCars);
router.get('/electric', getElectricCars);
router.get('/brand/:brandSlug', getCarsByBrand);

// ❌ This should always come LAST
router.get('/:id', getCarById);


module.exports = router;
