const express = require("express");
const router = express.Router();

const getUploader = require("../middlewares/uploadMiddleware");
const uploadBrand = getUploader('cars');

const {
  getAllCars,
  getCarById,
  getCarsByBrand,
  getUpcomingCars,
  getPopularCars,
  getLatestCars,
  getElectricCars,
} = require("../controllers/carController");

const {
  createCar,
  addVariant,
  addDetails,
  getCars,
  deleteVariantDetail,
  deleteVariant,
  deleteCar,
  updateVariantName,
   updateVariantDetail,
   updateCar
} = require("../controllers/carsController");

// Routes
router.get("/", getAllCars);
router.get("/upcoming", getUpcomingCars);
router.get("/popular", getPopularCars);
router.get("/latest", getLatestCars);
router.get("/electric", getElectricCars);
router.get("/brand/:brandSlug", getCarsByBrand);

router.post("/create", uploadBrand.single("image"), createCar);
router.post("/variant/:carId", addVariant);
router.post("/variant/detail/:carId", addDetails);
router.get("/fetch", getCars);
router.delete("/:carId", deleteCar);
router.delete(
  "/:carId/variant/:variantId/detail/:detailId",
  deleteVariantDetail
);
router.delete("/:carId/variant/:variantId", deleteVariant);
router.put(
  "/:carId/variant/:variantId",
  updateVariantName
);
router.put(
  "/:carId/variant/:variantId/detail/:detailId",
  updateVariantDetail
);
router.put(
  "/:carId",
  uploadBrand.single("image"),
  updateCar
);

// ⚠️ This should always be last
router.get("/:id", getCarById);

module.exports = router;
