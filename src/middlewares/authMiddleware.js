const User = require("../models/user.modle");
const CustomError = require("../utils/cutomError");
const jwt = require("jsonwebtoken");

module.exports.userAuthController = async (req, res, next) => {
  try {
    const { Token } = req.cookies;
    if (!Token) return next(new CustomError("Unauthorized Token", 401));

    const decode = jwt.verify(Token, process.env.JWT_SECRET);
    if (!decode) return next(new CustomError("token mismatched", 400));
    
    const user = await User.findById(decode.id)
    if(!user) return next(new CustomError('user not found', 404))
    req.user = user
    
      next();
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

