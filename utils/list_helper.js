const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0
    blogs.map((blog)=>{
        total += blog.likes
    })
    return total
}

const favoriteBlog = (blogs) => {
    let mostLiked = {}
    let mostLikes = 0

    blogs.map((blog)=>{
        if(blog.likes > mostLikes){
            mostLikes = blog.likes
            mostLiked = {
                'title': blog.title,
                'author': blog.author,
                'likes': blog.likes
            }
        }
    })

    return mostLiked
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) 
        return {}

    const authorBlogs = lodash.countBy(blogs,'author')

    const authorName = lodash.maxBy(Object.keys(authorBlogs), author => authorBlogs[author]) 
    const bestAuthor = {
        author : authorName,
        blogs : authorBlogs[authorName]
    }

    return bestAuthor
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs
}