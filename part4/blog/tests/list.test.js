const listHelper = require('../utils/list_helper')
const testTools = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {
    test('of one blog is the likes of that blog', () => {
      expect(listHelper.totalLikes(testTools.oneBlog)).toBe(5)
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.totalLikes(testTools.manyBlogs)).toBe(36)
    })
  
    test('of empty array is zero', () => {
      expect(listHelper.totalLikes([])).toBe(0)
    })
})

describe('favouriteBlog', () => {
    test('of one blog is that blog', () => {
      expect(listHelper.favouriteBlog(testTools.oneBlog)).toEqual(testTools.oneBlog[0])
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.favouriteBlog(testTools.manyBlogs)).toBe(testTools.manyBlogs[2])
    })
  
    test('of empty array is empty object', () => {
      expect(listHelper.favouriteBlog([])).toStrictEqual({})
    })
})

describe('mostBlogs', () => {
    test('of one blog is its author', () => {
      expect(listHelper.mostBlogs(testTools.oneBlog)).toEqual({author: testTools.oneBlog[0].author, blogs: 1})
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.mostBlogs(testTools.manyBlogs)).toStrictEqual({author: 'Robert C. Martin', blogs: 3})
    })
  
    test('of empty array is empty object', () => {
      expect(listHelper.mostBlogs([])).toStrictEqual({})
    })
})

describe('mostLikes', () => {
    test('of one blog is its author', () => {
      expect(listHelper.mostLikes(testTools.oneBlog)).toEqual({author: testTools.oneBlog[0].author, likes: testTools.oneBlog[0].likes})
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.mostLikes(testTools.manyBlogs)).toStrictEqual({author: "Edsger W. Dijkstra", likes: 17})
    })
  
    test('of empty array is empty object', () => {
      expect(listHelper.mostLikes([])).toStrictEqual({})
    })
})