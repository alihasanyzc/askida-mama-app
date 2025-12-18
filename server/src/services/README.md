# Services

Business logic ve veri işleme katmanı.

## Sorumluluklar

1. Business logic implementation
2. Database operations
3. Data transformation
4. External API calls
5. Complex calculations

## Örnek Kullanım

```javascript
// services/user.service.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(userData) {
    // Business logic: Password hashing
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Database operation
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });
    
    // Data transformation: Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return userResponse;
  }
  
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    return user;
  }
}

module.exports = new UserService();
```

## Best Practices

- Her service bir domain'e odaklanır (User, Donation, vb.)
- Service'ler reusable olmalı
- Complex business logic burada olmalı
- Database operations burada yapılır
- Pure functions tercih edilmeli
