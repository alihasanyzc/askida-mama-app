# Middleware

Express middleware fonksiyonları.

## Middleware Tipleri

1. **Authentication**: Token doğrulama
2. **Authorization**: Yetki kontrolü
3. **Validation**: Request validation
4. **Error Handling**: Hata yönetimi
5. **Logging**: Request/Response loglama

## Örnek Kullanım

### Authentication Middleware

```javascript
// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Token bulunamadı');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Lütfen giriş yapın' });
  }
};
```

### Validation Middleware

```javascript
// middleware/validation.middleware.js
const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array() 
    });
  }
  
  next();
};
```

### Error Handler Middleware

```javascript
// middleware/errorHandler.middleware.js
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Logger Middleware

```javascript
// middleware/logger.middleware.js
module.exports = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });
  
  next();
};
```

## Best Practices

- Middleware'leri küçük ve odaklı tut
- Error handling için next(error) kullan
- Async middleware'ler için try-catch
- Global middleware'leri app.js'de tanımla
- Route-specific middleware'leri route'larda kullan
