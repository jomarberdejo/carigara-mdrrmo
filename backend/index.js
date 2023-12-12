const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.PORT_ORIGIN

  }
});



const path = require('path');
const usersRoutes = require('./routes/users');
const reportsRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const eventsRoutes = require('./routes/events');



const connection = require('./dbConfig/db');
const PORT = process.env.PORT_NUMBER;

io.on('connection', (socket) => {
    // console.log('A user connected');
    

    socket.on('notification', (data) => {
    //   console.log('Notification:', data);
      io.emit('notification', data);
    });
  
    // socket.on('disconnect', () => {
    //   console.log('User disconnected');
    // });
});

if (connection){
    server.listen(PORT, '0.0.0.0', () => {
        console.log('Connected and app is running on port ', PORT);
    });
}


app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventsRoutes);

