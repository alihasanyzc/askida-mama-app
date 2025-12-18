# Routes

API endpoint tanımlarını içerir.

## Örnek Kullanım

```javascript
// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
```

## Routes Yapısı

- **user.routes.js**: Kullanıcı işlemleri
- **donation.routes.js**: Bağış işlemleri
- **auth.routes.js**: Kimlik doğrulama
- **admin.routes.js**: Admin işlemleri

Her route dosyası ilgili controller'ı import eder ve HTTP method'larını tanımlar.
