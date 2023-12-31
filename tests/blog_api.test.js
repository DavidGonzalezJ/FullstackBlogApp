const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

//Let for storing the token
let token

beforeEach(async()=>{
    await User.deleteMany({})
    const user = {
        name: 'Luis Miguel',
        username: "luismi",
        password: "nochentera"
    }

    await api.post('/api/users').send(user)

    const res = await api.post('/api/login').send(user)
    
    token = res.body.token

    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs){
        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
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
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    notesEnd = await helper.blogsInDB()
    expect(notesEnd).toHaveLength(helper.initialBlogs.length+1)
})

test('POST requests fail 401 if token is not provided', async () =>{
    const newBlog = {
        title: 'Si bastasen un par de canciones',
        author: 'Eros Ramazotti',
        url: 'https://www.youtube.com/watch?v=BP1MrzirtEo',
        likes: 69
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})

test('if likes property is not defined it is initialized at 0', async()=>{
    const newBlog = {
        title: 'Si bastasen un par de canciones',
        author: 'Eros Ramazotti',
        url: 'https://www.youtube.com/watch?v=BP1MrzirtEo',
    }

    const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

    expect(res.body.likes).toBe(0)
})

test('if title or url are missing the response is 400 bad request', async() =>{
    const blogWithNoTitle = {
        author: 'Eros Ramazotti',
        url: 'https://www.youtube.com/watch?v=BP1MrzirtEo',
        likes: 897
    }
    const blogWithNoUrl = {
        title: 'Si bastasen un par de canciones',
        author: 'Eros Ramazotti',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithNoTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithNoUrl)
        .expect(400)
},)

test('DELETE requests delete blogs succesfully', async () =>{
    const res = await api.get('/api/blogs')
    const idToDelete = res.body[0].id.toString()

    await api.delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    
    const newRes = await api.get('/api/blogs')
    expect(res.body).toHaveLength(newRes.body.length + 1)
})

test('PUT requests update blogs succesfully', async () => {
    const blogToUpdate = {
        title: 'Mine Sweeper',
        author: 'Harry Osborn',
        url: 'https://onesquareminesweeper.com/',
        likes: 222
    }
    const res = await api.get('/api/blogs')
    const idToUpdate = res.body[0].id.toString()
    const initialLikes = res.body[0].likes

    await api.put(`/api/blogs/${idToUpdate}`)
        .send(blogToUpdate)
        .expect(200)
    
    const response = await api.get(`/api/blogs/${idToUpdate}`)
    expect(response.body.likes).not.toBe(initialLikes)
})

describe('test user creation and possible errors', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    test('valid user and password returns OK', async () => {
        const newUser = {
            username: 'macaulay',
            name: 'Macaulay Culkin',
            password: 'trisomias'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })

    test('valid user and invalid password returns error 401', async () => {
        const newUser = {
            username: 'macaulay',
            password: '2o'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(401)
    })

    test('invalid user and valid password returns error 400', async () => {
        const newUser = {
            username: 'ma',
            name: 'Macaulay Culkin',
            password: 'lotinaMalo'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('invalid user and invalid password returns error 401', async () => {
        const newUser = {
            username: 'ma',
            name: 'Macaulay Culkin',
            password: 'lo'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(401)
    })

    test('repeated user returns error validation error 400', async () => {
        const newUser = {
            username: 'macaulay',
            name: 'Macaulay Culkin',
            password: 'trisomias'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const repUser = {
            username: 'macaulay',
            name: 'Magalinn',
            password: 'tromias'
        }

        await api
            .post('/api/users')
            .send(repUser)
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})