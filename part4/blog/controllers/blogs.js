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

module.exports = blogsRouter