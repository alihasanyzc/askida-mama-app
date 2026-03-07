const env = require('./env');

const corsOptions = {
  origin: env.isDev
    ? true // Development'ta tüm origin'lere izin ver
    : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 saat preflight cache
};

module.exports = corsOptions;
