
const express = require('express')

const path = require('path');

const cors = require('cors');
require('dotenv').config();



const usersRoute = require('./routes/users')
const reportsRoute = require('./routes/reports')
const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboard')
const app = express();
app.use(cors())
app.use('/uploads/reports', express.static(path.join(__dirname, 'uploads/reports')));

app.use(express.json());



const connection = require('./dbConfig/db')


const PORT = process.env.PORT_NUMBER

if (connection){
    app.listen(PORT, () => {
        console.log('Connected and app is running on port ', PORT)
    })
}
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoute)
app.use('/api/reports', reportsRoute)
app.use('/api/dashboard', dashboardRoutes)