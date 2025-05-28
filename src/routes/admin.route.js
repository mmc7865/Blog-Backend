const express = require('express')
const { userAuthController } = require('../middlewares/authMiddleware')
const { getAllUserController } = require('../controllers/admin.controller')
const route = express.Router()


route.get('/getAllUser', userAuthController, getAllUserController)

module.exports = route