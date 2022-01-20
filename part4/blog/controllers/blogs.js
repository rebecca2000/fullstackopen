const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
  })
  
blogsRouter.post('/', async(request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    ... request.body,
    user: user.id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(String(savedBlog._id))
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async(request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blogToDelete = (await Blog.find({ _id: request.params.id }))[0]
  if (!blogToDelete) {
    return response.status(404).json({ error: 'blog does not exist' })
  }
  if (String(blogToDelete.user) !== String(decodedToken.id)) {
    return response.status(403).json({ error: 'user does not have permission to delete blog' })
  }

  const resp = await Blog.findOneAndDelete({ _id: request.params.id })
  const user = (await User.find({ _id: resp.user }))[0]
  user.blogs = user.blogs.filter(b => String(b) !== String(resp._id))
  await user.save()
  response.status(200).json(resp)
})

blogsRouter.put('/:id', async(request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const body = request.body
  const blog = {}
  if (body.title) {blog.title = body.title}
  if (body.author) {blog.author = body.author}
  if (body.url) {blog.url = body.url}
  if (body.likes) {blog.likes = body.likes}
  const resp = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  resp ? response.status(200).json(resp)
       : response.status(404).end()
})

module.exports = blogsRouter