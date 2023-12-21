const jwt = require('jsonwebtoken')
const User = require('../models/user')

//Error handling Middleware
const errorHandler = (error, request, response, next) => {
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError'){
      return response.status(401).json({ error: error.message })
    }
  
    next(error)
}

//Decoding request tokens middleware
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()
}

//Getting users from tokens middleware
const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      return response.status(401).json({error:'invalid token'})
    }

    request.user = await User.findById(decodedToken.id)

    next()
}

module.exports = {errorHandler,tokenExtractor, userExtractor}