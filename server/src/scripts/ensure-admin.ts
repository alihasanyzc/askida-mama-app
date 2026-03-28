import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { supabase, supabaseAdmin } from '../config/supabase.js';

async function ensureAdmin() {
  const existingProfile = await prisma.profile.findUnique({
    where: {
      username: env.ADMIN_USERNAME,
    },
  });

  if (existingProfile) {
    await prisma.profile.update({
      where: {
        id: existingProfile.id,
      },
      data: {
        role: 'admin',
      },
    });

    console.log(`Admin already exists: ${env.ADMIN_EMAIL}`);
    console.log(`Admin password: ${env.ADMIN_PASSWORD}`);
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: env.ADMIN_FULL_NAME,
      username: env.ADMIN_USERNAME,
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? 'Failed to create admin auth user');
  }

  await prisma.profile.create({
    data: {
      id: data.user.id,
      full_name: env.ADMIN_FULL_NAME,
      username: env.ADMIN_USERNAME,
      role: 'admin',
    },
  });

  const loginResult = await supabase.auth.signInWithPassword({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  });

  if (loginResult.error) {
    throw new Error(loginResult.error.message);
  }

  console.log(`Admin email: ${env.ADMIN_EMAIL}`);
  console.log(`Admin password: ${env.ADMIN_PASSWORD}`);
}

ensureAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
