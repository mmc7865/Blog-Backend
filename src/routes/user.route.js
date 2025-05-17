const express = require('express')
const route = express.Router()
const {userRegisterController, userLoginController, userLogoutController} = require('../controllers/user.controller')

route.post('/register', userRegisterController)
route.post('/login', userLoginController)
route.get('/logout', userLogoutController)


module.exports = route