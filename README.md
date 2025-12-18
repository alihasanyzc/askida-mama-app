# Askıda Mama

Modern katmanlı mimariye sahip React Native + Express.js projesi.

## 📁 Proje Yapısı

```
askida-mama/
│
├── client/                    # React Native Frontend (Mobile App)
│   ├── index.js              # Entry point
│   ├── app.json              # Expo configuration
│   └── src/
│       ├── App.js            # Ana uygulama komponenti
│       ├── components/       # React bileşenleri
│       │   ├── common/       # Ortak/yeniden kullanılabilir bileşenler (Button, Input, Card, vb.)
│       │   └── layout/       # Layout bileşenleri (Header, Footer, Container, vb.)
│       ├── screens/          # Ekran bileşenleri (HomeScreen, ProfileScreen, vb.)
│       ├── navigation/       # Navigation yapılandırması (Stack, Tab, Drawer navigators)
│       ├── services/         # API servisleri (HTTP istekleri, API çağrıları)
│       ├── hooks/            # Custom React hooks (useAuth, useFetch, vb.)
│       ├── utils/            # Yardımcı fonksiyonlar (formatters, validators, vb.)
│       ├── constants/        # Sabitler (colors, API_URLS, config, vb.)
│       └── assets/           # Statik dosyalar
│           ├── images/       # Görseller
│           └── fonts/        # Font dosyaları
│
├── server/                   # Express.js Backend (REST API)
│   ├── src/
│   │   ├── controllers/      # Route handler'lar (business logic kontrolü)
│   │   ├── models/           # Database modelleri (Mongoose/Sequelize schemas)
│   │   ├── routes/           # API endpoint tanımları
│   │   ├── middleware/       # Express middleware'ler (auth, validation, error handling)
│   │   ├── services/         # Business logic servisleri
│   │   ├── config/           # Yapılandırma dosyaları (database, env, vb.)
│   │   └── utils/            # Yardımcı fonksiyonlar
│   └── tests/                # Backend testleri (unit, integration tests)
│
└── shared/                   # Client ve Server arasında paylaşılan kod
    ├── types/                # TypeScript type definitions (interfaces, types)
    └── constants/            # Paylaşılan sabitler (status codes, error messages, vb.)
```

## 🚀 Kurulum ve Çalıştırma

### Root Dependencies
```bash
npm install
```

### Frontend (Client)
```bash
npm start
# veya
npm run android
npm run ios
npm run web
```

### Backend (Server)
```bash
cd server
npm install
npm start
```

## 🏗️ Mimari Prensipleri

### 📱 Client (React Native - Expo)

**Presentation Layer (Sunum Katmanı)**
- `screens/`: Sayfalar, kullanıcı arayüzü
- `components/`: Yeniden kullanılabilir UI bileşenleri
- `navigation/`: Sayfa geçişleri ve routing

**Business Logic Layer (İş Mantığı Katmanı)**
- `hooks/`: Custom hooks ile state management
- `services/`: API communication layer
- `utils/`: Helper functions

**Data Layer (Veri Katmanı)**
- `constants/`: Uygulama sabitleri
- `assets/`: Statik veriler

### 🖥️ Server (Express.js)

**Routes Layer → Controllers Layer → Services Layer → Models Layer**

1. **Routes**: HTTP endpoints tanımlar
2. **Controllers**: Request/Response işlemleri, validation
3. **Services**: Business logic, veri işleme
4. **Models**: Database schema ve operations

**Cross-cutting Concerns**
- `middleware/`: Authentication, logging, error handling
- `config/`: Yapılandırma yönetimi
- `utils/`: Yardımcı fonksiyonlar

### 🔄 Shared

- **types/**: TypeScript type safety için ortak tipler
- **constants/**: Client ve Server'da kullanılan sabitler
- **DRY Principle**: Kod tekrarını önler

## 📝 Geliştirme Kuralları

1. **Separation of Concerns**: Her katman kendi sorumluluğuna odaklanır
2. **Single Responsibility**: Her dosya/fonksiyon tek bir işten sorumlu
3. **DRY (Don't Repeat Yourself)**: Kod tekrarından kaçının
4. **Clean Code**: Okunabilir, anlaşılır kod yazın
5. **Type Safety**: Mümkün olduğunca TypeScript kullanın

## 🔧 Teknolojiler

**Frontend**
- React Native + Expo
- React Navigation (navigation)
- Axios (HTTP client)

**Backend** (Planlanıyor)
- Express.js
- MongoDB/PostgreSQL
- JWT Authentication

**Shared**
- TypeScript
