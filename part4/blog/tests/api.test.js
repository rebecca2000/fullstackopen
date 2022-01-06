const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testTools = require('./test_helper')

const baseURL = '/api/blogs'

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = testTools.manyBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
}, 10000)

describe('GET request', () => {
    test('getAll: all blogs are returned', async () => {
        const response = await api.get(baseURL)
                                    .expect(200)
                                    .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(testTools.manyBlogs.length)
      }, 10000)

    test('blog unique identifier is "ID"', async() => {
        const response = await api.get(baseURL)
        
        for (let blog of response.body) {
            expect(blog.id).toBeDefined()
        }
    })
})

describe('POST request', () => {
    test('creates new blog post', async() => {
        await api.post(baseURL)
                .send({
                    title: 'The Tempest',
                    author: 'Shakespeare',
                    url: 'www.shakespeare.com',
                    likes: 5
                })
        const response = await api.get(baseURL)
        expect(response.body).toHaveLength(testTools.manyBlogs.length+1)
        const titles = response.body.map(r => r.title)
        expect(titles).toContain('The Tempest')
    })
    
    test('blog.likes defaults to 0 if undefined', async() => {
        await api.post(baseURL)
                .send({
                    title: 'The Tempest',
                    author: 'Shakespeare',
                    url: 'www.shakespeare.com'
                })
        const response = await api.get(baseURL)
        const savedBlog = response.body.find(blog => blog.title === 'The Tempest')
        expect(savedBlog.likes).toBeDefined()
        expect(savedBlog.likes).toBe(0)
    })
    
    test('returns 400 if title and/or url are missing', async() => {
        await api.post(baseURL)
                .send({
                    author: 'Shakespeare',
                    url: 'www.shakespeare.com'
                })
                .expect(400)
    
        await api.post(baseURL)
                .send({
                    title: 'The Tempest',
                    author: 'Shakespeare'
                })
                .expect(400)
    
        await api.post(baseURL)
                .send({})
                .expect(400)
    })
})

describe('DELETE request', () => {
    test('deletes blog and returns 204 on success', async() => {
        const newBlog = await api.post(baseURL)
                                .send(testTools.blogObj).expect(201)
        const blogs = await api.get(baseURL)
        expect(blogs.body).toHaveLength(testTools.manyBlogs.length+1)
        await api.delete(`${baseURL}/${newBlog.body.id}`)
                    .expect(204)
        const blogsAfterDelete = await api.get(baseURL)
        expect(blogsAfterDelete.body).toHaveLength(testTools.manyBlogs.length)
    })

    test('returns 404 if blog does not exist', async() => {
        const fakeID = '111111111111111111111111'
        await api.delete(`${baseURL}/${fakeID}`)
                    .expect(404)
        const blogs = await api.get(baseURL)
        expect(blogs.body).toHaveLength(testTools.manyBlogs.length)
    })
})

describe('UPDATE request', () => {
    test('updates blog and returns 204 on success', async() => {
        const updatedBlog = {
            id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 8,
          }

        const returnedBlog = await api.put(`${baseURL}/${updatedBlog.id}`).expect(200)
                                .send(updatedBlog).expect(200)
        expect(returnedBlog.body.id).toBe(updatedBlog.id)
        expect(returnedBlog.body.title).toBe(updatedBlog.title)
        expect(returnedBlog.body.author).toBe(updatedBlog.author)
        expect(returnedBlog.body.url).toBe(updatedBlog.url)
        expect(returnedBlog.body.likes).toBe(updatedBlog.likes)
        
        const allBlogs = await api.get(baseURL)
        expect(allBlogs.body).toHaveLength(testTools.manyBlogs.length)
        expect(allBlogs.body.map(b => b.title)).toContain(updatedBlog.title)
    })

    test('returns 404 if blog does not exist', async() => {
        const fakeID = '111111111111111111111111'
        await api.put(`${baseURL}/${fakeID}`)
                    .expect(404)
        const blogs = await api.get(baseURL)
        expect(blogs.body).toHaveLength(testTools.manyBlogs.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})