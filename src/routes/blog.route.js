const express = require('express')
const router = express.Router()
const { blogCreateController, singleBlogReadController, blogUpdateController, blogDeleteController, allBlogReadController, blogLikesController } = require('../controllers/blog.controller')
const { userAuthController} = require('../middlewares/authMiddleware')
const upload = require('../service/upload.multer')

router.post('/create', userAuthController, upload.single("image"), blogCreateController )
router.get('/read/:id', userAuthController, singleBlogReadController )
router.get('/feed', allBlogReadController )
router.put('/update/:id', userAuthController, upload.single("image"), blogUpdateController )
router.delete('/delete/:id', userAuthController, blogDeleteController )
router.post('/like/:id',userAuthController, blogLikesController)

module.exports = router