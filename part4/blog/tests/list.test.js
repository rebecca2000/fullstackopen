const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const oneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]
const manyBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
]
describe('totalLikes', () => {
    test('of one blog is the likes of that blog', () => {
      expect(listHelper.totalLikes(oneBlog)).toBe(5)
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.totalLikes(manyBlogs)).toBe(36)
    })
  
    test('of empty array is zero', () => {
      expect(listHelper.totalLikes([])).toBe(0)
    })
})

describe('favouriteBlog', () => {
    test('of one blog is that blog', () => {
      expect(listHelper.favouriteBlog(oneBlog)).toEqual(oneBlog[0])
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.favouriteBlog(manyBlogs)).toBe(manyBlogs[2])
    })
  
    test('of empty array is empty object', () => {
      expect(listHelper.favouriteBlog([])).toStrictEqual({})
    })
})

describe('mostBlogs', () => {
    test('of one blog is its author', () => {
      expect(listHelper.mostBlogs(oneBlog)).toEqual({author: oneBlog[0].author, blogs: 1})
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.mostBlogs(manyBlogs)).toStrictEqual({author: 'Robert C. Martin', blogs: 3})
    })
  
    test('of empty array is empty object', () => {
      expect(listHelper.mostBlogs([])).toStrictEqual({})
    })
})

describe('mostLikes', () => {
    test('of one blog is its author', () => {
      expect(listHelper.mostLikes(oneBlog)).toEqual({author: oneBlog[0].author, likes: oneBlog[0].likes})
    })
  
    test('of many is calculated right', () => {
      expect(listHelper.mostLikes(manyBlogs)).toStrictEqual({author: "Edsger W. Dijkstra", likes: 17})
    })
  
    test('of empty array is empty object', () => {
      expect(listHelper.mostLikes([])).toStrictEqual({})
    })
})