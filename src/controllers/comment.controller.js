const Comment = require("../models/comment.model");
const customError = require("../utils/cutomError");

module.exports.createCommentController = async (req, res, next) => {
  const { id } = req.params;
  const loggedInUser = req.user;
  const { message } = req.body;
  try {
    if (!(id && loggedInUser && message))
      return next(new customError("Some details missing during fetching", 400));

    const comment = await Comment.create({
      blogID: id,
      userID: loggedInUser._id,
      message,
    });

    if (!comment)
      return next(new customError("Error in comment creation", 400));

    res.status(201).json({
      success: true,
      message: "comment posted successfully",
      comment,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports.updateCommentController = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) return next(new customError("Error in ID fetching", 400));

    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedComment)
      return next(new customError("Error in comment updation", 400));

    res.status(200).json({
      success: true,
      message: "comment updated",
      updatedComment,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports.readAllCommentsController = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) return next(new customError("ID is not fetched", 400));
    const comments = await Comment.find({ blogID: id });
    if (!comments)
      return next(new customError("Error in fetching comments", 400));

    res.status(200).json({
      success: true,
      message: "Comments fetched",
      comments,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports.deleteCommentController = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) return next(new customError("Error in ID fetching", 400));
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment)
      return next(new customError("Error in comment deletion", 400));

    res.status(200).json({
      success: true,
      message: "comment deleted",
      deletedComment,
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};
