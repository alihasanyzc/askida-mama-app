const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const corsOptions = require('./config/cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const env = require('./config/env');

const app = express();

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

// Güvenlik
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger (development)
if (env.isDev) {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', generalLimiter);

// ==========================================
// ROUTES
// ==========================================

app.use('/api', routes);

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use(notFoundHandler);

// Global error handler (en sonda olmalı)
app.use(errorHandler);

module.exports = app;
