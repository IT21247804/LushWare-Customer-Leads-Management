// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');

// Routers
const leadsRouter = require('./routes/leads');
const customerRouter = require('./routes/customer');
const followUpRouter = require('./routes/followUpRoutes');
const notificationRouter = require('./routes/notificationRoutes');

// Initialize Cron Jobs
require('./cron/followUpCron'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/api/health', (req, res) => 
  res.json({ status: 'ok', timestamp: Date.now() })
);

// Routes
app.use('/api/leads', leadsRouter);
app.use('/api/customer', customerRouter);
app.use('/api/followups', followUpRouter);
app.use('/api/notifications', notificationRouter);

// Start Server After DB Connection
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Graceful Shutdown
process.on('SIGINT', () => {
  const mongoose = require('mongoose');
  mongoose.disconnect().finally(() => {
    console.log('Shutdown complete');
    process.exit(0);
  });
});
