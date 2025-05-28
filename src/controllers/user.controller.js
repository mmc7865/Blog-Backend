const User = require("../models/user.modle");
const customError = require("../utils/cutomError");
const bcrypt = require("bcrypt");
const cacheClient = require("../service/cache.service");
const uploadImage = require("../config/imagekit");

module.exports.userRegisterController = async (req, res, next) => {
  const { name, userName, email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) return next(new customError("User already exists", 400));

    const user = await User.create({
      name,
      userName,
      email,
      password
    });

    if (!user) return next(new customError("Error in user creation", 400));

    const Token = await user.generateAuthToken();
    // console.log(Token);

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

    // console.log(Token);

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
  // console.log(Token);
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

module.exports.followerController = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) return next(new customError("ID not fetched", 400));

    const loggedInUserID = req.user._id;
    const { followings } = req.user;

    if (id == loggedInUserID)
      return next(new customError("Unauthorized action", 409));

    const isUserExistInFollowing = followings.includes(id);
    console.log("Exist :-----> ", isUserExistInFollowing);

    if (isUserExistInFollowing) {
      await User.findByIdAndUpdate(
        loggedInUserID,
        {
          $pull: {
            followings: id,
          },
        },
        { new: true }
      );
      const user = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            followers: loggedInUserID,
          },
        },
        { new: true }
      );
      console.log("followers :------->", user.followings);
    } else {
      const followedUser = await User.findByIdAndUpdate(
        id,
        {
          $push: {
            followers: loggedInUserID,
          },
        },
        { new: true }
      );
      const loggedInUser = await User.findByIdAndUpdate(
        loggedInUserID,
        {
          $push: {
            followings: id,
          },
        },
        { new: true }
      );
      if (!followedUser)
        return next(new customError("Error in following", 400));

      res.status(200).json({
        success: true,
        message: "user followed",
        followedUser,
        loggedInUser,
      });
    }
    res.status(200).json({
      success: true,
      message: "user Unfollowed",
    });
  } catch (error) {
    next(new customError(error.message, 500));
  }
};

module.exports.userUpdateController = async (req, res, next) => {
  try {
    const {name, userName, email, password} = req.body
    const file = req.file
    const user = req.user

    if(file){
      user.image = await uploadImage(file)
    }

    if(name){
      user.name = await name
    }
    if(userName){
      user.userName = await userName
    }
    if(email){
      user.email = await email
    }
    if(password){
      user.password = await password
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: "user updated",
      user
    })


  } catch (error) {
    next(new customError(error.message, 500))
  }
}

module.exports.getCurrentUserController = async (req, res, next) => {
  try {
    const loggedInUser = req.user
    res.status(200).json({
      success: true,
      message: "user loggedIn",
      loggedInUser
    })
  } catch (error) {
    next(new customError(error.message))
  }
}
