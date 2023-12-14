const {MONGODB_URI , PORT} = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
require('dotenv').config()

app.use(express.json())

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app