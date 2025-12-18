# Controllers

Request/Response işlemlerini ve validation'ları yönetir.

## Sorumluluklar

1. HTTP request parametrelerini alma
2. Input validation
3. Service layer'ı çağırma
4. HTTP response gönderme
5. Error handling

## Örnek Kullanım

```javascript
// controllers/user.controller.js
const userService = require('../services/user.service');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Tüm alanlar zorunludur' 
      });
    }
    
    // Service layer'ı çağır
    const user = await userService.createUser({ email, password, name });
    
    // Response
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
};
```

## Best Practices

- Controller'lar business logic içermez
- Sadece request/response işlemleri
- Business logic service layer'da olmalı
- Error handling middleware'e delegate edilebilir
