const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed başlatılıyor...');

  // Bloglar
  const blogs = await Promise.all([
    prisma.blog.create({
      data: {
        title: 'Kedi Bakımında Temel İpuçları',
        content: 'Kedilerin sağlıklı bir yaşam sürmesi için dikkat edilmesi gereken temel noktalar...',
        summary: 'Kedi bakımı hakkında bilmeniz gereken her şey.',
        category: 'Bakım',
        author: 'Dr. Ayşe Yılmaz',
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
      },
    }),
    prisma.blog.create({
      data: {
        title: 'Sokak Hayvanlarına Nasıl Yardım Edebilirsiniz?',
        content: 'Sokak hayvanları için yapabileceğiniz basit ama etkili adımlar...',
        summary: 'Sokak hayvanlarına yardım rehberi.',
        category: 'Rehber',
        author: 'Mehmet Demir',
        imageUrl: 'https://images.unsplash.com/photo-1450778869180-cfe0112af41e',
      },
    }),
  ]);

  // Klinikler
  const clinics = await Promise.all([
    prisma.clinic.create({
      data: {
        name: 'PetVet Veteriner Kliniği',
        description: '7/24 acil veteriner hizmeti.',
        phone: '0212 555 1234',
        email: 'info@petvet.com',
        city: 'İstanbul',
        district: 'Kadıköy',
        address: 'Caferağa Mah. Moda Cad. No:12',
        latitude: 40.9876,
        longitude: 29.0235,
        rating: 4.8,
      },
    }),
    prisma.clinic.create({
      data: {
        name: 'Hayat Veteriner',
        description: 'Küçük hayvan cerrahisi ve dahiliye.',
        phone: '0216 444 5678',
        email: 'info@hayatvet.com',
        city: 'İstanbul',
        district: 'Beşiktaş',
        address: 'Sinanpaşa Mah. Ortabahçe Cad. No:8',
        latitude: 41.0422,
        longitude: 29.0052,
        rating: 4.5,
      },
    }),
  ]);

  // Etkinlikler
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Mama Toplama Kampanyası',
        description: 'Sokak hayvanları için mama toplama etkinliği.',
        date: new Date('2026-04-15'),
        endDate: new Date('2026-04-20'),
        location: 'Kadıköy Meydanı, İstanbul',
        latitude: 40.9903,
        longitude: 29.0241,
        imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Ücretsiz Kısırlaştırma Günü',
        description: 'Belediye destekli ücretsiz kısırlaştırma operasyonları.',
        date: new Date('2026-05-01'),
        location: 'Beşiktaş Belediyesi Hayvan Barınağı',
        latitude: 41.0422,
        longitude: 29.0052,
      },
    }),
  ]);

  console.log('✅ Seed tamamlandı!');
  console.log(`  📝 ${blogs.length} blog oluşturuldu`);
  console.log(`  🏥 ${clinics.length} klinik oluşturuldu`);
  console.log(`  📅 ${events.length} etkinlik oluşturuldu`);
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
