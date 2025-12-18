# Shared Types

Client ve Server arasında paylaşılan TypeScript type definitions.

## Kullanım Amacı

- Type safety sağlamak
- API contract'ları tanımlamak
- Code duplication'ı önlemek
- Refactoring'i kolaylaştırmak

## Örnek Kullanım

```typescript
// types/user.types.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
```

```typescript
// types/donation.types.ts
export interface IDonation {
  id: string;
  donorId: string;
  recipientId?: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  message?: string;
  createdAt: Date;
}

export interface ICreateDonation {
  amount: number;
  message?: string;
}

export type DonationStatus = 'pending' | 'completed' | 'cancelled';
```

```typescript
// types/api.types.ts
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## Best Practices

- Interface'leri export et
- Generic types kullan
- Union types ile type safety artır
- Enum'lar yerine string literal types
- Optional properties için `?` kullan
