# Config

Uygulama yapılandırma dosyaları.

## Dosyalar

- **database.config.js**: Database connection
- **env.config.js**: Environment variables
- **app.config.js**: App settings
- **jwt.config.js**: JWT settings

## Örnek Kullanım

### Database Config

```javascript
// config/database.config.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Environment Config

```javascript
// config/env.config.js
require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // API
  API_VERSION: process.env.API_VERSION || 'v1',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
```

### App Config

```javascript
// config/app.config.js
module.exports = {
  app: {
    name: 'Askıda Mama',
    version: '1.0.0',
    description: 'Yardımlaşma Platformu API',
  },
  
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
};
```

## Best Practices

- Environment variables için .env kullan
- Sensitive data'yı config'de sakla
- Config dosyalarını version control'e ekleme
- Default values belirle
- Type checking yap
