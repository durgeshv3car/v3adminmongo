const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { createBlog, getBlogs, deleteBlog, getBlogBySlug } = require('../controllers/blogController');


router.post('/', upload.single('image'), createBlog);
router.get('/', getBlogs); // 👈 This line adds GET /api/blogs
router.delete('/:id', deleteBlog); // 👈 DELETE /api/blogs/:id
router.get('/:slug', getBlogBySlug); // 👈 ADD THIS LAST to prevent conflict

module.exports = router;
