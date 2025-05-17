const express = require('express')
const app = express()
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.json())

app.use('/user', userRoute)
app.use('/blog', blogRoute)





module.exports = app