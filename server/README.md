# Askıda Mama - Backend Server

Express.js + Supabase + Prisma ile Clean Architecture backend.

## 🏗️ Mimari

```
server/
├── prisma/                    # Prisma ORM
│   ├── schema.prisma          # Veritabanı modelleri
│   └── seed.js                # Seed verileri
├── src/
│   ├── config/                # Konfigürasyon
│   │   ├── env.js             # Environment değişkenleri
│   │   ├── supabase.js        # Supabase client
│   │   ├── prisma.js          # Prisma client (singleton)
│   │   └── cors.js            # CORS ayarları
│   ├── middleware/             # Express middleware'ler
│   │   ├── auth.middleware.js  # Supabase JWT doğrulama
│   │   ├── error.middleware.js # Global hata yakalama
│   │   ├── validate.middleware.js # Joi validation
│   │   └── rateLimit.middleware.js # Rate limiting
│   ├── routes/                # API endpoint tanımları
│   ├── controllers/           # Request handler'lar
│   ├── services/              # Business logic
│   ├── repositories/          # Data access (Prisma)
│   │   └── base/              # BaseRepository pattern
│   ├── validators/            # Joi validation şemaları
│   ├── utils/                 # Yardımcı araçlar
│   │   ├── ApiError.js        # Hata sınıfı
│   │   ├── ApiResponse.js     # Response formatı
│   │   ├── asyncHandler.js    # Async error wrapper
│   │   ├── helpers.js         # Pagination, sorting
│   │   └── logger.js          # Loglama
│   ├── app.js                 # Express app konfigürasyonu
│   └── server.js              # Entry point
```

## 📊 Katmanlı Mimari Akışı

```
Client Request
    ↓
Route (endpoint tanımı)
    ↓
Middleware (auth, validation, rate-limit)
    ↓
Controller (request/response işleme)
    ↓
Service (business logic)
    ↓
Repository (veritabanı erişimi - Prisma)
    ↓
Database (Supabase PostgreSQL)
```

## 🚀 Kurulum

```bash
cd server
npm install
```

### .env dosyasını yapılandır
```bash
cp .env.example .env
# .env dosyasını Supabase bilgilerinizle doldurun
```

### Prisma migration
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Sunucuyu başlat
```bash
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| **Auth** |
| POST | `/api/auth/register` | Kayıt ol | ❌ |
| POST | `/api/auth/login` | Giriş yap | ❌ |
| POST | `/api/auth/refresh-token` | Token yenile | ❌ |
| GET | `/api/auth/me` | Profil bilgisi | ✅ |
| POST | `/api/auth/logout` | Çıkış | ✅ |
| **Users** |
| GET | `/api/users/:id` | Profil görüntüle | ❌ |
| PUT | `/api/users/profile` | Profil güncelle | ✅ |
| POST | `/api/users/:id/follow` | Takip et | ✅ |
| DELETE | `/api/users/:id/follow` | Takipten çık | ✅ |
| **Posts** |
| GET | `/api/posts` | Gönderi listesi | ❌ |
| POST | `/api/posts` | Gönderi oluştur | ✅ |
| POST | `/api/posts/:id/like` | Beğen/Kaldır | ✅ |
| POST | `/api/posts/:id/comments` | Yorum ekle | ✅ |
| **Donations** |
| GET | `/api/donations` | Bağış listesi | ❌ |
| POST | `/api/donations` | Bağış oluştur | ✅ |
| GET | `/api/donations/stats` | İstatistikler | ❌ |
| **Bowls** |
| GET | `/api/bowls` | Mama kapları | ❌ |
| GET | `/api/bowls/nearby` | Yakındakiler | ❌ |
| POST | `/api/bowls` | Kap ekle | ✅ |
| POST | `/api/bowls/:id/fill` | Doldur | ✅ |
| **Announcements** |
| GET | `/api/announcements` | İlan listesi | ❌ |
| POST | `/api/announcements` | İlan oluştur | ✅ |
| **Events** |
| GET | `/api/events` | Etkinlikler | ❌ |
| GET | `/api/events/upcoming` | Yaklaşanlar | ❌ |
| **Blogs** |
| GET | `/api/blogs` | Blog listesi | ❌ |
| **Clinics** |
| GET | `/api/clinics` | Klinik listesi | ❌ |

## 🔧 Teknolojiler

- **Express.js** - HTTP server
- **Supabase** - Auth, Storage, Realtime
- **Prisma** - ORM (PostgreSQL)
- **Joi** - Validation
- **Helmet** - Güvenlik headers
- **Morgan** - HTTP logging
- **express-rate-limit** - Rate limiting
