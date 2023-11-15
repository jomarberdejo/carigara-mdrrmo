const mysql = require('mysql')

const configValues = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mdrrmo',
}

const connection = mysql.createConnection({...configValues})

module.exports = connection