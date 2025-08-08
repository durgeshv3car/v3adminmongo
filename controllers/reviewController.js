const Review = require('../models/Review');
const fs = require('fs');
const { console } = require('inspector');
const path = require('path');

// Create a new review
exports.createReview = async (req, res) => {
  
  try {
    const { type, title, description } = req.body;
    const userId = req.user.id; 

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Create image URL
    const protocol = req.protocol;
    const host = req.get("host");
    const imagePath = `${protocol}://${host}/uploads/reviews/${req.file.filename}`;

    const review = await Review.create({
      userId,
      type,
      title,
      description,
      image: imagePath
    });

    // Populate user details in the response


    res.status(201).json({
      message: "Review created successfully",
      data:review
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { type, title, description } = req.body;
    const reviewId = req.params.id;

    // Find existing review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

 
    // Handle image update
    let imagePath = review.image;
    if (req.file) {
      // Delete old image
      if (review.image) {
        try {
          const oldFilename = review.image.split('/').pop();
          const oldImagePath = path.join(__dirname, '..', 'uploads', 'reviews', oldFilename);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image file:', err);
        }
      }

      // Set new image path
      const protocol = req.protocol;
      const host = req.get("host");
      imagePath = `${protocol}://${host}/uploads/reviews/${req.file.filename}`;
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        type: type || review.type,
        title: title || review.title,
        description: description || review.description,
        image: imagePath
      },
      { new: true }
    ).populate('user', 'name');

    res.json({
      message: "Review updated successfully",
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

 

    // Delete image file if it exists
    if (review.image) {
      try {
        const filename = review.image.split('/').pop();
        const imagePath = path.join(__dirname, '..', 'uploads', 'reviews', filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: error.message });
  }
};




