const CarVariant = require('../models/CarVariant');

// Create Variant for existing car
exports.createVariant = async (req, res) => {
  try {
    const { carModel, name, price, description, images } = req.body;
    const variant = await CarVariant.create({ carModel, name, price, description, images });
    res.status(201).json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all variants for a car
exports.getVariantsByCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const variants = await CarVariant.find({ carModel: carId });
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single variant
exports.getVariantById = async (req, res) => {
  try {
    const variant = await CarVariant.findById(req.params.id);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update variant
exports.updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CarVariant.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete variant
exports.deleteVariant = async (req, res) => {
  try {
    await CarVariant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Variant deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
