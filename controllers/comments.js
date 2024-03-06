const Comment = require('../models/comment')
const Blog = require('../models/blog')
const commentsRouter = require('express').Router()
const middleware = require('../utils/middleware')

commentsRouter.get('/:id/comments', async(request, response) => {
    const comments = await Comment.find({}).populate('blog',
    { title:1, id:1 })
    const blogComments = comments.filter(c => c.blog.id === request.params.id)
    response.json(blogComments)
})

commentsRouter.post('/:id/comments', async(request, response) => {
    const body = request.body
    const blogId = request.params.id

    const comment = new Comment({
        content: body.content,
        blog: blogId
    })

    const savedComment = await comment.save()
    const blog = await Blog.findById(request.params.id)

    blog.comments = blog.comments.concat(savedComment.id)
    await blog.save()

    response.status(201).json(savedComment)
})

module.exports = commentsRouter