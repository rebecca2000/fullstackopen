

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce(function(prevBlog, curBlog) {
        return {
            likes: prevBlog.likes + curBlog.likes
        } 
    }, {likes: 0}).likes
}

const favouriteBlog = (blogs) => {
    return blogs.reduce(function(prevBlog, curBlog) {
        return prevBlog.likes > curBlog.likes
            ? prevBlog
            : curBlog
    }, {})
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const blogsPublished = new Map()
    blogs.forEach(function(blog) {
        if (!blogsPublished.has(blog.author)) {
            blogsPublished.set(blog.author, 1)
        } else {
            blogsPublished.set(blog.author, blogsPublished.get(blog.author)+1)
        }

    })
    console.log(blogsPublished)
    let topAuthor = {author: '', blogs: 0}
    for (const [key, val] of blogsPublished.entries()) {
        if (val > topAuthor.blogs) {
            topAuthor.author = key
            topAuthor.blogs = val
        }
    }
    return topAuthor
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const blogsPublished = new Map()
    blogs.forEach(function(blog) {
        if (!blogsPublished.has(blog.author)) {
            blogsPublished.set(blog.author, blog.likes)
        } else {
            blogsPublished.set(blog.author, blogsPublished.get(blog.author)+blog.likes)
        }

    })
    console.log(blogsPublished)
    let topAuthor = {author: '', likes: 0}
    for (const [key, val] of blogsPublished.entries()) {
        if (val > topAuthor.likes) {
            topAuthor.author = key
            topAuthor.likes = val
        }
    }
    return topAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}