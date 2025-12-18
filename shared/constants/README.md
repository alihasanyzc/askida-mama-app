# Shared Constants

Client ve Server arasında paylaşılan sabitler.

## Kullanım Amacı

- Tek source of truth
- Code duplication'ı önlemek
- Maintenance kolaylığı
- Consistency sağlamak

## Örnek Kullanım

```javascript
// constants/status.constants.js
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

export const DONATION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};
```

```javascript
// constants/errors.constants.js
export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'Yetkisiz erişim',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Geçersiz kullanıcı adı veya şifre',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Oturum süreniz doldu',
  [ERROR_CODES.NOT_FOUND]: 'Kayıt bulunamadı',
  [ERROR_CODES.ALREADY_EXISTS]: 'Bu kayıt zaten mevcut',
};
```

```javascript
// constants/roles.constants.js
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  DONOR: 'donor',
  RECIPIENT: 'recipient',
};

export const PERMISSIONS = {
  CREATE_DONATION: 'create:donation',
  VIEW_DONATION: 'view:donation',
  DELETE_DONATION: 'delete:donation',
  MANAGE_USERS: 'manage:users',
};
```

## Best Practices

- UPPERCASE naming convention
- Group related constants
- Export as objects
- Document complex constants
- Use in both client and server
