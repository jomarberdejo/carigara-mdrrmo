const mysql = require('mysql')

require('dotenv').config()

const configValues = {
    host: process.env.LOCALHOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}

// console.log(configValues)

const connection = mysql.createConnection({...configValues})

module.exports = connection