const { PrismaClient } = require('@prisma/client');
const env = require('./env');

// Singleton pattern - tek bir PrismaClient instance'ı
let prisma;

if (env.isProd) {
  prisma = new PrismaClient({
    log: ['error'],
  });
} else {
  // Development'ta hot reload sorununu önlemek için global kullan
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

module.exports = prisma;
