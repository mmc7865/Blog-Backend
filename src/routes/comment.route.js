const express = require('express')
const { userAuthController } = require('../middlewares/authMiddleware')
const { createCommentController, updateCommentController, readAllCommentsController, deleteCommentController } = require('../controllers/comment.controller')
const router = express.Router()

router.post('/create/:id',userAuthController, createCommentController)
router.patch('/edit/:id', userAuthController, updateCommentController)
router.get('/getAllComments/:id', userAuthController, readAllCommentsController)
router.delete('/delete/:id', userAuthController, deleteCommentController)

module.exports = router