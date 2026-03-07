const ApiError = require('../utils/ApiError');

/**
 * Joi Schema Validation Middleware
 * @param {Object} schema - Joi validation schema
 * @param {string} source - 'body' | 'query' | 'params'
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Tüm hataları topla
      stripUnknown: true, // Bilinmeyen alanları sil
      allowUnknown: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));

      return next(ApiError.badRequest('Doğrulama hatası', errors));
    }

    // Doğrulanmış ve temizlenmiş veriyi geri ata
    req[source] = value;
    next();
  };
};

module.exports = validate;
