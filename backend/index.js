require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


let dbConnected = false;
app.get('/api/health', (req, res) => {
  res.json({ ok: true, dbConnected });
});


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || '';

function startServer() {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      dbConnected = true;
      console.log('MongoDB connected');
      startServer();
    })
    .catch((err) => {
      console.error('DB connection error:', err.message || err);
      if (process.env.NODE_ENV === 'development' || process.env.FORCE_START === 'true') {
        console.warn('Starting server');
        startServer();
      } else {
        process.exit(1);
      }
    });
} else {
  console.warn('No MONGO_URI provided');
  startServer();
}
