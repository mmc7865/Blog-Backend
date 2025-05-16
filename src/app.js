const express = require('express')
const app = express()
const userRoute = require('./routes/user.route')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.json())

app.use('/user', userRoute)

module.exports = app