const Blog = require("../models/blogModel");

exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    blog.author = req.user._id;
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "content"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates" });
    }

    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    updates.forEach((update) => (blog[update] = req.body[update]));
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
