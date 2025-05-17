const User = require("../models/user.modle");
const customError = require("../utils/cutomError");
const bcrypt = require("bcrypt");
const cacheClient = require('../service/cache.service')

module.exports.userRegisterController = async (req, res, next) => {
  const { name, userName, email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) return next(new customError("User already exists", 400));

    const user = await User.create({
      name,
      userName,
      email,
      password,
      isAdmin: false,
    });

    if (!user) return next(new customError("Error in user creation", 400));

    const Token = await user.generateAuthToken();
    console.log(Token);

    res.cookie("Token", Token);

    res.status(201).json({
      success: true,
      message: "User successfully created",
    });
  } catch (error) {
    next(new customError(error.message));
  }
};

module.exports.userLoginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) return next(new customError("User not found", 404));

    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordMatched)
      return next(new customError(" invalid credential", 400));

    const Token = await isUserExist.generateAuthToken();

    console.log(Token);

    res.cookie("Token", Token);

    res.status(200).json({
      success: true,
      message: "user successfully logged in",
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports.userLogoutController = async (req, res, next) => {
  const { Token } = req.cookies;
  console.log(Token)
  try {
    if (!Token) return next(new customError("User unauthorized", 401));

    const blaclistToken = await cacheClient.set(
      Token,
      "blacklisted",
      "EX",
      3600
    );

    res.clearCookie("Token");
    res.status(200).json({ message: "user logged out" });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};
