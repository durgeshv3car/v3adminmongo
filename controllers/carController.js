const CarModel = require('../models/CarModel');
const CarVariant = require('../models/CarVariant');
const slugify = require('slugify'); // install if needed: npm i slugify
const Brand = require('../models/Brand');

// // Create Car + Variants
// exports.createCar = async (req, res) => {
//   try {
//     const {
//       name,
//       brandName, // 👈 Receive this from request
//       fuelType,
//       isUpcoming,
//       isPopular,
//       isLatest,
//       isElectric,
//       country,
//       description,
//       image,
//       variants
//     } = req.body;

//     // 🔐 Check if car with same name already exists
//     const existing = await CarModel.findOne({ name });
//     if (existing) {
//       return res.status(400).json({ message: 'Car name already exists' });
//     }

//     // 🔍 Lookup brand by name or slug
//     const brandSlug = slugify(brandName, { lower: true });
//     const brandDoc = await Brand.findOne({ slug: brandSlug });

//     if (!brandDoc) {
//       return res.status(404).json({ message: 'Brand not found' });
//     }

//     // ✅ Create CarModel with brand ObjectId
//     const car = await CarModel.create({
//       name,
//       brand: brandDoc._id, // ✅ Use ObjectId here
//       fuelType,
//       isUpcoming,
//       isPopular,
//       isLatest,
//       isElectric,
//       country,
//       description,
//       image
//     });

//     // ✅ Create Variants if provided
//     if (variants && variants.length) {
//       await Promise.all(variants.map((v) =>
//         CarVariant.create({
//           carModel: car._id,
//           name: v.name,
//           price: v.price,
//           description: v.description,
//           images: v.images || []
//         })
//       ));
//     }

//     res.status(201).json({ message: 'Car created with variants', carId: car._id });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Duplicate car name not allowed' });
//     }
//     res.status(500).json({ message: error.message });
//   }
// };


// Create Car + Variants
exports.createCar = async (req, res) => {
  try {
    const {
      name,
      brandName, // Must be a string like "Maruti Suzuki"
      fuelType,
      isUpcoming,
      isPopular,
      isLatest,
      isElectric,
      country,
      description,
      image,
      variants
    } = req.body;



    // ✅ 1. Ensure car name is not duplicated
    const existing = await CarModel.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Car name already exists' });
    }

    // ✅ 2. Validate brandName
    if (!brandName || typeof brandName !== 'string') {
      return res.status(400).json({ message: 'brandName is required and must be a string' });
    }

    // ✅ 3. Convert brandName to slug and fetch Brand
    const brandSlug = slugify(brandName, { lower: true });
    const brandDoc = await Brand.findOne({ _id: brandSlug });


    if (!brandDoc) {
      return res.status(404).json({ message: 'Brand not found for: ' + brandSlug });
    }

    // ✅ 4. Create Car
    const car = await CarModel.create({
      name,
      brand: brandDoc._id,
      fuelType,
      isUpcoming,
      isPopular,
      isLatest,
      isElectric,
      country,
      description,
      image
    });

    // ✅ 5. Add Variants if provided
    if (Array.isArray(variants) && variants.length) {
      await Promise.all(
        variants.map(v =>
          CarVariant.create({
            carModel: car._id,
            name: v.name,
            price: v.price,
            description: v.description,
            powertrain: v.powertrain, // ✅ added here
            images: v.images || []
          })
        )
      );
      ;
    }

    // ✅ 6. Success response
    res.status(201).json({
      message: 'Car created successfully with variants',
      carId: car._id
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate car name not allowed' });
    }
    res.status(500).json({ message: error.message });
  }
};



exports.getAllCars = async (req, res) => {
  try {
    const {
      country,
      fuelType,
      isUpcoming,
      isPopular,
      isLatest,
      isElectric,
      brand,
      page = 1,
      limit = 10
    } = req.query;

    const filters = {};
    if (country) filters.country = country;
    if (fuelType) filters.fuelType = fuelType;
    if (brand) filters.brand = brand;
    if (isUpcoming) filters.isUpcoming = isUpcoming === 'true';
    if (isPopular) filters.isPopular = isPopular === 'true';
    if (isLatest) filters.isLatest = isLatest === 'true';
    if (isElectric) filters.isElectric = isElectric === 'true';

    const total = await CarModel.countDocuments(filters);
    const cars = await CarModel.find(filters)
      .populate('brand')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const carIds = cars.map(car => car._id);
    const variants = await CarVariant.find({ carModel: { $in: carIds } });

    const carWithVariants = cars.map(car => ({
      ...car,
      variants: variants.filter(v => v.carModel.toString() === car._id.toString())
    }));

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      cars: carWithVariants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get one car with its variants
exports.getCarById = async (req, res) => {
  try {
    const car = await CarModel.findById(req.params.id).lean();
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const variants = await CarVariant.find({ carModel: car._id });
    res.json({ ...car, variants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete car + its variants
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    await CarModel.findByIdAndDelete(id);
    await CarVariant.deleteMany({ carModel: id });
    res.json({ message: 'Car and variants deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCarsByBrand = async (req, res) => {
  try {
    const { brandSlug } = req.params;
    const {
      country,
      isUpcoming,
      isPopular,
      isLatest,
      isElectric,
      fuelType
    } = req.query;

    const filters = { brandSlug }; // match directly

    if (country) filters.country = country;
    if (fuelType) filters.fuelType = fuelType;
    if (isUpcoming) filters.isUpcoming = isUpcoming === 'true';
    if (isPopular) filters.isPopular = isPopular === 'true';
    if (isLatest) filters.isLatest = isLatest === 'true';
    if (isElectric) filters.isElectric = isElectric === 'true';

    const cars = await CarModel.find(filters).lean();
    const carIds = cars.map(c => c._id);
    const variants = await CarVariant.find({ carModel: { $in: carIds } });

    const carWithVariants = cars.map(car => ({
      ...car,
      variants: variants.filter(v => v.carModel.toString() === car._id.toString())
    }));

    res.json(carWithVariants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.getUpcomingCars = async (req, res) => {
//   try {
//     const { country, brand, fuelType } = req.query;

//     const filters = { isUpcoming: true };

//     if (country) filters.country = country;
//     if (brand) filters.brand = new RegExp(`^${brand}$`, 'i'); // case-insensitive
//     if (fuelType) filters.fuelType = fuelType;

//     const cars = await CarModel.find(filters).lean();
//     const carIds = cars.map(car => car._id);

//     const variants = await CarVariant.find({ carModel: { $in: carIds } });

//     const carWithVariants = cars.map(car => ({
//       ...car,
//       variants: variants.filter(v => v.carModel.toString() === car._id.toString())
//     }));

//     res.json(carWithVariants);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const getCarsByCategory = (categoryField) => async (req, res) => {
  try {
    const { country, brand, fuelType } = req.query;

    const filters = { [categoryField]: true };

    if (country) filters.country = country;
    if (brand) filters.brand = new RegExp(`^${brand}$`, 'i');
    if (fuelType) filters.fuelType = fuelType;

    const cars = await CarModel.find(filters).lean();
    const carIds = cars.map(car => car._id);
    const variants = await CarVariant.find({ carModel: { $in: carIds } });

    const carWithVariants = cars.map(car => ({
      ...car,
      variants: variants.filter(v => v.carModel.toString() === car._id.toString())
    }));

    res.json(carWithVariants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUpcomingCars = getCarsByCategory('isUpcoming');
exports.getPopularCars = getCarsByCategory('isPopular');
exports.getLatestCars = getCarsByCategory('isLatest');
exports.getElectricCars = getCarsByCategory('isElectric');








exports.getBrandWithCars = async (req, res) => {
  try {
    const { slug } = req.params;

    const brand = await Brand.findOne({ slug });
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
