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

module.exports = {
    dummy, totalLikes, favoriteBlog
}