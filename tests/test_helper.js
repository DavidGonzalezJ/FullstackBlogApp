const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Mine Sweeper',
        author: 'Harry Osborn',
        url: 'https://onesquareminesweeper.com/',
        likes: 112
    },
    {
        title: 'El Nano',
        author: 'Melendi',
        url: 'https://www.youtube.com/watch?v=oq9HlVE86OA',
        likes: 33
    }
]

const blogsInDB = async() =>{
    const blogs = await Blog.find({})
    return blogs.map((blog)=>blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDB
}