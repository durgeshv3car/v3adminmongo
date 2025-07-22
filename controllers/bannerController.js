const Banner = require('../models/Banner');

// ➕ Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file || !title) {
      return res.status(400).json({ message: "Title and Image are required." });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/banner/${file.filename}`;

    const newBanner = await Banner.create({ title, image: imageUrl });

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
    const { title } = req.body;
    let image = req.body.image;

    if (req.file) {
      image = `${req.protocol}://${req.get('host')}/uploads/banner/${req.file.filename}`;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      { title, image },
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
    const { id } = req.params;

    const deleted = await Banner.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
