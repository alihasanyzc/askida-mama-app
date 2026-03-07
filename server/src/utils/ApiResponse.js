/**
 * Standart API Response yapısı
 * Tüm API yanıtları bu format ile döner
 */
class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  // Factory methods
  static success(data, message = 'İşlem başarılı', meta = null) {
    return new ApiResponse(200, message, data, meta);
  }

  static created(data, message = 'Kayıt oluşturuldu') {
    return new ApiResponse(201, message, data);
  }

  static noContent(message = 'İşlem başarılı') {
    return new ApiResponse(204, message);
  }

  // Response gönderme helper'ı
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      ...(this.meta && { meta: this.meta }),
    });
  }
}

module.exports = ApiResponse;
