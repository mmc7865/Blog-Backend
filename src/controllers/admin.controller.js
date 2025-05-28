const User = require('../models/user.modle')
const customError = require('../utils/cutomError')


module.exports.getAllUserController = async (req, res, next) => {
  try {
    if(!req.user.isAdmin) return next(new customError('Access Denied!', 403))
    let users = await User.find()
    if(!users) return next(new customError('Error in users fetching', 400))
    
      users = users.filter(user => user.isAdmin === false)
      res.status(200).json({
        success: true,
        message: "Users fetched",
        users
      })
  } catch (error) {
    next(new customError(error.message, 500))
  }
}