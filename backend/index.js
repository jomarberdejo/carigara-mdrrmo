
const express = require('express');
const app = express();

const path = require('path');

const cors = require('cors');
require('dotenv').config();


const usersRoutes = require('./routes/users')
const reportsRoutes = require('./routes/reports')
const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboard')
const eventsRoutes = require('./routes/events')

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
app.use('/api/users', usersRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/events', eventsRoutes)