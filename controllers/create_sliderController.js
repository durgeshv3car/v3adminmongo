const Create_slider = require('../models/Create_slider');

// Create Section
exports.createSection = async (req, res) => {
  try {
    const { title, country, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const section = await Create_slider.create({ title, country, description, image });
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Sections
exports.getSections = async (req, res) => {
  try {
    const sections = await Create_slider.find();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Section
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, country, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await Create_slider.findByIdAndUpdate(
      id,
      { title, country, description, ...(image && { image }) },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Section
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await Create_slider.findByIdAndDelete(id);
    res.json({ message: 'Section Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
