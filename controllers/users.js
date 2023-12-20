const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//Just testing
/*blogsRouter.get('/hello', (request, response) => {
    response.send('Hello World!')
})*/

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('blogs',{ title:1, author:1 , url:1 , likes:1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    
    if(!body.password || body.password.length < 3){
        return response.status(401).json({error:'password invalid'})
    }

    const saltRounds = 10
    const passHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passHash,
    })

    const result = await user.save()
    response.status(201).json(result)
})

/*blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end() 
})

blogsRouter.put('/:id', async (request, response) => {
  const {title, author, url, likes} = request.body


  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    {title, author, url, likes},
    {new:true, runValidators: true, context: 'query'})
  
  response.json(updatedBlog)
})*/

module.exports = usersRouter