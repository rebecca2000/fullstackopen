const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  })
  
blogsRouter.post('/', async(request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async(request, response) => {
  const resp = await Blog.findByIdAndDelete(request.params.id)
  if (resp) {
    response.status(204).end()
  }
  response.status(404).end()
})

blogsRouter.put('/:id', async(request, response) => {
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