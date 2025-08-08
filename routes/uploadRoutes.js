const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');


// router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
