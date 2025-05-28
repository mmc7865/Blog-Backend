const express = require('express')
const route = express.Router()
const {userRegisterController, userLoginController, userLogoutController, followerController, userUpdateController, getAllUserController, getCurrentUserController} = require('../controllers/user.controller')
const { userAuthController } = require('../middlewares/authMiddleware')
const upload = require('../service/upload.multer')

route.post('/register', userRegisterController)
route.post('/login', userLoginController)
route.put('/update',userAuthController, upload.single("image"),  userUpdateController)
route.get('/logout', userLogoutController)
route.put('/follower/:id',userAuthController, followerController)
route.get('/getCurrentuser', userAuthController, getCurrentUserController)


module.exports = route