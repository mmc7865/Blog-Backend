const uploadImage = require("../config/imagekit");
const Blog = require("../models/blog.model");
const CustomError = require("../utils/cutomError");

module.exports.blogCreateController = async (req, res, next) => {
  try {
    const { category, heading, description } = req.body;
    if (!category || !heading || !description)
      return next(new CustomError("Error in data fetching", 400));
    const file = req.file;
    const imageUrl = await uploadImage(file);

    const blog = await Blog.create({
      category,
      heading,
      description,
      image: imageUrl,
      user: req.user._id,
    });

    if (!blog) return next(new CustomError("Error in blog creation", 400));

    res.status(201).json({
      success: true,
      message: "Blog successfully created",
      blog,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.singleBlogReadController = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id)
      return next(new CustomError("Error in fetching ID from params", 400));

    const blog = await Blog.findById(id);
    res.status(200).json({
      success: true,
      message: "blog fetched",
      blog,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.allBlogReadController = async (req, res, next) => {
  try {
    const blog = await Blog.find().sort({ createdAt: -1 });
    if (!blog) return next(new CustomError("Blogs not found", 404));
    res.status(200).json({
      success: true,
      message: "blog fetched",
      blog,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.blogUpdateController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new CustomError("Invalid blog ID", 400));

    const blog = await Blog.findById(id);
    if (!blog) return next(new CustomError("Blog not found", 404));

    const {category, heading, description } = req.body;
    const file = req.file;

    if (file) {
      blog.post = await uploadImage(file);
    }
    if (category) blog.category = category;
    if (heading) blog.heading = heading;
    if (description) blog.description = description;

    await blog.save(); 

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      updatedBlog: blog,
    });

  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.blogDeleteController = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id)
      return next(new CustomError("Error in fetching ID from params, 400"));

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog)
      return next(new CustomError("Error in deleting Blog", 400));

    res.status(200).json({
      success: true,
      message: "Blog deleted",
      deletedBlog,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.blogLikesController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return next(new CustomError("Blog ID is incorrect", 400));

    const blog = await Blog.findById(id);
    if (!blog) return next(new CustomError("Blog not found", 404));

    const isAlreadyLiked = blog.likes.includes(req.user._id);

    if (isAlreadyLiked) {
      blog.likes = blog.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
      await blog.save();
      res.status(200).json({
        success: true,
        message: "Blog unliked successfully",
        updatedBlog: blog,
      });
    } else {
      blog.likes.push(req.user._id);
      await blog.save();
      res.status(200).json({
        success: true,
        message: "Blog liked successfully",
        updatedBlog: blog,
      });
    }
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
