require('dotenv').config()

const PORT = 3003
const DB_URI = process.env.MONGODB_URI

module.exports = {
    DB_URI,
    PORT
}