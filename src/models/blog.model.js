const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    post:{
      type: String,
    },
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Blog', blogSchema)