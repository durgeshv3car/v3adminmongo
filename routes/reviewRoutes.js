const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const getUploader = require("../middlewares/uploadMiddleware");
const uploadReview = getUploader('reviews');
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');



// Create review - requires image upload
router.post('/',authMiddleware,uploadReview.single('image'), createReview);

// Get all reviews
router.get('/',authMiddleware, getAllReviews);

// Get single review
router.get('/:id',authMiddleware, getReviewById);

// Update review - image upload optional
router.put('/:id', uploadReview.single('image'), updateReview);

// Delete review
router.delete('/:id', deleteReview);

module.exports = router;
