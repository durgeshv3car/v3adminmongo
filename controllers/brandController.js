// const Brand = require('../models/Brand');
// const slugify = require('slugify');

// exports.createBrand = async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     const existing = await Brand.findOne({ name });
//     if (existing) return res.status(400).json({ message: 'Brand already exists' });

//     const brand = await Brand.create({
//       name,
//       slug: slugify(name, { lower: true }),
//       description,
//       image: req.file ? `/uploads/brands/${req.file.filename}` : null
//     });

//     res.status(201).json(brand);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



const Brand = require('../models/Brand');
const slugify = require('slugify');
const CarModel = require('../models/CarModel');
const CarVariant = require('../models/CarVariant');
const fs = require('fs');
const path = require('path');

exports.getBrandList = async (req, res) => {
  try {
    const brands = await Brand.find(); // or distinct if needed
    res.json({ brands });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = slugify(name, { lower: true });
    const existing = await Brand.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Brand already exists' });
    const protocol = req.protocol; // http or https
    const host = req.get("host");  // domain with port
    const imagePath = req.file ? `${protocol}://${host}/uploads/brands/${req.file.filename}` : "";

   


    const brand = await Brand.create({ name, slug, description, image:imagePath });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.findOne({ _id: req.params.id });
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Handle image update
    let imagePath = brand.image; // Keep existing image by default
    if (req.file) {
      // Delete old image if it exists
      if (brand.image) {
        try {
          const oldFilename = brand.image.split('/').pop();
          const oldImagePath = path.join(__dirname, '..', 'uploads', 'brands', oldFilename);
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
      imagePath = `${protocol}://${host}/uploads/brands/${req.file.filename}`;
    }

    // Update the brand
    const updatedBrand = await Brand.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: name || brand.name,
        description: description || brand.description,
        slug: name ? slugify(name, { lower: true }) : brand.slug,
        image: imagePath
      },
      { new: true }
    );

    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findOneAndDelete({ _id:req.params.id });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Delete the image file if it exists
    if (brand.image) {
      try {
        const filename = brand.image.split('/').pop(); // Get the filename from the URL
        const imagePath = path.join(__dirname, '..', 'uploads', 'brands', filename);
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

exports.getBrandWithCars = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    const cars = await CarModel.find({ brand: brand._id }).lean();
    const carIds = cars.map(c => c._id);
    const variants = await CarVariant.find({ carModel: { $in: carIds } });

    const carWithVariants = cars.map(car => ({
      ...car,
      variants: variants.filter(v => v.carModel.toString() === car._id.toString())
    }));

    res.json({
      brand: {
        name: brand.name,
        slug: brand.slug,
        image: brand.image,
        description: brand.description
      },
      cars: carWithVariants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


