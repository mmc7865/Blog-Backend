const express = require('express')
const router = express.Router()
const { blogCreateController, blogReadController, blogUpdateController, blogDeleteController } = require('../controllers/blog.controller')
const { userAuthController} = require('../middlewares/authMiddleware')

router.post('/create', userAuthController, blogCreateController )
router.get('/read/:id', userAuthController, blogReadController )
router.put('/update/:id', userAuthController, blogUpdateController )
router.delete('/delete/:id', userAuthController, blogDeleteController )

module.exports = router