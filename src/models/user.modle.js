const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: String,
  },
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  if (!token) throw new Error("error generating token ");
  return token;
};

userSchema.statics.authenticateUser = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found ");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("incorrect email or password ");

  return user;
};

module.exports = mongoose.model("User", userSchema);
