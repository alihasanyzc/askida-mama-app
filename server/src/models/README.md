# Models

Database schema tanımları ve model işlemleri.

## Sorumluluklar

1. Database schema definition
2. Data validation
3. Schema methods
4. Virtual fields
5. Hooks/Middleware

## Örnek Kullanım (Mongoose)

```javascript
// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim zorunludur'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email zorunludur'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: 6,
    select: false // Default query'lerde password dönmesin
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // createdAt, updatedAt otomatik
});

// Virtual field
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

module.exports = mongoose.model('User', userSchema);
```

## Model Yapısı

- **user.model.js**: Kullanıcı şeması
- **donation.model.js**: Bağış şeması
- **transaction.model.js**: İşlem şeması
- **notification.model.js**: Bildirim şeması

## Best Practices

- Validation kurallarını model'de tanımla
- Sensitive data için `select: false` kullan
- Virtual fields ile computed properties
- Index'leri performans için kullan
- Timestamps her model'de olmalı
