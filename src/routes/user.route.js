const express = require('express')
const route = express.Router()
const {userRegisterController, userLoginController} = require('../controllers/user.controller')

route.post('/register', userRegisterController)
route.post('/login', userLoginController)


module.exports = route