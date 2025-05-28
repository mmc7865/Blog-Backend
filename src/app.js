const express = require('express')
const app = express()
const userRoute = require('./routes/user.route')
const adminRoute = require('./routes/admin.route')
const blogRoute = require('./routes/blog.route')
const commentRoute = require('./routes/comment.route')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.json())


app.use('/user', userRoute)
app.use('/blog', blogRoute)
app.use('/comment', commentRoute )
app.use('/admin', adminRoute)





module.exports = app