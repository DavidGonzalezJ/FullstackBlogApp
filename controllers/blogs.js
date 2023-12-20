const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

//Just testing
blogsRouter.get('/hello', (request, response) => {
    response.send('Hello World!')
})

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user',
      { name:1, username:1 })

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const users = await User.find({})
    const user = users[0]

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end() 
})

blogsRouter.put('/:id', async (request, response) => {
  const {title, author, url, likes} = request.body


  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    {title, author, url, likes},
    {new:true, runValidators: true, context: 'query'})
  
  response.json(updatedBlog)
})

module.exports = blogsRouter