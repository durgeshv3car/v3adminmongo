const Banner = require('../models/Banner');
const path = require('path');
const fs = require('fs');

// ➕ Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { name,carUrl } = req.body;
    const file = req.file;

    if (!file || !name) {
      return res.status(400).json({ message: "Title and Image are required." });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/banner/${file.filename}`;

    const newBanner = await Banner.create({ name, image: imageUrl,carUrl });

    res.status(201).json({
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📝 Update banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, carUrl } = req.body;
    
    // Find the existing banner first
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Handle image update
    let image = existingBanner.image;
    if (req.file) {
      // Delete old image if it exists
      if (existingBanner.image) {
        try {
          const oldFilename = existingBanner.image.split('/').pop();
          const oldImagePath = path.join(__dirname, '..', 'uploads', 'banner', oldFilename);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image file:', err);
        }
      }
      
      // Set new image path
      image = `${req.protocol}://${req.get('host')}/uploads/banner/${req.file.filename}`;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { 
        name: name || existingBanner.name,
        image,
        carUrl: carUrl || existingBanner.carUrl
      },
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({
      message: "Banner updated successfully",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📥 Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🔍 Get a banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json(banner);
  } catch (error) {
    console.error("Error fetching banner by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 🗑️ Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const brand = await Banner.findOneAndDelete({ _id:req.params.id });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Delete the image file if it exists
    if (brand.image) {
      try {
        const filename = brand.image.split('/').pop(); // Get the filename from the URL
        const imagePath = path.join(__dirname, '..', 'uploads', 'banner', filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting image file:', err);
        // Continue with the response even if image deletion fails
      }
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
