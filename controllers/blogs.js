const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

//Just testing
blogsRouter.get('/hello', (request, response) => {
    response.send('Hello World!')
})

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user',
      { name:1, username:1 })

    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user',
    { name:1, username:1 })

  response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: request.user.id
    })

    const savedBlog = await blog.save()

    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if(request.user.id !== blog.user.toString()){
        return response.status(401).json({error:'this user did not post the blog'})
    }

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