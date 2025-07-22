const express = require('express');
const router = express.Router();

const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');

const getUploader = require('../middlewares/uploadMiddleware');
const uploadBanner = getUploader('banner');

// ✅ Routes
router.post('/create', uploadBanner.single('image'), createBanner);
router.get('/all', getAllBanners);
router.get('/:id', getBannerById);
router.put('/:id', uploadBanner.single('image'), updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
