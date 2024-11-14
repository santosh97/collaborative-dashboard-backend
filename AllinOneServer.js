'use strict';
/*******
 * AllinOneServer.js: all code in one file
 * 
 * 11/2024 Santosh Dubey
 *
 */


const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/widgetsDB', {
}).then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(cors());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    next();
//  JWT patch
//     const token = req.headers['authorization'];
//   if (!token) return res.status(401).json({ message: 'Access token required' });

//   jwt.verify(token, 'your-secret-key', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   });
};

// Rate limiting for API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', apiLimiter);

// Widget schema and model
const widgetSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  updatedBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Widget = mongoose.model('Widget', widgetSchema);

// RESTful API endpoints
app.get('/api/widgets', authenticateToken, async (req, res) => {
  const widgets = await Widget.find();
  res.json(widgets);
});

app.post('/api/widgets', authenticateToken, async (req, res) => {
  const widget = new Widget(req.body);
  await widget.save();
  io.emit('widget-created', widget);
  res.status(201).json(widget);
});

app.put('/api/widgets/:id', authenticateToken, async (req, res) => {
  const widget = await Widget.findByIdAndUpdate(req.params.id, req.body, { new: true });
  io.emit('widget-updated', widget);
  res.json(widget);
});

app.delete('/api/widgets/:id', authenticateToken, async (req, res) => {
  await Widget.findByIdAndDelete(req.params.id);
  io.emit('widget-deleted', req.params.id);
  res.status(204).send();
});

// WebSocket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = user;
    next();
  });
});

// WebSocket rate limiting
const userMessageCounts = {};

io.on('connection', (socket) => {
  userMessageCounts[socket.id] = 0;

  socket.on('edit-widget', async (widgetData) => {
    if (userMessageCounts[socket.id] < 10) {
      userMessageCounts[socket.id]++;
      const updatedWidget = await Widget.findByIdAndUpdate(
        widgetData._id,
        widgetData,
        { new: true }
      );
      io.emit('widget-updated', updatedWidget);

      setTimeout(() => {
        userMessageCounts[socket.id]--;
      }, 60000); // 1-minute cooldown
    } else {
      socket.emit('error', 'Rate limit exceeded. Try again later.');
    }
  });

  socket.on('disconnect', () => {
    delete userMessageCounts[socket.id];
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
