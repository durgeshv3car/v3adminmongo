const Car = require("../models/Car");

const getCars = async (req, res) => {
  try {
    const { pageType } = req.query;
    const cars = await Car.find({ pageType });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
};

const createCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      pageType,
      bodyType,
      fuelType,
      mileage,
      engine,
      transmissions,
      seatCapacity,
      priceRange,
      description,
      dimensions,
    } = req.body;

    // Parse necessary fields
    const parsedFuelType = JSON.parse(fuelType);
    const parsedTransmissions = JSON.parse(transmissions);
    const parsedDimensions = JSON.parse(dimensions);

    // Construct full image URL
    const protocol = req.protocol; // http or https
    const host = req.get("host");  // domain with port
    const imagePath = req.file ? `${protocol}://${host}/uploads/brands/${req.file.filename}` : "";

    const newCar = await Car.create({
      brand,
      model,
      pageType,
      bodyType,
      fuelType: parsedFuelType,
      mileage,
      engine,
      transmissions: parsedTransmissions,
      seatCapacity,
      priceRange,
      description,
      dimensions: parsedDimensions,
      image: imagePath, // ✅ store full URL instead of just filename
    });

    res.status(201).json(newCar);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Error creating car", error });
  }
};


const addVariant = async (req, res) => {
  try {
    const { carId } = req.params;
    const { name } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    car.variants.push({ name, details: [] });
    await car.save();

    res.status(200).json(car);
  } catch (error) {
    console.error("Error adding variant:", error);
    res.status(500).json({ message: "Error adding variant", error });
  }
};
const addDetails = async (req, res) => {
  try {
    const { carId } = req.params;
    const {
      variantName,
      price,
      fuel,
      transmission,
      mileage,
      description,
      specifications,
    } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const variantIndex = car.variants.findIndex((v) => v.name === variantName);
    if (variantIndex === -1) {
      return res.status(404).json({ message: "Variant not found" });
    }

    car.variants[variantIndex].details.push({
      fuel,
      transmission,
      mileage,
      price,
      description,
      specifications,
    });

    await car.save();

    res.status(200).json({ message: "Details added successfully", car });
  } catch (error) {
    console.error("Error adding variant details:", error);
    res.status(500).json({ message: "Error adding variant details", error });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findByIdAndDelete(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Error deleting car", error });
  }
};
const deleteVariant = async (req, res) => {
  try {
    const { carId, variantId } = req.params;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Filter out the variant with the given variantId
    car.variants = car.variants.filter(
      (variant) => variant._id.toString() !== variantId
    );

    await car.save();

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({ message: "Error deleting variant", error });
  }
};

const deleteVariantDetail = async (req, res) => {
  try {
    const { carId, variantId, detailId } = req.params;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Find the correct variant by reference
    const variantIndex = car.variants.findIndex(
      (v) => v._id.toString() === variantId
    );
    if (variantIndex === -1) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const variant = car.variants[variantIndex];

    // Remove the detail
    variant.details = variant.details.filter(
      (detail) => detail._id.toString() !== detailId
    );

    // If no details left, remove the entire variant
    if (variant.details.length === 0) {
      car.variants.splice(variantIndex, 1);
    }

    await car.save();

    res.status(200).json({
      message: "Detail deleted successfully",
      variantRemoved: variant.details.length === 0,
    });
  } catch (error) {
    console.error("Error deleting detail:", error);
    res.status(500).json({ message: "Error deleting detail", error });
  }
};

const updateVariantName = async (req, res) => {
  try {
    const { carId, variantId } = req.params;
    const { name } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const variant = car.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    variant.name = name;
    await car.save();

    res.status(200).json({ message: "Variant name updated", variant });
  } catch (error) {
    console.error("Error updating variant name:", error);
    res.status(500).json({ message: "Error updating variant name", error });
  }
};

const updateVariantDetail = async (req, res) => {
  try {
    const { carId, variantId, detailId } = req.params;
    const updateData = req.body;
    

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const variant = car.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const detail = variant.details.id(detailId);
    if (!detail) {
      return res.status(404).json({ message: "Variant detail not found" });
    }
    

    // Update shallow fields
    detail.fuel = updateData.updateData.fuel ?? detail.fuel;
    detail.transmission = updateData.updateData.transmission ?? detail.transmission;
    detail.price = updateData.updateData.price ?? detail.price;
    detail.description = updateData.updateData.description ?? detail.description;
    detail.specifications = updateData.updateData.specifications ?? detail.specifications;

    // Update nested mileage safely
    if (updateData.updateData.mileage && typeof updateData.mileage === "object") {
      detail.mileage = {
        ...detail.mileage,
        ...updateData.updateData.mileage,
      };
    }

    await car.save();

    res.status(200).json({ message: "Variant detail updated", detail });
  } catch (error) {
    console.error("Error updating variant detail:", error);
    res.status(500).json({ message: "Error updating variant detail", error });
  }
};

const updateCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const updateData = req.body;

    // Safely parse JSON fields
    if (updateData.fuelType) {
      updateData.fuelType = JSON.parse(updateData.fuelType);
    }

    if (updateData.transmissions) {
      updateData.transmissions = JSON.parse(updateData.transmissions);
    }

    if (updateData.dimensions) {
      updateData.dimensions = JSON.parse(updateData.dimensions);
    }

    // Handle image file
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      updateData.image = `${protocol}://${host}/uploads/brands/${req.file.filename}`;
    }

    const updatedCar = await Car.findByIdAndUpdate(carId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Error updating car", error });
  }
};


module.exports = {
  getCars,
  createCar,
  addVariant,
  addDetails,
  deleteVariant,
  deleteVariantDetail,
  deleteCar,
  updateVariantName,
  updateVariantDetail,
  updateCar,
};
