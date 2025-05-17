const User = require("../models/user.modle");
const CustomError = require("../utils/cutomError");
const jwt = require("jsonwebtoken");
const cacheClient = require('../service/cache.service')

module.exports.userAuthController = async (req, res, next) => {
  try {
    const { Token } = req.cookies;
    if (!Token) return next(new CustomError("Unauthorized Token", 401));

    const decode = jwt.verify(Token, process.env.JWT_SECRET);
    if (!decode) return next(new CustomError("token mismatched", 400));
    // console.log("Decode:--> ",decode)
    const user = await User.findById(decode.id)
    // console.log(user)
    req.user = user

    next();
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
