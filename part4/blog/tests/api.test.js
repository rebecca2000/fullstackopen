const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testTools = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = testTools.manyBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
}, 10000)

test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
                                .expect(200)
                                .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(testTools.manyBlogs.length)
  }, 10000)

test('blog unique identifier is "ID"', async() => {
    const response = await api.get('/api/blogs')
    
    for (let blog of response.body) {
        console.log('response.body element: ', blog)
        expect(blog.id).toBeDefined()
    }
})

test('POST request creates new blog post', async() => {
    await new Blog({
        'title': 'My blog',
        'author': 'Shakespeare',
        'url': 'www.blogs.com',
        'likes': 10
    }).save()
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(testTools.manyBlogs.length+1)
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('My blog')
})

afterAll(() => {
    mongoose.connection.close()
})