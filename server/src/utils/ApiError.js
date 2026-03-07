/**
 * Özel API Hata Sınıfı
 * Express error middleware tarafından yakalanır
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods
  static badRequest(message = 'Geçersiz istek', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Yetkisiz erişim') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Bu işlem için yetkiniz yok') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Kayıt bulunamadı') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Bu kayıt zaten mevcut') {
    return new ApiError(409, message);
  }

  static tooManyRequests(message = 'Çok fazla istek gönderildi') {
    return new ApiError(429, message);
  }

  static internal(message = 'Sunucu hatası') {
    return new ApiError(500, message, [], false);
  }
}

module.exports = ApiError;
