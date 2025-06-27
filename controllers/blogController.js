// const Blog = require('../models/Blog');
// const slugify = require('slugify');

// // POST /api/blogs
// exports.createBlog = async (req, res) => {
//   try {
//     const { title, content, author, category, tags, image, isPublished } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ message: 'Title and content are required' });
//     }

//     const slug = slugify(title, { lower: true });

//     const existing = await Blog.findOne({ slug });
//     if (existing) {
//       return res.status(400).json({ message: 'Blog with this title already exists' });
//     }

//     const blog = await Blog.create({
//       title,
//       slug,
//       content,
//       author,
//       category,
//       tags,
//       image,
//       isPublished,
//       publishedAt: isPublished ? new Date() : null
//     });

//     res.status(201).json(blog);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




const Blog = require('../models/Blog');
const slugify = require('slugify');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, author, category, tags, isPublished } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = slugify(title, { lower: true });

    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Blog with this title already exists' });
    }

    const image = req.file ? `/uploads/blogs/${req.file.filename}` : null;

    const blog = await Blog.create({
      title,
      slug,
      content,
      author,
      category,
      tags: tags ? JSON.parse(tags) : [], // if sent as string
      image,
      isPublished,
      publishedAt: isPublished ? new Date() : null
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, isPublished, search } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (isPublished !== undefined) filters.isPublished = isPublished === 'true';
    if (search) filters.title = { $regex: search, $options: 'i' };

    const total = await Blog.countDocuments(filters);

    const blogs = await Blog.find(filters)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      blogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
