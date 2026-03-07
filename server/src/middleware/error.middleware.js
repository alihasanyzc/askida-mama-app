const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Global Error Handler Middleware
 * Tüm hataları yakalar ve standart formatta döner
 */
const errorHandler = (err, req, res, _next) => {
  // Default değerler
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Sunucu hatası';
  let errors = err.errors || [];

  // Prisma hataları
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Bu kayıt zaten mevcut';
    const field = err.meta?.target?.[0];
    if (field) {
      errors = [{ field, message: `Bu ${field} zaten kullanılıyor` }];
    }
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Kayıt bulunamadı';
  }

  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'İlişkili kayıt bulunamadı';
  }

  // Joi Validation hataları
  if (err.isJoi) {
    statusCode = 400;
    message = 'Doğrulama hatası';
    errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
  }

  // JSON parse hataları
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Geçersiz JSON formatı';
  }

  // Loglama
  if (statusCode >= 500) {
    logger.error(`[${statusCode}] ${message}`, {
      url: req.originalUrl,
      method: req.method,
      stack: err.stack,
    });
  } else {
    logger.warn(`[${statusCode}] ${message}`, {
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.isDev && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`${req.originalUrl} bulunamadı`));
};

module.exports = { errorHandler, notFoundHandler };
