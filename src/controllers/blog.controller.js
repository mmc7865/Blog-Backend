const Blog = require("../models/blog.model");
const CustomError = require("../utils/cutomError");

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

    res.status(201).json({
      success: true,
      message: "Blog successfully created",
      blog,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.blogReadController = async (req, res, next) => {
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
    const {id} = req.params
    try {
    if (!id)
      return next(new CustomError("Error in fetching ID from params, 400"));
    const deletedBlog = await Blog.findByIdAndDelete(id)

        if(!deletedBlog) return next(new CustomError("Error in deleting Blog", 400))

            res.status(200).json({
                success: true,
                message: "Blog deleted",
                deletedBlog
            })

    } catch (error) {
        next(new CustomError(error.message, 500))
    }
};
