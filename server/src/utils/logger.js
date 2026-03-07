const env = require('../config/env');

/**
 * Basit Logger - Ortama göre log seviyesi
 */
const logger = {
  info: (...args) => {
    console.log(`[${new Date().toISOString()}] [INFO]`, ...args);
  },

  warn: (...args) => {
    console.warn(`[${new Date().toISOString()}] [WARN]`, ...args);
  },

  error: (...args) => {
    console.error(`[${new Date().toISOString()}] [ERROR]`, ...args);
  },

  debug: (...args) => {
    if (env.isDev) {
      console.debug(`[${new Date().toISOString()}] [DEBUG]`, ...args);
    }
  },

  // Request logger
  request: (req) => {
    if (env.isDev) {
      console.log(
        `[${new Date().toISOString()}] [REQ] ${req.method} ${req.originalUrl}`,
      );
    }
  },
};

module.exports = logger;
