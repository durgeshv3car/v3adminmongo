// const express = require('express');
// const { protect, authorize } = require('../middlewares/authMiddleware');
// const {
//     createSection,
//     getSections,
//     updateSection,
//     deleteSection
// } = require('../controllers/create_sliderController');

// const router = express.Router();

// router.post('/', protect, authorize('create_slider'), createSection);
// router.get('/', getSections);
// router.put('/:id', protect, authorize('create_slider'), updateSection);
// router.delete('/:id', protect, authorize('delete_slider'), deleteSection);

// module.exports = router;




const express = require('express');

const upload = require('../middlewares/uploadMiddleware'); // Import multer
const {
  createSection,
  getSections,
  updateSection,
  deleteSection,
} = require('../controllers/create_sliderController');

const router = express.Router();

// router.post('/', protect, authorize('create_slider'), upload.single('image'), createSection);
// router.get('/', getSections);
// router.put('/:id', protect, authorize('create_slider'), upload.single('image'), updateSection);
// router.delete('/:id', protect, authorize('delete_slider'), deleteSection);

module.exports = router;
