const Blog = require("../models/blog.model");
const CustomError = require("../utils/cutomError");
const User = require("../models/user.modle");

module.exports.blogCreateController = async (req, res, next) => {
  const { heading, description } = req.body;

  try {
    const userId = req.user._id;
    const blog = await Blog.create({
      heading,
      description,
      user: userId,
    });

    if (!blog) return next(new CustomError("Error in blog creation", 400));

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          blogs: blog._id,
        },
      }
    );

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
    const blog = await Blog.find();
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
  const { id } = req.params;
  try {
    if (!id)
      return next(new CustomError("Error in fetching ID from params, 400"));

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog)
      return next(new CustomError("Error in updation of blog", 400));

    res.status(200).json({
      success: true,
      message: "successfully updated",
      updatedBlog,
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
  const { id } = req.params;
  try {
    if (!id) return next(new CustomError("Blog not fetched", 400));

    const blog = await Blog.findById(id);

    console.log(blog)
    
    const { likes } = blog;
    const isAlreadyLiked = likes.includes(req.user._id);

    if (isAlreadyLiked) {
      const updatedBlog = await Blog.findByIdAndUpdate(id, {
        $pull: {
          likes: req.user._id,
        },
      });

      res.status(200).json({
        success: true,
        message: "Blog unliked successfully",
        blog,
      });

    } else {
      const updatedBlog = await Blog.findByIdAndUpdate(id, {
        $push: {
          likes: req.user._id,
        },
      });
      if (!blog) return next(new CustomError("Error in updation", 400));
      console.log(blog);

      res.status(200).json({
        success: true,
        message: "Blog liked successfully",
        blog,
      });
    }
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
