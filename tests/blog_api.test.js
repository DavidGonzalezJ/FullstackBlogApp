const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async()=>{
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('all blogs are returned in json format',async ()=>{
    const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the unique property of each blog is named id',async()=>{
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('POST requests adds a new post succesfully',async()=>{
    const newBlog = {
        title: 'Si bastasen un par de canciones',
        author: 'Eros Ramazotti',
        url: 'https://www.youtube.com/watch?v=BP1MrzirtEo',
        likes: 69
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    notesEnd = await helper.blogsInDB()
    expect(notesEnd).toHaveLength(helper.initialBlogs.length+1)
})

afterAll(async () => {
    await mongoose.connection.close()
})