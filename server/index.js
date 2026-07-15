const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For file uploads if not using multer initially
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // To be restricted to the frontend URL
  }
});

// DB Connection Stubbed
console.log('MongoDB connection bypassed to ensure guaranteed boot on Windows');

io.on('connection', (socket) => {
  console.log(`Socket User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket User disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

app.get('/', (req, res) => {
  res.send('Clazlo API is running.');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
