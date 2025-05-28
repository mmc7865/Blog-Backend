const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    category:{
      type: String,
      required: true
    },
    image:{
      type: String,
      required: true
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