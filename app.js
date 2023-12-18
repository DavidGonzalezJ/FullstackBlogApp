const {MONGODB_URI , PORT} = require('./utils/config')
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express()
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.json())

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

//Error handling Middleware
const errorHandler = (error, request, response, next) => {
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler)

module.exports = app