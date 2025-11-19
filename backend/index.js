// ...existing code...
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const leadsRouter = require('./routes/leads');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

// Mount leads routes
app.use('/leads', leadsRouter);

// Start server after DB connects
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  const mongoose = require('mongoose');
  mongoose.disconnect().finally(() => {
    console.log('Shutdown complete');
    process.exit(0);
  });
});
// ...existing code...
