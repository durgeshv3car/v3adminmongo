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

    const image = req.file ? `/uploads/brands/${req.file.filename}` : null;

    const brand = await Brand.create({ name, slug, description, image });

    res.status(201).json(brand);
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


