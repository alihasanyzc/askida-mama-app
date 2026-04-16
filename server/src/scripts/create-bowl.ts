import { randomBytes } from 'node:crypto';

import { prisma } from '../config/prisma.js';

function buildQrCode() {
  return `BOWL-${randomBytes(4).toString('hex').toUpperCase()}`;
}

async function createBowl() {
  const qrCode = buildQrCode();

  const bowl = await prisma.bowl.create({
    data: {
      qr_code: qrCode,
      status: 'empty',
      latitude: 41.0082,
      longitude: 28.9784,
      address_line: 'Yunus Emre Mahallesi, Beyaz Cennet Sokak No:45, Pamukkale, Denizli',
      location_note: 'Park girisinin sag tarafinda, agacin hemen yani',
    },
    select: {
      id: true,
      qr_code: true,
      status: true,
      latitude: true,
      longitude: true,
      address_line: true,
      location_note: true,
      created_at: true,
    },
  });

  console.log('Bowl created');
  console.log(`id: ${bowl.id}`);
  console.log(`qr_code: ${bowl.qr_code}`);
  console.log(`status: ${bowl.status}`);
  console.log(`address_line: ${bowl.address_line ?? '-'}`);
}

createBowl()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
