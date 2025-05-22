const express = require('express')
const route = express.Router()
const {userRegisterController, userLoginController, userLogoutController, followerController} = require('../controllers/user.controller')
const { userAuthController } = require('../middlewares/authMiddleware')

route.post('/register', userRegisterController)
route.post('/login', userLoginController)
route.get('/logout', userLogoutController)
route.post('/follower/:id',userAuthController, followerController)


module.exports = route