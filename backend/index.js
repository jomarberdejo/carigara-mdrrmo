const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});

app.use(cors());

require('dotenv').config();
const path = require('path');
const usersRoutes = require('./routes/users');
const reportsRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const eventsRoutes = require('./routes/events');

app.use('/uploads/reports', express.static(path.join(__dirname, 'uploads/reports')));
app.use(express.json());

const connection = require('./dbConfig/db');
const PORT = process.env.PORT_NUMBER;

io.on('connection', (socket) => {
    console.log('A user connected');
    

    socket.on('notification', (data) => {
    //   console.log('Notification:', data);
      io.emit('notification', data);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
});

if (connection){
    server.listen(PORT, () => {
        console.log('Connected and app is running on port ', PORT);
    });
}

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventsRoutes);

