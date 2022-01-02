require('dotenv').config()

const PORT = 3003
const DB_URI = process.env.NODE_ENV === 'test' 
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
    DB_URI,
    PORT
}