const {MONGODB_URI , PORT} = require('./utils/config')
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
require('dotenv').config()

app.use(express.json())

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)



app.use(middleware.errorHandler)

module.exports = app