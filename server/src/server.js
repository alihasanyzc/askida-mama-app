const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/prisma');

const PORT = env.PORT;

// Prisma bağlantısını kontrol et ve sunucuyu başlat
async function startServer() {
  try {
    // Veritabanı bağlantısını test et
    await prisma.$connect();
    logger.info('✅ Veritabanı bağlantısı başarılı');

    app.listen(PORT, () => {
      logger.info(`🚀 Server çalışıyor: http://localhost:${PORT}`);
      logger.info(`📋 API Docs: http://localhost:${PORT}/api/health`);
      logger.info(`🌍 Ortam: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('❌ Sunucu başlatılamadı:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM sinyali alındı. Sunucu kapatılıyor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT sinyali alındı. Sunucu kapatılıyor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Yakalanmamış hatalar
process.on('uncaughtException', (error) => {
  logger.error('Yakalanmamış hata:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('İşlenmeyen Promise rejection:', reason);
  process.exit(1);
});

startServer();
