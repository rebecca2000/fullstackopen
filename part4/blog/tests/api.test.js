const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const testTools = require('./test_helper')
const bcrypt = require('bcrypt')

const baseBlogURL = '/api/blogs'
const baseUserURL = '/api/users'

const login = async(user) => {
    const response = await api
    .post('/api/login')
    .send({
        'username': user.username,
        'password': user.password
    })
    .expect(200)
    return response.body.token
}

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = testTools.manyBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})
    const user = new User({
        username: testTools.userObj.username, 
        passwordHash: await bcrypt.hash(testTools.userObj.password, 1)
    })
    await user.save()
}, 20000)

describe('GET blog request', () => {
    test('getAll: all blogs are returned', async () => {
        const response = await api.get(baseBlogURL)
                                    .expect(200)
                                    .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(testTools.manyBlogs.length)
      }, 10000)

    test('blog unique identifier is "ID"', async() => {
        const response = await api.get(baseBlogURL)
        
        for (let blog of response.body) {
            expect(blog.id).toBeDefined()
        }
    })
})

describe('POST blog request', () => {
    test('creates new blog post', async() => {
        const token = await login(testTools.userObj)
        await api.post(baseBlogURL)
            .send(testTools.blogObj)
            .auth(token, {type: 'bearer'})
            .expect(201)
        const response = await api.get(baseBlogURL)
        expect(response.body).toHaveLength(testTools.manyBlogs.length+1)
        const addedBlog = response.body.find(b => b.title === testTools.blogObj.title)
        expect(addedBlog.title).toBe(testTools.blogObj.title)
        expect(addedBlog.user.username).toBe(testTools.userObj.username)
    })
    
    test('user must be logged in', async() => {
        await api.post(baseBlogURL)
            .expect(401)
    })

    test('blog.likes defaults to 0 if undefined', async() => {
        const token = await login(testTools.userObj)
        await api.post(baseBlogURL)
                .send({
                    title: 'The Tempest',
                    author: 'Shakespeare',
                    url: 'www.shakespeare.com'
                })
                .auth(token, {type: 'bearer'})
                .expect(201)
        const response = await api.get(baseBlogURL)
        const savedBlog = response.body.find(blog => blog.title === testTools.blogObj.title)
        expect(savedBlog.likes).toBeDefined()
        expect(savedBlog.likes).toBe(0)
    })
    
    test('returns 400 if title and/or url are missing', async() => {
        const token = await login(testTools.userObj)
        await api.post(baseBlogURL)
                .send({
                    author: 'Shakespeare',
                    url: 'www.shakespeare.com'
                })
                .auth(token, {type: 'bearer'})
                .expect(400)
    
        await api.post(baseBlogURL)
                .send({
                    title: 'The Tempest',
                    author: 'Shakespeare'
                })
                .auth(token, {type: 'bearer'})
                .expect(400)
    
        await api.post(baseBlogURL)
                .send({})
                .auth(token, {type: 'bearer'})
                .expect(400)
    })
})

describe('DELETE request', () => {
    test('user must be logged in', async() => {
        await api.delete(`${baseBlogURL}/${testTools.manyBlogs[0]._id}`)
            .expect(401)
    })

    test('author can delete blog, returns 200 on success', async() => {
        const token = await login(testTools.userObj)
        await api.post(baseBlogURL)
            .send(testTools.blogObj)
            .auth(token, {type: 'bearer'})
            .expect(201)
        const response = await api.delete(`${baseBlogURL}/${testTools.blogObj._id}`)
                .auth(token, {type: 'bearer'})
                .expect(200)

        expect(response.body.title).toBe(testTools.blogObj.title)
        const blogsAfterDelete = await api.get(baseBlogURL)
        expect(blogsAfterDelete.body).toHaveLength(testTools.manyBlogs.length)
        const usersAfterDelete = await testTools.usersInDb()
        const user = usersAfterDelete.find(u => u.id === response.body.user)
        expect(user.blogs.map(b => String(b))).not.toContain(response.body.id)
    })

    test('user that is not author cannot delete blog', async() => {
        const token = await login(testTools.userObj)
        await api.post(baseBlogURL)
            .send(testTools.blogObj)
            .auth(token, {type: 'bearer'})
            .expect(201)

        const newUser = {
            username: 'newUser', 
            password: 'password'
        }
        await new User({
            username: newUser.username,
            passwordHash: await bcrypt.hash(newUser.password, 1)
        }).save()

        const token2 = await login({
            username: newUser.username,
            password: newUser.password
        })
        await api.delete(`${baseBlogURL}/${testTools.blogObj._id}`)
            .auth(token2, {type: 'bearer'})
            .expect(403)
    })

    test('returns 404 if blog does not exist', async() => {
        const token = await login(testTools.userObj)
        const fakeID = '111111111111111111111111'
        await api.delete(`${baseBlogURL}/${fakeID}`)
                    .auth(token, {type: 'bearer'})
                    .expect(404)
        const blogs = await api.get(baseBlogURL)
        expect(blogs.body).toHaveLength(testTools.manyBlogs.length)
    })
})

describe('UPDATE request', () => {
    test('user must be logged in', async() => {
        await api.put(`${baseBlogURL}/${testTools.blogObj._id}`)
            .expect(401)
    })

    test('updates blog and returns 200 on success', async() => {
        const token = await login(testTools.userObj)
        const updatedBlog = {...testTools.manyBlogs[0]}
        updatedBlog.likes+1
        const returnedBlog = await api.put(`${baseBlogURL}/${updatedBlog._id}`)
                                    .auth(token, {type: 'bearer'})
                                    .send(updatedBlog)
                                    .expect(200)
        expect(returnedBlog.body._id).toBe(updatedBlog.id)
        expect(returnedBlog.body.title).toBe(updatedBlog.title)
        expect(returnedBlog.body.author).toBe(updatedBlog.author)
        expect(returnedBlog.body.url).toBe(updatedBlog.url)
        expect(returnedBlog.body.likes).toBe(updatedBlog.likes)
        
        const allBlogs = await api.get(baseBlogURL)
        expect(allBlogs.body).toHaveLength(testTools.manyBlogs.length)
        expect(allBlogs.body.map(b => b.title)).toContain(updatedBlog.title)
    })

    test('returns 404 if blog does not exist', async() => {
        const token = await login(testTools.userObj)
        const fakeID = '111111111111111111111111'
        await api.put(`${baseBlogURL}/${fakeID}`)
                    .auth(token, {type: 'bearer'})
                    .expect(404)
        const blogs = await api.get(baseBlogURL)
        expect(blogs.body).toHaveLength(testTools.manyBlogs.length)
    })
})

describe('User requests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const userObjects = testTools.manyUsers
          .map(u => new User(u))
        const promiseArray = userObjects.map(u => u.save())
        await Promise.all(promiseArray)
    }, 10000)

    test('getAll: all users are returned', async () => {
        const response = await api.get(baseUserURL)
                                    .expect(200)
                                    .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(testTools.manyUsers.length)
      }, 20000)

    test('POST: valid user can be created', async () => {
        await api.post(baseUserURL)
            .send(testTools.userObj)
        const response = await api.get(baseUserURL)
        expect(response.body).toHaveLength(testTools.manyUsers.length+1)
        const usernames = response.body.map(r => r.username)
        expect(usernames).toContain(testTools.userObj.username)
    })

    test('POST: invalid user cannot be created', async () => {
        // username too short (< 3 characters)
        await api.post(baseUserURL)
            .send({
                username: 'ab',
                password:'password'
            })
            .expect(400)

        // password too short (< 3 characters)
        await api.post(baseUserURL)
            .send({
                username: 'username',
                password:'ab'
            })
            .expect(400)

        // duplicate username
        await api.post(baseUserURL)
            .send(testTools.userObj)
            .expect(200)
        await api.post(baseUserURL)
            .send(testTools.userObj)
            .expect(400)        
    })
})

afterAll(() => {
    mongoose.connection.close()
})